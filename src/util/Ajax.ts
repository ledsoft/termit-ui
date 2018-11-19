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

    public param(paramName: string, paramValue?: string): RequestConfigBuilder {
        const p = {};
        p[paramName] = paramValue;
        this.mParams = Object.assign({}, this.mParams, p);
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

export function param(paramName: string, value?: string) {
    return new RequestConfigBuilder().param(paramName, value);
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
            if (resp.headers && resp.headers[Constants.AUTHORIZATION_HEADER]) {
                Authentication.saveToken(resp.headers[Constants.AUTHORIZATION_HEADER]);
            }
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
    const header = {};
    header[Constants.AUTHORIZATION_HEADER] = '12345';
    // Mock current user data
    mock.onGet(Constants.API_PREFIX + '/users/current').reply(200, require('../rest-mock/current'), header);
    // Mock login return value
    mock.onPost('/j_spring_security_check').reply(200, {
        loggedIn: true,
        success: true
    }, header);
    // Mock registration request
    mock.onPost(Constants.API_PREFIX + '/users').reply(201);
    // Mock username existence check
    mock.onGet(Constants.API_PREFIX + '/users/username').reply((config: AxiosRequestConfig) => {
        if (config.params.username.charAt(0) === 'a') {
            return [200, true];
        } else {
            return [200, false]
        }
    }, header);
    // Mock vocabulary IRI generator
    mock.onGet(Constants.API_PREFIX + '/vocabularies/identifier').reply(200, 'http://onto.fel.cvut.cz/ontologies/termit/vocabulary/test', header);
    // Mock get vocabularies
    mock.onGet(Constants.API_PREFIX + '/vocabularies').reply(200, require('../rest-mock/vocabularies'), header);
    // Mock vocabulary create endpoint
    mock.onPost(Constants.API_PREFIX + '/vocabularies').reply(201, null, Object.assign({}, header, {
        'location': 'http://kbss.felk.cvut.cz/termit/rest/vocabularies/metropolitan-plan'
    }));
    // mock.onPost(Constants.API_PREFIX + '/vocabularies').reply(500, {
    //     message: 'Unable to create vocabulary!'
    // });
    // Mock term IRI generator
    mock.onGet(/\/rest\/vocabularies\/.+\/terms\/identifier/).reply(200, 'http://onto.fel.cvut.cz/ontologies/termit/vocabulary/test/term-one', header);
    // Mock getting subterms of a vocabulary term
    mock.onGet(/\/rest\/vocabularies\/.+\/terms\/.+\/subterms/).reply((config) => {
        const url: string = config.url!;
        if (url.indexOf('pojem-4')) {
            return [200, require('../rest-mock/subterms'), header];
        } else {
            return [200, [], header];
        }
    });
    // Mock getting vocabulary term
    mock.onGet(/\/rest\/vocabularies\/.+\/terms\/.+/).reply((config) => {
        const url: string = config.url!;
        const termId = url.substring(url.lastIndexOf('/') + 1);
        const terms = require('../rest-mock/terms');
        for (const t of terms) {
            if (t['@id'].indexOf(termId) !== -1) {
                return [200, t, header];
            }
        }
        return [404, undefined, header];
    });
    // Mock get vocabulary terms
    mock.onGet(/\/rest\/vocabularies\/.+\/terms/).reply(() => {
        return [200, require('../rest-mock/terms'), header];
    });

    // Mock term label uniqueness in vocabulary check
    mock.onGet(/\/rest\/vocabularies\/.+\/terms\/name/).reply((config: AxiosRequestConfig) => {
        if (config.params.value === 'test') {
            return [200, true];
        } else {
            return [200, false];
        }
    });
    // Mock vocabulary retrieval endpoint
    mock.onGet(/\/rest\/vocabularies\/.+/).reply(200, require('../rest-mock/vocabulary'), Object.assign({}, header, {
        'content-type': Constants.JSON_LD_MIME_TYPE
    }));
    // Mock resource retrieval endpoint
    mock.onGet(/\/rest\/resources\/.+/).reply(200, require('../rest-mock/resource'), Object.assign({}, header, {
        'content-type': Constants.JSON_LD_MIME_TYPE
    }));
    // Mock vocabulary update endpoint
    mock.onPut(/\/rest\/vocabularies\/.+/).reply(204, undefined, header);

    mock.onGet(/\/rest\/query/).reply((config) => {
        if (config.params.query.includes("?asset")) {
            return [200, require('../rest-mock/assetCount'), header]
        } else if (config.params.query.includes("?typ")) {
            return [200, require('../rest-mock/termTypeFrequency'), header]
        } else {
            return [200, [], header];
        }
    });

    // Mock label search results
    mock.onGet('rest/search/label').reply(200, require('../rest-mock/searchResults'), header);

    // Mock get document
    mock.onGet(/\/rest\/language\/types/).reply(200, require('../rest-mock/types'), header);

    // Mock document
    mock.onPut(/\/rest\/documents\/.+\/text-analysis/).reply(202, null, header);

    // Mock get file content
    mock.onGet(/\/rest\/documents\/.+\/content/).reply(200, fileContent, Object.assign({}, header, {'content-type': Constants.HTML_MIME_TYPE}));

    // Mock get document
    mock.onGet(/\/rest\/documents\/.+/).reply(200, require('../rest-mock/document'), header);

    // Mock term update
    mock.onPut(/\/rest\/vocabularies\/.+\/terms\/.+/).reply(204, null, header);
    // Mock get label
    mock.onGet(Constants.API_PREFIX + '/data/label').reply(config => {
        const iri: string = config.params.iri;
        return [200, iri.substring(iri.lastIndexOf('/') + 1), header];
    });
}

const instance = new Ajax();

export default instance;