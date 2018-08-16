import axios, {AxiosInstance} from 'axios';
import Routing from './Routing';
import Constants from './Constants';
import Routes from "./Routes";
import MockAdapter from "axios-mock-adapter";
import Authentication from "./Authentication";

class RequestConfigBuilder {
    private mContent?: any;
    private mContentType: string;
    private mParams?: {};
    private mAccept: string;

    constructor() {
        this.mContentType = Constants.JSON_LD_MIME_TYPE;
        this.mAccept = Constants.JSON_LD_MIME_TYPE;
    }

    public content(value: any): RequestConfigBuilder {
        this.mContent = value;
        return this;
    }

    public contentType(value: string): RequestConfigBuilder {
        this.mContentType = value;
        return this;
    }

    public params(value: {}): RequestConfigBuilder {
        this.mParams = value;
        return this;
    }

    public accept(value: string): RequestConfigBuilder {
        this.mAccept = value;
        return this;
    }

    public getContent() {
        return this.mContent;
    }

    public getContentType() {
        return this.mContentType;
    }

    public getParams() {
        return this.mParams;
    }

    public getAccept() {
        return this.mAccept;
    }
}

export function content(value: any): RequestConfigBuilder {
    return new RequestConfigBuilder().content(value);
}

export function params(value: {}): RequestConfigBuilder {
    return new RequestConfigBuilder().params(value);
}

export function accept(value: string): RequestConfigBuilder {
    return new RequestConfigBuilder().accept(value);
}

export class Ajax {

    protected axiosInstance = axios.create({
        baseURL: Constants.SERVER_URL
    });

    constructor() {
        this.axiosInstance.interceptors.request.use(reqConfig => {
            reqConfig.headers[Constants.AUTHENTICATION_HEADER] = Authentication.loadToken();
            return reqConfig;
        });
        this.axiosInstance.interceptors.response.use((resp) => {
            return resp;
        }, (error) => {
            if (!error.response) {
                return Promise.reject({
                    messageId: 'connection.error'
                });
            }
            const response = error.response;
            if (response.status === 401) {
                Routing.transitionTo(Routes.login);
            }
            if (typeof response.data === "string") {
                return Promise.reject({
                    messageId: 'ajax.unparseable-error'
                });
            } else {
                return Promise.reject(response.data);
            }
        });
        if (process.env.REACT_APP_MOCK_REST_API) {
            // Mock backend REST API if the environment is configured to do so
            mockRestApi(this.axiosInstance);
        }
    }

    public get(path: string, config?: RequestConfigBuilder) {
        let conf;
        if (config) {
            conf = {
                params: config.getParams(),
                headers: {
                    'Accept': config.getAccept()
                }
            };
        }
        return this.axiosInstance.get(path, conf).then(resp => resp.data);
    }

    public post(path: string, config: RequestConfigBuilder) {
        if (config.getParams()) {
            const par = new URLSearchParams();
            // Asserting that config.getParams() are not undefined (as verified by the if condition)
            const p: {} = config.getParams()!;
            Object.keys(p).forEach(n => par.append(n, p[n]));
            return this.axiosInstance.post(path, par, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
        } else {
            const conf = {
                headers: {
                    'Content-Type': config.getContentType()
                }
            };
            return this.axiosInstance.post(path, config.getContent(), conf);
        }
    }

    public put(path: string, config: RequestConfigBuilder) {
        const conf = {
            params: config.getParams(),
            headers: {
                'Accept': config.getAccept(),
                'Content-Type': config.getContentType()
            }
        };
        return this.axiosInstance.put(path, config.getContent(), conf);
    }

    public delete(path: string, config?: RequestConfigBuilder) {
        let conf;
        if (config) {
            conf = {
                params: config.getParams()
            };
        }
        return this.axiosInstance.delete(path, conf);
    }
}

function mockRestApi(axiosInst: AxiosInstance): void {
    const mock = new MockAdapter(axiosInst, {delayResponse: 500});
    // Mock current user data
    mock.onGet(Constants.API_PREFIX + '/users/current').reply(200, require('../rest-mock/current'));
    // Mock login return value
    mock.onPost('/j_spring_security_check').reply(200, {
        loggedIn: true,
        success: true
    }, {
        'authentication': 'jwt12345'
    });
    // Mock vocabulary IRI generator
    mock.onGet(Constants.API_PREFIX + '/vocabularies/identifier').reply(200, 'http://onto.fel.cvut.cz/ontologies/termit/vocabulary/test');
    // Mock vocabulary create endpoint
    mock.onPost(Constants.API_PREFIX + '/vocabularies').reply(201, null, {
        'location': 'http://kbss.felk.cvut.cz/termit/rest/vocabularies/metropolitan-plan'
    });
    // Mock vocabulary retrieval endpoint
    mock.onGet(Constants.API_PREFIX + "/vocabularies/metropolitan-plan").reply(200, require('../rest-mock/vocabulary'), {
        'content-type': Constants.JSON_LD_MIME_TYPE
    });
}

const instance = new Ajax();

export default instance;