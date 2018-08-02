import axios from 'axios';
import Routing from './Routing';
import Constants from './Constants';
import ErrorInfo from "../model/ErrorInfo";

class RequestConfigBuilder {
    private mContent?: any;
    private mContentType: string;
    private mParams?: {};
    private mAccept: string;

    constructor() {
        this.mContentType = 'application/json';
        this.mAccept = 'application/json';
    }

    public content(value: any): RequestConfigBuilder {
        this.content = value;
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

class Ajax {

    private axiosInstance = axios.create({
        baseURL: Constants.SERVER_URL
    });

    constructor() {
        this.axiosInstance.interceptors.response.use((resp) => {
            return resp;
        }, (error) => {
            if (!error.response) {
                return Promise.reject(new ErrorInfo(Constants.CONNECTION_ERROR, {
                    message: 'Unable to connect to ' + this.axiosInstance.defaults.baseURL
                }));
            }
            if (error.response.status === 401) {
                Routing.transitionToHome();
            }
            return Promise.reject(error);
        })
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
            return this.axiosInstance.post(path, par);
        } else {
            const conf = {
                data: config.getContent(),
                headers: {
                    'Content-Type': config.getContentType()
                }
            };
            return this.axiosInstance.post(path, conf);
        }
    }

    public put(path: string, config: RequestConfigBuilder) {
        const conf = {
            data: config.getContent(),
            headers: {
                'Accept': config.getAccept(),
                'Content-Type': config.getContentType()
            }
        };
        return this.axiosInstance.put(path, conf);
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

const instance = new Ajax();

export default instance;