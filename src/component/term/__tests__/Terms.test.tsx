import * as React from "react";
import Term, {TermData} from "../../../model/Term";
import FetchOptionsFunction from "../../../model/Functions";
import {shallow} from "enzyme";
import {Terms} from "../Terms";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import {createMemoryHistory, Location} from "history";
import {match as Match} from "react-router";
import Routing from "../../../util/Routing";
import Routes from "../../../util/Routes";
import Utils from "../../../util/Utils";
import VocabularyUtils, {IRI} from "../../../util/VocabularyUtils";
import Generator from "../../../__tests__/environment/Generator";
import Vocabulary from "../../../model/Vocabulary";

jest.mock("../../../util/Routing");

describe("Terms", () => {

    const vocabularyName = "test-vocabulary";
    const termName = "test-term";
    const namespace = "http://onto.fel.cvut.cz/ontologies/termit/vocabularies/";

    const term: TermData = {
        iri: "http://onto.fel.cvut.cz/ontologies/termit/vocabularies/test-vocabulary/terms/" + termName,
        label: "test term",
        vocabulary: {
            iri: namespace + vocabularyName
        }
    };
    let vocabulary: Vocabulary;

    const consumeNotification = jest.fn();
    const counter = 0;
    const selectedTerms: Term | null = null;
    let selectVocabularyTerm: (term: Term | null) => void;
    let fetchTerms: (fetchOptions: FetchOptionsFunction, vocabularyIri: IRI) => Promise<Term[]>;

    let location: Location;
    const history = createMemoryHistory();
    let match: Match<any>;

    beforeEach(() => {
        jest.resetAllMocks();   // Prevent Routing mock state leaking into subsequent tests
        Utils.calculateAssetListHeight = jest.fn().mockImplementation(() => 100);
        selectVocabularyTerm = jest.fn();
        fetchTerms = jest.fn().mockImplementation(() => Promise.resolve([]));

        location = {
            pathname: "/vocabulary/" + vocabularyName + "/term/",
            search: "",
            hash: "",
            state: {}
        };
        match = {
            params: {
                name: vocabularyName
            },
            path: location.pathname,
            isExact: true,
            url: "http://localhost:3000/" + location.pathname
        };
        vocabulary = new Vocabulary({
            iri: namespace + vocabularyName,
            label: vocabularyName
        });
    });

    it("transitions to term detail on term select", () => {
        const wrapper = renderShallow();
        (wrapper.instance()).onTermSelect(term);
        const call = (Routing.transitionTo as jest.Mock).mock.calls[0];
        expect(call[0]).toEqual(Routes.vocabularyTermDetail);
        expect((call[1].params as Map<string, string>).get("name")).toEqual(vocabularyName);
        expect((call[1].params as Map<string, string>).get("termName")).toEqual(termName);
    });

    function renderShallow() {
        return shallow<Terms>(<Terms counter={counter} selectedTerms={selectedTerms}
                                     notifications={[]} consumeNotification={consumeNotification}
                                     selectVocabularyTerm={selectVocabularyTerm} vocabulary={vocabulary}
                                     fetchTerms={fetchTerms} {...intlFunctions()}
                                     location={location} match={match} history={history}/>);
    }

    it("specifies vocabulary namespace as query parameter for transition to term detail", () => {
        location.search = "?namespace=" + namespace;
        const wrapper = renderShallow();
        wrapper.instance().onTermSelect(term);
        const call = (Routing.transitionTo as jest.Mock).mock.calls[0];
        expect((call[1].query as Map<string, string>).get("namespace")).toEqual(namespace);
    });

    it("invokes term selected on term select", () => {
        const wrapper = renderShallow();
        wrapper.instance().onTermSelect(term);
        expect(selectVocabularyTerm).toHaveBeenCalled();
        expect((selectVocabularyTerm as jest.Mock).mock.calls[0][0].iri).toEqual(term.iri);
    });

    it("passes vocabulary namespace as query parameter for transition to create term view", () => {
        location.search = "?namespace=" + namespace;
        const wrapper = renderShallow();
        wrapper.instance().onCreateClick();
        const call = (Routing.transitionTo as jest.Mock).mock.calls[0];
        expect(call[0]).toEqual(Routes.createVocabularyTerm);
        expect((call[1].query as Map<string, string>).get("namespace")).toEqual(namespace);
    });

    it("fetches terms including imported when configured to", () => {
        const wrapper = renderShallow();
        wrapper.setState({includeImported: true});
        wrapper.update();
        wrapper.instance().fetchOptions({});
        expect((fetchTerms as jest.Mock).mock.calls[0][0].includeImported).toBeTruthy();
    });

    it("uses vocabulary identifier from Term data when transitioning to TermDetail in order to support transitioning to terms from a different vocabulary", () => {
        const differentVocabularyName = "different-vocabulary";
        const wrapper = renderShallow();
        term.vocabulary = {iri: namespace + differentVocabularyName};
        (wrapper.instance()).onTermSelect(term);
        const call = (Routing.transitionTo as jest.Mock).mock.calls[0];
        expect(call[0]).toEqual(Routes.vocabularyTermDetail);
        expect((call[1].params as Map<string, string>).get("name")).toEqual(differentVocabularyName);
        expect((call[1].params as Map<string, string>).get("termName")).toEqual(termName);
    });

    it("uses term vocabulary when fetching its subterms", () => {
        const wrapper = renderShallow();
        wrapper.setState({includeImported: true});
        wrapper.update();
        const option = new Term({
            iri: Generator.generateUri(),
            label: "Test term",
            vocabulary: {iri: Generator.generateUri()}
        });
        wrapper.instance().fetchOptions({optionID: option.iri, option});
        expect((fetchTerms as jest.Mock).mock.calls[0][1]).toEqual(VocabularyUtils.create(option.vocabulary!.iri!));
    });

    describe("fetchOptions", () => {

        it("filters out terms which are not in the vocabulary import chain", () => {
            const vocabularies = [Generator.generateUri(), Generator.generateUri(), Generator.generateUri()];
            vocabulary.allImportedVocabularies = vocabularies;
            const terms: Term[] = [];
            const matching: Term[] = [];
            for (let i = 0; i < 5; i++) {
                const termMatches = Generator.randomBoolean();
                const t = Generator.generateTerm(termMatches ? Generator.randomItem(vocabularies) : Generator.generateUri());
                terms.push(t);
                if (termMatches) {
                    matching.push(t);
                }
            }
            fetchTerms = jest.fn().mockImplementation(() => Promise.resolve(terms));
            const wrapper = renderShallow();
            return wrapper.instance().fetchOptions({}).then(options => {
                expect(options).toEqual(matching);
            });
        });

        it("filters out terms from different vocabularies when vocabulary has no imports", () => {
            const terms: Term[] = [];
            const matching: Term[] = [];
            for (let i = 0; i < 5; i++) {
                const termMatches = Generator.randomBoolean();
                const t = Generator.generateTerm(termMatches ? vocabulary.iri : Generator.generateUri());
                terms.push(t);
                if (termMatches) {
                    matching.push(t);
                }
            }
            fetchTerms = jest.fn().mockImplementation(() => Promise.resolve(terms));
            const wrapper = renderShallow();
            return wrapper.instance().fetchOptions({}).then(options => {
                expect(options).toEqual(matching);
            });
        });

        it("filters out term's children which are in vocabularies outside of the vocabulary import chain", () => {
            const terms: Term[] = [Generator.generateTerm(vocabulary.iri)];
            const subTerms = [{
                iri: Generator.generateUri(),
                label: "child one",
                vocabulary: {iri: vocabulary.iri}
            }, {
                iri: Generator.generateUri(),
                label: "child two",
                vocabulary: {iri: Generator.generateUri()}
            }];
            terms[0].subTerms = subTerms;
            terms[0].syncPlainSubTerms();
            fetchTerms = jest.fn().mockImplementation(() => Promise.resolve(terms));
            const wrapper = renderShallow();
            return wrapper.instance().fetchOptions({}).then(options => {
                expect(options.length).toEqual(1);
                const t = options[0];
                expect(t.subTerms!.length).toEqual(1);
                expect(t.subTerms![0].iri).toEqual(subTerms[0].iri);
                expect(t.plainSubTerms).toEqual([subTerms[0].iri]);
            });
        });
    });
});
