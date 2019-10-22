import * as React from "react";
import {Location} from "history";
import {match as Match, MemoryRouter} from "react-router";
import {createMemoryHistory} from "history";
import {shallow} from "enzyme";
import {TermDetail} from "../TermDetail";
import {intlDataForShallow, mountWithIntl} from "../../../__tests__/environment/Environment";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import TermMetadata from "../TermMetadata";
import TermMetadataEdit from "../TermMetadataEdit";
import Term from "../../../model/Term";
import Generator from "../../../__tests__/environment/Generator";
import AppNotification from "../../../model/AppNotification";
import NotificationType from "../../../model/NotificationType";
import {IRI} from "../../../util/VocabularyUtils";

jest.mock("../TermAssignments");
jest.mock("../IncludeImportedTermsToggle");

describe("TermDetail", () => {

    const normalizedTermName = "test-term";
    const normalizedVocabName = "test-vocabulary";

    let location: Location;
    const history = createMemoryHistory();
    let match: Match<any>;

    let onLoad: (termName: string, vocabIri: IRI) => void;
    let onUpdate: (term: Term) => Promise<any>;
    let onPublishNotification: (notification: AppNotification) => void;

    let term: Term;

    beforeEach(() => {
        location = {
            pathname: "/vocabulary/" + normalizedVocabName + "/term/" + normalizedTermName,
            search: "",
            hash: "",
            state: {}
        };
        match = {
            params: {
                name: normalizedVocabName,
                termName: normalizedTermName
            },
            path: location.pathname,
            isExact: true,
            url: "http://localhost:3000/" + location.pathname
        };
        onLoad = jest.fn();
        onUpdate = jest.fn().mockImplementation(() => Promise.resolve());
        onPublishNotification = jest.fn();
        term = new Term({
            iri: Generator.generateUri(),
            label: "Test term",
            vocabulary: {iri: Generator.generateUri()}
        });
    });

    it("loads term on mount", () => {
        shallow(<TermDetail term={null} loadTerm={onLoad} updateTerm={onUpdate}
                            publishNotification={onPublishNotification}
                            history={history} location={location} match={match}
                            {...intlFunctions()} {...intlDataForShallow()}/>);
        expect(onLoad).toHaveBeenCalledWith(normalizedTermName, {fragment: normalizedVocabName});
    });

    it("provides namespace to term loading when specified in url", () => {
        const namespace = "http://onto.fel.cvut.cz/ontologies/termit/vocabularies/";
        location.search = "?namespace=" + namespace;
        shallow(<TermDetail term={null} loadTerm={onLoad} updateTerm={onUpdate}
                            history={history} location={location} match={match}
                            publishNotification={onPublishNotification}
                            {...intlFunctions()} {...intlDataForShallow()}/>);
        expect(onLoad).toHaveBeenCalledWith(normalizedTermName, {fragment: normalizedVocabName, namespace});
    });

    it("renders term metadata by default", () => {
        const wrapper = mountWithIntl(<MemoryRouter><TermDetail term={term} loadTerm={onLoad}
                                                                updateTerm={onUpdate}
                                                                publishNotification={onPublishNotification}
                                                                history={history} location={location} match={match}
                                                                {...intlFunctions()}/></MemoryRouter>);
        expect(wrapper.find(TermMetadata).exists()).toBeTruthy();
    });

    it("renders term editor after clicking edit button", () => {
        const wrapper = mountWithIntl(<MemoryRouter><TermDetail term={term} loadTerm={onLoad}
                                                                updateTerm={onUpdate}
                                                                publishNotification={onPublishNotification}
                                                                history={history} location={location} match={match}
                                                                {...intlFunctions()}/></MemoryRouter>);
        wrapper.find("button#term-detail-edit").simulate("click");
        expect(wrapper.find(TermMetadataEdit).exists()).toBeTruthy();
    });

    it("invokes termUpdate action on save", () => {
        const wrapper = shallow(<TermDetail term={term} loadTerm={onLoad} updateTerm={onUpdate}
                                            history={history} location={location} match={match}
                                            publishNotification={onPublishNotification}
                                            {...intlFunctions()} {...intlDataForShallow()}/>);
        (wrapper.instance() as TermDetail).onSave(term);
        expect(onUpdate).toHaveBeenCalledWith(term);
    });

    it("closes term metadata edit on save success", () => {
        const wrapper = shallow(<TermDetail term={term} loadTerm={onLoad}
                                            updateTerm={onUpdate} publishNotification={onPublishNotification}
                                            history={history} location={location} match={match}
                                            {...intlFunctions()} {...intlDataForShallow()}/>);
        (wrapper.instance() as TermDetail).onEdit();
        (wrapper.instance() as TermDetail).onSave(term);
        return Promise.resolve().then(() => {
            wrapper.update();
            expect((wrapper.instance() as TermDetail).state.edit).toBeFalsy();
        });
    });

    it("reloads term on successful save", () => {
        const wrapper = shallow(<TermDetail term={term} loadTerm={onLoad} updateTerm={onUpdate}
                                            history={history} location={location} match={match}
                                            publishNotification={onPublishNotification}
                                            {...intlFunctions()} {...intlDataForShallow()}/>);
        (wrapper.instance() as TermDetail).onSave(term);
        return Promise.resolve().then(() => {
            expect(onLoad).toHaveBeenCalledWith(normalizedTermName, {fragment: normalizedVocabName});
        });
    });

    it("closes edit when different term is selected", () => {
        const wrapper = shallow(<TermDetail term={term} loadTerm={onLoad} updateTerm={onUpdate}
                                            history={history} location={location} match={match}
                                            publishNotification={onPublishNotification}
                                            {...intlFunctions()} {...intlDataForShallow()}/>);
        (wrapper.instance() as TermDetail).onEdit();
        wrapper.update();
        expect((wrapper.instance() as TermDetail).state.edit).toBeTruthy();
        const newMatch = {
            params: {
                name: normalizedVocabName,
                termName: "differentTerm"
            },
            path: "/different",
            isExact: true,
            url: "http://localhost:3000/different"
        };
        wrapper.setProps({match: newMatch});
        wrapper.update();
        expect((wrapper.instance() as TermDetail).state.edit).toBeFalsy();
    });

    it("does not render edit button when editing", () => {
        const wrapper = mountWithIntl(<MemoryRouter><TermDetail term={term} loadTerm={onLoad}
                                                                updateTerm={onUpdate}
                                                                publishNotification={onPublishNotification}
                                                                history={history} location={location} match={match}
                                                                {...intlFunctions()}/></MemoryRouter>);
        const editButton = wrapper.find("button#term-detail-edit");
        expect(editButton.exists()).toBeTruthy();
        editButton.simulate("click");
        expect(wrapper.exists("button#term-detail-edit")).toBeFalsy();
    });

    it("publishes term update notification when parent term changes", () => {
        const wrapper = shallow<TermDetail>(<TermDetail term={term} loadTerm={onLoad} updateTerm={onUpdate}
                                                        history={history} location={location} match={match}
                                                        publishNotification={onPublishNotification}
                                                        {...intlFunctions()} {...intlDataForShallow()}/>);
        const update = new Term(Object.assign({}, term));
        const newParent = Generator.generateUri();
        update.parentTerms = [new Term({iri: newParent, label: "New parent"})];
        wrapper.instance().onSave(update);
        return Promise.resolve().then(() => {
            expect(onPublishNotification).toHaveBeenCalledWith({source: {type: NotificationType.TERM_HIERARCHY_UPDATED}});
        });
    });
});
