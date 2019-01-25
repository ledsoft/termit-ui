import * as React from "react";
import Term, {TermData} from "../../../model/Term";
import FetchOptionsFunction from "../../../model/Functions";
import {shallow} from "enzyme";
import {Terms} from "../Terms";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import {intlDataForShallow} from "../../../__tests__/environment/Environment";
import {Location} from "history";
import createMemoryHistory from "history/createMemoryHistory";
import {match as Match} from "react-router";
import Routing from "../../../util/Routing";
import Routes from "../../../util/Routes";

jest.mock("../../../util/Routing");

describe("Terms", () => {

    const vocabularyName = "test-vocabulary";
    const termName = "test-term";

    const counter = 0;
    const selectedTerms: Term | null = null;
    let selectVocabularyTerm: (term: Term | null) => void;
    let fetchTerms: (fetchOptions: FetchOptionsFunction, normalizedName: string) => Promise<Term[]>;

    let location: Location;
    const history = createMemoryHistory();
    let match: Match<any>;

    beforeEach(() => {
        jest.resetAllMocks();   // Prevent Routing mock state leaking into subsequent tests
        selectVocabularyTerm = jest.fn();
        fetchTerms = jest.fn().mockImplementation(() => Promise.resolve([]));

        location = {
            pathname: '/vocabulary/' + vocabularyName + '/term/',
            search: '',
            hash: '',
            state: {}
        };
        match = {
            params: {
                name: vocabularyName
            },
            path: location.pathname,
            isExact: true,
            url: 'http://localhost:3000/' + location.pathname
        };
    });

    it("transitions to term detail on term select", () => {
        const wrapper = shallow(<Terms counter={counter} selectedTerms={selectedTerms}
                                       selectVocabularyTerm={selectVocabularyTerm}
                                       fetchTerms={fetchTerms} {...intlFunctions()} {...intlDataForShallow()}
                                       location={location} match={match} history={history}/>);
        const term: TermData = {
            iri: "http://onto.fel.cvut.cz/ontologies/termit/vocabularies/test-vocabulary/terms/" + termName,
            label: "test term"
        };
        (wrapper.instance() as Terms).onChange(term);
        const call = (Routing.transitionTo as jest.Mock).mock.calls[0];
        expect(call[0]).toEqual(Routes.vocabularyTermDetail);
        expect((call[1].params as Map<string, string>).get("name")).toEqual(vocabularyName);
        expect((call[1].params as Map<string, string>).get("termName")).toEqual(termName);
    });

    it("specifies vocabulary namespace as query parameter for transition to term detail", () => {
        const namespace = "http://onto.fel.cvut.cz/ontologies/termit/vocabularies/";
        location.search = "?namespace=" + namespace;
        const wrapper = shallow(<Terms counter={counter} selectedTerms={selectedTerms}
                                       selectVocabularyTerm={selectVocabularyTerm}
                                       fetchTerms={fetchTerms} {...intlFunctions()} {...intlDataForShallow()}
                                       location={location} match={match} history={history}/>);
        const term: TermData = {
            iri: namespace + "test-vocabulary/terms/" + termName,
            label: "test term"
        };
        (wrapper.instance() as Terms).onChange(term);
        const call = (Routing.transitionTo as jest.Mock).mock.calls[0];
        expect((call[1].query as Map<string, string>).get("namespace")).toEqual(namespace);
    });

    it("invokes term selected on term select", () => {
        const wrapper = shallow(<Terms counter={counter} selectedTerms={selectedTerms}
                                       selectVocabularyTerm={selectVocabularyTerm}
                                       fetchTerms={fetchTerms} {...intlFunctions()} {...intlDataForShallow()}
                                       location={location} match={match} history={history}/>);
        const term: TermData = {
            iri: "http://onto.fel.cvut.cz/ontologies/termit/vocabularies/test-vocabulary/terms/" + termName,
            label: "test term"
        };
        (wrapper.instance() as Terms).onChange(term);
        expect(selectVocabularyTerm).toHaveBeenCalled();
        expect((selectVocabularyTerm as jest.Mock).mock.calls[0][0].iri).toEqual(term.iri);
    });

    it("passes vocabulary namespace as query parameter for transition to create term view", () => {
        const namespace = "http://onto.fel.cvut.cz/ontologies/termit/vocabularies/";
        location.search = "?namespace=" + namespace;
        const wrapper = shallow(<Terms counter={counter} selectedTerms={selectedTerms}
                                       selectVocabularyTerm={selectVocabularyTerm}
                                       fetchTerms={fetchTerms} {...intlFunctions()} {...intlDataForShallow()}
                                       location={location} match={match} history={history}/>);
        (wrapper.instance() as Terms).onCreateClick();
        const call = (Routing.transitionTo as jest.Mock).mock.calls[0];
        expect(call[0]).toEqual(Routes.createVocabularyTerm);
        expect((call[1].query as Map<string, string>).get("namespace")).toEqual(namespace);
    });
});