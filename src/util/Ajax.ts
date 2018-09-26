import axios, {AxiosInstance, AxiosRequestConfig} from 'axios';
import Routing from './Routing';
import Constants from './Constants';
import Routes from "./Routes";
import MockAdapter from "axios-mock-adapter";
import Authentication from "./Authentication";
import fileContent from "../rest-mock/file";

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
            reqConfig.headers[Constants.AUTHORIZATION_HEADER] = Authentication.loadToken();
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
            if (response.status === Constants.STATUS_UNAUTHORIZED) {
                Routing.transitionTo(Routes.login);
            }
            if (typeof response.data === "string") {
                return Promise.reject({
                    messageId: 'ajax.unparseable-error',
                    status: response.status
                });
            } else {
                return Promise.reject(Object.assign({}, response.data, {status: response.status}));
            }
        });
        if (process.env.REACT_APP_MOCK_REST_API) {
            // Mock backend REST API if the environment is configured to do so
            mockRestApi(this.axiosInstance);
        }
    }

    public get(path: string, config: RequestConfigBuilder = new RequestConfigBuilder()) {
        const conf = {
            params: config.getParams(),
            headers: {
                'Accept': config.getAccept()
            }
        };
        return this.axiosInstance.get(path, conf).then(resp => resp.data);
    }

    public post(path: string, config: RequestConfigBuilder) {
        const conf = {
            headers: {
                'Content-Type': config.getContentType()
            }
        };
        const par = new URLSearchParams();
        // @ts-ignore
        const paramData: object = config.getParams() !== undefined ? config.getParams() : {};
        Object.keys(paramData).forEach(n => par.append(n, paramData[n]));

        if (config.getContentType() === Constants.X_WWW_FORM_URLENCODED) {
            return this.axiosInstance.post(path, par, conf);
        } else {
            const query: string = config.getParams() ? "?" + par.toString() : "";
            return this.axiosInstance.post(path + query, config.getContent(), conf);
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
        'authorization': 'jwt12345'
    });
    // Mock registration request
    mock.onPost(Constants.API_PREFIX + '/users').reply(201);
    // Mock username existence check
    mock.onGet(Constants.API_PREFIX + '/users/username').reply((config: AxiosRequestConfig) => {
        if (config.params.username.charAt(0) === 'a') {
            return [200, true];
        } else {
            return [200, false]
        }
    });
    // Mock vocabulary IRI generator
    mock.onGet(Constants.API_PREFIX + '/vocabularies/identifier').reply(200, 'http://onto.fel.cvut.cz/ontologies/termit/vocabulary/test');
    // Mock get vocabularies
    mock.onGet(Constants.API_PREFIX + '/vocabularies').reply(200, require('../rest-mock/vocabularies'));
    // Mock vocabulary create endpoint
    mock.onPost(Constants.API_PREFIX + '/vocabularies').reply(201, null, {
        'location': 'http://kbss.felk.cvut.cz/termit/rest/vocabularies/metropolitan-plan'
    });
    // mock.onPost(Constants.API_PREFIX + '/vocabularies').reply(500, {
    //     message: 'Unable to create vocabulary!'
    // });
    // Mock vocabulary retrieval endpoint
    mock.onGet(/\/rest\/vocabularies\/.+/).reply(200, require('../rest-mock/vocabulary'), {
        'content-type': Constants.JSON_LD_MIME_TYPE
    });
    mock.onGet(/\/rest\/query.+/).reply(200, require('../rest-mock/queryResult'));
    // Mock label search results
    mock.onGet('rest/search/label').reply(200, require('../rest-mock/searchResults'));

    // Mock get file content
    mock.onGet(/\/rest\/documents\/.+\/content/).reply(200, fileContent, {'content-type': Constants.HTML_MIME_TYPE});

    // Mock get document
    mock.onGet(/\/rest\/documents\/.+/).reply(200, require('../rest-mock/document'));
}

const instance = new Ajax();

export default instance;