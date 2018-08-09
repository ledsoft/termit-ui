import configureMockStore from 'redux-mock-store';
import {login} from '../AsyncActions';
import Constants from "../../util/Constants";
import Ajax from "../../util/Ajax";
import thunk, {ThunkDispatch} from "redux-thunk";
import {Action} from "redux";
import Routing from '../../util/Routing';
import Authentication from "../../util/Authentication";

jest.mock('../../util/Routing');
jest.mock('../../util/Ajax');
jest.mock('../../util/Authentication');

const mockStore = configureMockStore([thunk]);

describe('Async actions', () => {

    describe('login', () => {

        it('saves JWT on login success', () => {
            const resp = {
                data: {
                    loggedIn: true
                },
                headers: {}
            };
            const jwt = 'Bearer jwt12345';
            resp.headers[Constants.AUTHENTICATION_HEADER] = jwt;
            Ajax.post = jest.fn().mockImplementation(() => Promise.resolve(resp));
            Authentication.saveJwt = jest.fn();
            const store = mockStore({});
            return Promise.resolve((store.dispatch as ThunkDispatch<object, undefined, Action>)(login('test', 'test'))).then(() => {
                expect(Authentication.saveJwt).toHaveBeenCalledWith(jwt);
            });
        });

        it('transitions to home on login success', () => {
            const resp = {
                data: {
                    loggedIn: true
                },
                headers: {}
            };
            resp.headers[Constants.AUTHENTICATION_HEADER] = 'Bearer jwt12345';
            Ajax.post = jest.fn().mockImplementation(() => Promise.resolve(resp));
            const store = mockStore({});
            return Promise.resolve((store.dispatch as ThunkDispatch<object, undefined, Action>)(login('test', 'test'))).then(() => {
                expect(Routing.transitionToHome).toHaveBeenCalled();
            });
        });
    });

});
