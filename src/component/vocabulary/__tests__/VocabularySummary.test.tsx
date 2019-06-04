import * as React from "react";
import VocabularyUtils, {IRI} from "../../../util/VocabularyUtils";
import Vocabulary, {EMPTY_VOCABULARY} from "../../../model/Vocabulary";
import {Location} from "history";
import createMemoryHistory from "history/createMemoryHistory";
import {match as Match} from "react-router";
import {shallow} from "enzyme";
import {VocabularySummary} from "../VocabularySummary";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import {intlDataForShallow, mountWithIntl} from "../../../__tests__/environment/Environment";
import {VocabularyEdit} from "../VocabularyEdit";
import {Button, DropdownToggle} from "reactstrap";

describe("VocabularySummary", () => {

    const namespace = "http://onto.fel.cvut.cz/ontologies/termit/vocabularies/";
    const normalizedName = "test-vocabulary";

    let location: Location;
    const history = createMemoryHistory();
    let match: Match<any>;

    let onLoad: (iri: IRI) => void;
    let onUpdate: (vocabulary: Vocabulary) => Promise<any>;
    let exportToCsv: (iri: IRI) => void;
    let exportToExcel: (iri: IRI) => void;
    let exportToTurtle: (iri: IRI) => void;
    let exportFunctions: any;

    let vocabulary: Vocabulary;

    beforeEach(() => {
        onLoad = jest.fn();
        onUpdate = jest.fn().mockImplementation(() => Promise.resolve());
        exportToCsv = jest.fn();
        exportToExcel = jest.fn();
        exportToTurtle = jest.fn();
        exportFunctions = {exportToCsv, exportToExcel, exportToTurtle};
        location = {
            pathname: "/vocabulary/" + normalizedName,
            search: "",
            hash: "",
            state: {}
        };
        match = {
            params: {
                name: normalizedName
            },
            path: location.pathname,
            isExact: true,
            url: "http://localhost:3000/" + location.pathname
        };
        vocabulary = new Vocabulary({
            iri: namespace + normalizedName,
            label: "Test vocabulary"
        });
    });

    it("loads vocabulary on mount", () => {
        shallow(<VocabularySummary vocabulary={EMPTY_VOCABULARY} updateVocabulary={onUpdate} loadVocabulary={onLoad}
                                   history={history} location={location} {...exportFunctions}
                                   match={match} {...intlFunctions()} {...intlDataForShallow()}/>);
        expect(onLoad).toHaveBeenCalledWith({fragment: normalizedName});
    });

    it("passes namespace to vocabulary loading when specified", () => {
        location.search = "?namespace=" + namespace;
        shallow(<VocabularySummary vocabulary={EMPTY_VOCABULARY} updateVocabulary={onUpdate} loadVocabulary={onLoad}
                                   history={history} location={location} {...exportFunctions}
                                   match={match} {...intlFunctions()} {...intlDataForShallow()}/>);
        expect(onLoad).toHaveBeenCalledWith({fragment: normalizedName, namespace});
    });

    it("does not attempt to reload vocabulary when namespace is missing in location and fragment is identical", () => {
        const wrapper = shallow(<VocabularySummary vocabulary={EMPTY_VOCABULARY} updateVocabulary={onUpdate}
                                                   loadVocabulary={onLoad}
                                                   history={history} location={location} {...exportFunctions}
                                                   match={match} {...intlFunctions()} {...intlDataForShallow()}/>);
        wrapper.setProps({vocabulary});
        wrapper.update();
        expect(onLoad).toHaveBeenCalledTimes(1);
    });

    it("opens edit view on edit button click", () => {
        const wrapper = mountWithIntl(<VocabularySummary vocabulary={vocabulary} updateVocabulary={onUpdate}
                                                         loadVocabulary={onLoad} {...exportFunctions}
                                                         history={history} location={location}
                                                         match={match} {...intlFunctions()}/>);
        expect(wrapper.find(VocabularyEdit).exists()).toBeFalsy();
        const editButton = wrapper.find(Button).findWhere(b => b.key() === "vocabulary.summary.edit");
        editButton.simulate("click");
        expect(wrapper.find(VocabularyEdit).exists()).toBeTruthy();
    });

    it("hides edit button on on edit", () => {
        const wrapper = mountWithIntl(<VocabularySummary vocabulary={vocabulary} updateVocabulary={onUpdate}
                                                         loadVocabulary={onLoad} {...exportFunctions}
                                                         history={history} location={location}
                                                         match={match} {...intlFunctions()}/>);
        (wrapper.find(VocabularySummary).instance() as VocabularySummary).onEdit();
        wrapper.update();
        const editButton = wrapper.find(Button).findWhere(b => b.key() === "vocabulary.summary.edit");
        expect(editButton.exists()).toBeFalsy();
    });

    it("invokes vocabulary update action on save", () => {
        const wrapper = shallow(<VocabularySummary vocabulary={vocabulary} updateVocabulary={onUpdate}
                                                   loadVocabulary={onLoad} {...exportFunctions}
                                                   history={history} location={location}
                                                   match={match} {...intlFunctions()} {...intlDataForShallow()}/>);
        (wrapper.instance() as VocabularySummary).onEdit();
        const update = new Vocabulary({
            iri: vocabulary.iri,
            label: "Updated label"
        });
        (wrapper.instance() as VocabularySummary).onSave(update);
        expect(onUpdate).toHaveBeenCalledWith(update);
    });

    it("closes edit after successful update", () => {
        const wrapper = shallow(<VocabularySummary vocabulary={vocabulary} updateVocabulary={onUpdate}
                                                   loadVocabulary={onLoad} {...exportFunctions}
                                                   history={history} location={location}
                                                   match={match} {...intlFunctions()} {...intlDataForShallow()}/>);
        (wrapper.instance() as VocabularySummary).onEdit();
        (wrapper.instance() as VocabularySummary).onSave(vocabulary);
        return Promise.resolve().then(() => {
            expect((wrapper.instance() as VocabularySummary).state.edit).toBeFalsy();
        });
    });

    it("reloads vocabulary after successful update", () => {
        location.search = "?namespace=" + namespace;
        const wrapper = shallow(<VocabularySummary vocabulary={vocabulary} updateVocabulary={onUpdate}
                                                   loadVocabulary={onLoad} {...exportFunctions}
                                                   history={history} location={location}
                                                   match={match} {...intlFunctions()} {...intlDataForShallow()}/>);
        (wrapper.instance() as VocabularySummary).onEdit();
        (wrapper.instance() as VocabularySummary).onSave(vocabulary);
        return Promise.resolve().then(() => {
            expect(onLoad).toHaveBeenCalledWith(VocabularyUtils.create(vocabulary.iri));
        });
    });

    it("invokes export to CSV when exportToCsv is triggered", () => {
        const wrapper = mountWithIntl(<VocabularySummary vocabulary={vocabulary} updateVocabulary={onUpdate}
                                                         loadVocabulary={onLoad} {...exportFunctions}
                                                         history={history} location={location}
                                                         match={match} {...intlFunctions()}/>);
        wrapper.find(DropdownToggle).simulate("click");
        wrapper.find("button[name=\"vocabulary-export-csv\"]").simulate("click");
        expect(exportToCsv).toHaveBeenCalledWith(VocabularyUtils.create(vocabulary.iri));
    });

    it("invokes export to Excel when exportToExcel is triggered", () => {
        const wrapper = mountWithIntl(<VocabularySummary vocabulary={vocabulary} updateVocabulary={onUpdate}
                                                         loadVocabulary={onLoad} {...exportFunctions}
                                                         history={history} location={location}
                                                         match={match} {...intlFunctions()}/>);
        wrapper.find(DropdownToggle).simulate("click");
        wrapper.find("button[name=\"vocabulary-export-excel\"]").simulate("click");
        expect(exportToExcel).toHaveBeenCalledWith(VocabularyUtils.create(vocabulary.iri));
    });

    it("invokes export to Turtle when exportToTurtle is triggered", () => {
        const wrapper = mountWithIntl(<VocabularySummary vocabulary={vocabulary} updateVocabulary={onUpdate}
                                                         loadVocabulary={onLoad} {...exportFunctions}
                                                         history={history} location={location}
                                                         match={match} {...intlFunctions()}/>);
        wrapper.find(DropdownToggle).simulate("click");
        wrapper.find("button[name=\"vocabulary-export-ttl\"]").simulate("click");
        expect(exportToTurtle).toHaveBeenCalledWith(VocabularyUtils.create(vocabulary.iri));
    });

    it("reloads Vocabulary when File was added into the Vocabulary's Document", () => {
        const wrapper = shallow<VocabularySummary>(<VocabularySummary vocabulary={vocabulary}
                                                                      updateVocabulary={onUpdate}
                                                                      loadVocabulary={onLoad} {...exportFunctions}
                                                                      history={history} location={location}
                                                                      match={match} {...intlFunctions()} {...intlDataForShallow()}/>);
        wrapper.instance().onFileAdded();
        expect(onLoad).toHaveBeenCalledWith(VocabularyUtils.create(vocabulary.iri));
    });
});