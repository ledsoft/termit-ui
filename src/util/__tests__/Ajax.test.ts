import MockAdapter from 'axios-mock-adapter';
import {accept, Ajax, content, params} from '../Ajax';
import Routing from '../Routing';
import {EMPTY_USER} from "../../model/User";
import Constants from "../Constants";
import Routes from '../Routes';
import {AxiosInstance} from "axios";

jest.mock('../Routing');

export class MockableAjax extends Ajax {
    get axios(): AxiosInstance {
        return this.axiosInstance;
    }
}

describe('Ajax', () => {

    const sut = new MockableAjax();
    const mock = new MockAdapter(sut.axios);

    beforeEach(() => {
        mock.reset();
    });

    describe('error handling', () => {
        it('directly transitions to login route when Unauthorized is received', () => {
            mock.onGet('/users/current').reply(401);
            return sut.get('/users/current').catch(() => {
                return expect(Routing.transitionTo).toHaveBeenCalledWith(Routes.login);
            });
        });

        it('returns connection error object when network error occurs', () => {
            mock.onAny().networkError();
            return sut.get('/users/current').catch(error => {
                expect(error.messageId).toBeDefined();
                return expect(error.messageId).toEqual('connection.error');
            });
        });

        it('returns error object when it is error info in JSON', () => {
            const errorObj = {
                message: 'Validation of record failed',
                requestUrl: '/users/current'
            };
            mock.onAny().reply(409, errorObj);
            return sut.put('/users/current', content(EMPTY_USER)).catch(error => {
                return expect(error).toEqual(errorObj);
            });
        });

        it('returns unparseable error info message when response indicates error but its content is not error info in JSON', () => {
            mock.onAny().reply(500, "<html>Fatal error occurred on server</html>");
            return sut.get('/users').catch(error => {
                expect(error.messageId).toBeDefined();
                return expect(error.messageId).toEqual('ajax.unparseable-error');
            });
        });
    });

    describe('request configuration', () => {

        it('puts query parameters into GET request url', () => {
            const qParams = {
                page: '1',
                size: '100'
            };
            mock.onAny().reply(200, {});
            const spy = jest.spyOn(sut.axios, 'get');
            spy.mockClear();    // Safeguard because the spy tends to leak into subsequent test specs
            return sut.get('/terms', params(qParams)).then(() => {
                const reqConfig = spy.mock.calls[0][1];
                return expect(reqConfig.params).toEqual(qParams);
            });
        });

        it('it adds JSON-LD Accept header by default', () => {
            mock.onAny().reply(200, {});
            const spy = jest.spyOn(sut.axios, 'get');
            spy.mockClear();
            return sut.get('/terms/count').then(() => {
                const reqConfig = spy.mock.calls[0][1];
                return expect(reqConfig.headers.Accept).toEqual(Constants.JSON_LD_MIME_TYPE);
            });
        });

        it('adds accept header into GET request', () => {
            const acceptType = 'text/plain';
            mock.onAny().reply(200, {});
            const spy = jest.spyOn(sut.axios, 'get');
            spy.mockClear();
            return sut.get('/terms/count', accept(acceptType)).then(() => {
                const reqConfig = spy.mock.calls[0][1];
                return expect(reqConfig.headers.Accept).toEqual(acceptType);
            });
        });

        it('adds content with specified content type in POST', () => {
            const data = EMPTY_USER;
            const mimeType = "application/json";
            mock.onPost().reply(201);
            const spy = jest.spyOn(sut.axios, 'post');
            spy.mockClear();
            return sut.post('/users', content(data).contentType(mimeType)).then(() => {
                const reqData = spy.mock.calls[0][1];
                const reqConfig = spy.mock.calls[0][2];
                expect(reqData).toEqual(data);
                return expect(reqConfig.headers['Content-Type']).toEqual(mimeType);
            });
        });

        it('adds form params to POST as URLSearchParams', () => {
            const formData = {
                username: 'halsey@unsc.org',
                password: '117'
            };
            mock.onPost().reply(201);
            const spy = jest.spyOn(sut.axios, 'post');
            spy.mockClear();
            return sut.post('/users', params(formData)).then(() => {
                const reqConfig = spy.mock.calls[0][2];
                expect(reqConfig.headers['Content-Type']).toEqual("application/x-www-form-urlencoded");
                const expParams = new URLSearchParams();
                expParams.append('username', formData.username);
                expParams.append('password', formData.password);
                return expect(spy.mock.calls[0][1]).toEqual(expParams);
            });
        });

        it('adds content with specified content type in PUT', () => {
            const data = EMPTY_USER;
            const mimeType = "application/json";
            mock.onPut().reply(204);
            const spy = jest.spyOn(sut.axios, 'put');
            spy.mockClear();
            return sut.put('/users/current', content(data).contentType(mimeType)).then(() => {
                const reqData = spy.mock.calls[0][1];
                const reqConfig = spy.mock.calls[0][2];
                expect(reqData).toEqual(data);
                return expect(reqConfig.headers['Content-Type']).toEqual(mimeType);
            });
        });

        it('adds accept header in PUT', () => {
            const mimeType = 'text/plain';
            mock.onPut().reply(204);
            const spy = jest.spyOn(sut.axios, 'put');
            spy.mockClear();
            return sut.put('/users/status', accept(mimeType)).then(() => {
                const reqConfig = spy.mock.calls[0][2];
                return expect(reqConfig.headers.Accept).toEqual(mimeType);
            });
        });

        it('adds params in PUT', () => {
            const qParams = {
                key: 'http://kbss.felk.cvut.cz/termit/users/Catherine+Halsey'
            };
            const data = EMPTY_USER;
            mock.onPut().reply(204);
            const spy = jest.spyOn(sut.axios, 'put');
            spy.mockClear();
            return sut.put('/users/current', content(data).params(qParams)).then(() => {
                const reqData = spy.mock.calls[0][1];
                const reqConfig = spy.mock.calls[0][2];
                expect(reqData).toEqual(data);
                expect(reqConfig.headers['Content-Type']).toEqual(Constants.JSON_LD_MIME_TYPE);
                return expect(reqConfig.params).toEqual(qParams);
            });
        });

        it('adds params in DELETE', () => {
            const qParams = {
                key: 'http://kbss.felk.cvut.cz/termit/users/Catherine+Halsey'
            };
            mock.onDelete().reply(204);
            const spy = jest.spyOn(sut.axios, 'delete');
            spy.mockClear();
            return sut.delete('/users', params(qParams)).then(() => {
                const reqConfig = spy.mock.calls[0][1];
                return expect(reqConfig.params).toEqual(qParams);
            });
        });
    });
});