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
    private mFormData?: {};
    private mAccept: string;
    private mResponseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream';

    constructor() {
        this.mContentType = Constants.JSON_LD_MIME_TYPE;
        this.mAccept = Constants.JSON_LD_MIME_TYPE;
        this.mResponseType = undefined;
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

    public formData(value: {}): RequestConfigBuilder {
        this.mFormData = value;
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

    public responseType(value: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'): RequestConfigBuilder {
        this.mResponseType = value;
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

    public getFormData() {
        return this.mFormData;
    }

    /**
     * This should be used sparsely.
     *
     * It is mainly to support downloading binary files.
     */
    public getResponseType() {
        return this.mResponseType;
    }
}

export function content(value: any): RequestConfigBuilder {
    return new RequestConfigBuilder().content(value);
}

export function contentType(value: string): RequestConfigBuilder {
    return new RequestConfigBuilder().contentType(value);
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
            },
            responseType: config.getResponseType()
        };
        return this.axiosInstance.get(path, conf).then(resp => resp.data);
    }

    /**
     * Performs a GET request and returns the raw Axios response object.
     *
     * This is in contrast to "get", which returns only the response body.
     * @param path URL path
     * @param config request configuration
     */
    public getRaw(path: string, config: RequestConfigBuilder = new RequestConfigBuilder()) {
        const conf = {
            params: config.getParams(),
            headers: {
                'Accept': config.getAccept(),
            },
            responseType: 'arraybuffer'
        };
        return this.axiosInstance.get(path, conf);
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

        const formData: object = config.getFormData() !== undefined ? config.getFormData()! : {};

        if (config.getContentType() === Constants.X_WWW_FORM_URLENCODED) {
            return this.axiosInstance.post(path, par, conf);
        } else if (config.getContentType() === Constants.MULTIPART_FORM_DATA) {
            return this.axiosInstance.post(path, formData, conf);
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

    // Mock getting term assignments
    mock.onGet(/\/rest\/vocabularies\/.+\/terms\/.+\/assignments/).reply(config => {
        const iri = config.url;
        const head = Object.assign({}, header, {
            'content-type': Constants.JSON_LD_MIME_TYPE
        });
        if (iri!.indexOf("pojem-1") !== -1 || iri!.indexOf("pojem-2") !== -1) {
            return [200, require("../rest-mock/termAssignments.json"), head];
        } else {
            return [200, [], head];
        }
    });

    // Mock term creation
    mock.onPost(/\/rest\/vocabularies\/.+\/terms/).reply(201, null, Object.assign({}, header, {
        'location': 'http://kbss.felk.cvut.cz/termit/rest/vocabularies/metropolitan-plan/terms/test-term'
    }));

    // Mock getting vocabulary terms
    mock.onGet(/\/rest\/vocabularies\/.+\/terms\/roots/).reply(200, require("../rest-mock/terms"), header);

    // Mock term update
    mock.onPut(/\/rest\/vocabularies\/.+\/terms\/.+/).reply(204, null, header);

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

    // Mock term label uniqueness in vocabulary check
    mock.onGet(/\/rest\/vocabularies\/.+\/terms\/name/).reply((config: AxiosRequestConfig) => {
        if (config.params.value === 'test') {
            return [200, true];
        } else {
            return [200, false];
        }
    });

    // Mock vocabulary terms export
    mock.onGet(/\/rest\/vocabularies\/.+\/terms/).reply((config: AxiosRequestConfig) => {
        if (config.headers.Accept === Constants.CSV_MIME_TYPE) {
            const exportData = "IRI,Label,Comment,Types,Sources,SubTerms\nhttp://test.org,Test,Test comment,,,";
            const attachmentHeader = {};
            attachmentHeader[Constants.CONTENT_DISPOSITION_HEADER] = "attachment; filename=\"export.csv\"";
            return [200, exportData, Object.assign({}, header, attachmentHeader)];
        }
        return [415, null];
    });

    // Mock vocabulary retrieval endpoint
    mock.onGet(/\/rest\/vocabularies\/.+/).reply(200, require('../rest-mock/vocabulary'), Object.assign({}, header, {
        'content-type': Constants.JSON_LD_MIME_TYPE
    }));
    // Mock resources
    mock.onGet(Constants.API_PREFIX + '/resources').reply(200, require('../rest-mock/resources'), header);

    // Mock resource IRI generator
    mock.onGet(Constants.API_PREFIX + "/resources/identifier").reply(200, "http://onto.fel.cvut.cz/ontologies/termit/resource/test-resource", header);

    // Mock text analysis invocation
    mock.onPut(/\/rest\/resources\/.+\/text-analysis/).reply(202, null, header);

    // Mock getting file content
    mock.onGet(/\/rest\/resources\/.+\/content/).reply(200, fileContent, Object.assign({}, header, {'content-type': Constants.HTML_MIME_TYPE}));

    // Mock update file content
    mock.onPost(/\/rest\/resources\/.+\/content/).reply(204, fileContent, Object.assign({}, header, {'content-type': Constants.HTML_MIME_TYPE}));

    // Mock resource terms retrieval endpoint
    mock.onGet(/\/rest\/resources\/.+\/terms/).reply(200, require('../rest-mock/resourceTerms'), Object.assign({}, header, {
        'content-type': Constants.JSON_LD_MIME_TYPE
    }));
    // Mock resource retrieval endpoint
    mock.onGet(/\/rest\/resources\/.+/).reply(config => {
        if (config.params.namespace && config.params.namespace.indexOf("document") !== -1) {
            return [200, require('../rest-mock/document'), Object.assign({}, header, {
                'content-type': Constants.JSON_LD_MIME_TYPE
            })];
        } else {
            return [200, require('../rest-mock/resource'), Object.assign({}, header, {
                'content-type': Constants.JSON_LD_MIME_TYPE
            })];
        }
    });
    // Mock resource creation
    mock.onPost(Constants.API_PREFIX + "/resources").reply(201, null, Object.assign({}, header, {
        "location": "http://onto.fel.cvut.cz/ontologies/application/termit/randomInstance-1529066498"
    }));

    // Mock resource tags update
    mock.onPut('/rest/resources/resource/terms').reply(204, null, header);

    // Mock vocabulary update endpoint
    mock.onPut(/\/rest\/vocabularies\/.+/).reply(204, undefined, header);

    mock.onGet(/\/rest\/query/).reply((config) => {
        if (config.params.query.includes("?asset")) {
            return [200, require('../rest-mock/assetCount'), header]
        } else if (config.params.query.includes("DISTINCT ?pojem")) {
            return [200, require('../rest-mock/termFrequency'), header]
        } else if (config.params.query.includes("?typ")) {
            return [200, require('../rest-mock/termTypeFrequency'), header]
        } else {
            return [200, [], header];
        }
    });

    // Mock label search results
    mock.onGet(Constants.API_PREFIX + '/search/label').reply(200, require('../rest-mock/searchResults'), header);

    // Mock get types
    mock.onGet(/\/rest\/language\/types/).reply(200, require('../rest-mock/types'), header);

    // Mock get label
    mock.onGet(Constants.API_PREFIX + '/data/label').reply(config => {
        const iri: string = config.params.iri;
        if (iri.indexOf('#') !== -1) {
            return [404, undefined, header];
        }
        return [200, iri.substring(iri.lastIndexOf('/') + 1), header];
    });
    // Mock getting known properties
    mock.onGet(Constants.API_PREFIX + "/data/properties").reply(200, require("../rest-mock/properties"), Object.assign({}, header, {
        'content-type': Constants.JSON_LD_MIME_TYPE
    }));
    // Mock creating new property
    mock.onPost(Constants.API_PREFIX + "/data/properties").reply(201, undefined, Object.assign({}, header, {
        'location': 'http://kbss.felk.cvut.cz/termit/rest/data/properties'
    }));
    // Mock getting last edited assets
    mock.onGet(Constants.API_PREFIX + "/assets/last-edited").reply(200, require("../rest-mock/lastEditedAssets")), Object.assign({}, header, {
        'content-type': Constants.JSON_LD_MIME_TYPE
    });
}

const instance = new Ajax();

export default instance;
