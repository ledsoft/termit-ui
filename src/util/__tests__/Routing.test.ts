import Routing from '../Routing';
import Routes from '../Routes';
import {createHashHistory} from 'history';

jest.mock('history', () => ({
    createHashHistory: jest.fn().mockReturnValue({
        push: jest.fn()
    })
}));

describe('Routing', () => {

    const historyMock = createHashHistory();

    beforeEach(() => {
        jest.resetAllMocks()
    });

    describe('transition to', () => {
        it('replaces path variables with values', () => {
            const name = 'test-vocabulary';
            Routing.transitionTo(Routes.vocabularyDetail, {params: new Map([['name', name]])});
            const expectedPath = Routes.vocabularyDetail.path.replace(':name', name);
            expect(historyMock.push).toHaveBeenCalledWith(expectedPath);
        });

        it('transitions to route without any parameter', () => {
            Routing.transitionTo(Routes.vocabularies);
            expect(historyMock.push).toHaveBeenCalledWith(Routes.vocabularies.path);
        });

        it('adds query parameters when specified for transition', () => {
            const namespace = 'http://onto.fel.cvut.cz/ontologies/termit/vocabulary/';
            Routing.transitionTo(Routes.vocabularies, {query: new Map([['namespace', namespace]])});
            expect(historyMock.push).toHaveBeenCalledWith(Routes.vocabularies.path + '?namespace=' + namespace);
        });
    });
});