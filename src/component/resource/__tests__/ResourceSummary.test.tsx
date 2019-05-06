import * as React from "react";
import VocabularyUtils, {IRI} from "../../../util/VocabularyUtils";
import {shallow} from "enzyme";
import {ResourceSummary} from "../ResourceSummary";
import Resource, {EMPTY_RESOURCE} from "../../../model/Resource";
import Document from "../../../model/Document";
import File from "../../../model/File";
import {intlDataForShallow, mountWithIntl} from "../../../__tests__/environment/Environment";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import {Location} from "history";
import createMemoryHistory from "history/createMemoryHistory";
import {match as Match, Router} from "react-router";
import Generator from "../../../__tests__/environment/Generator";

describe("ResourceSummary", () => {

    const namespace = "http://onto.fel.cvut.cz/ontologies/termit/resources/";
    const resourceName = "test-resource";

    let loadResource: (iri: IRI) => Promise<any>;
    let saveResource: (resource: Resource) => Promise<any>;
    let removeResource: (resource: Resource) => Promise<any>;
    let clearResource: () => void;
    let hasContent: (iri: IRI) => Promise<boolean>;

    let resourceHandlers: any;

    let location: Location;
    const history = createMemoryHistory();
    let match: Match<any>;

    beforeEach(() => {
        loadResource = jest.fn().mockImplementation(() => Promise.resolve());
        saveResource = jest.fn().mockImplementation(() => Promise.resolve());
        removeResource = jest.fn().mockImplementation(() => Promise.resolve());
        clearResource = jest.fn();
        hasContent = jest.fn().mockImplementation(() => Promise.resolve(true));
        resourceHandlers = {loadResource, saveResource, removeResource, clearResource, hasContent};

        location = {
            pathname: "/resource/" + resourceName,
            search: "?namespace=" + namespace,
            hash: "",
            state: {}
        };
        match = {
            params: {
                name: resourceName,
            },
            path: location.pathname,
            isExact: true,
            url: "http://localhost:3000/" + location.pathname
        };
    });

    it("loads resource on mount", () => {
        shallow(<ResourceSummary
            resource={EMPTY_RESOURCE} {...resourceHandlers} {...intlFunctions()} {...intlDataForShallow()}
            history={history}
            location={location}
            match={match}/>);
        expect(loadResource).toHaveBeenCalledWith({fragment: resourceName, namespace});
    });

    it("does not attempt to reload resource on update when it is empty resource", () => {
        const wrapper = shallow(<ResourceSummary
            resource={EMPTY_RESOURCE} {...resourceHandlers} {...intlFunctions()} {...intlDataForShallow()}
            history={history} location={location} match={match}/>);
        wrapper.setProps({resource: EMPTY_RESOURCE});
        wrapper.update();
        expect(loadResource).toHaveBeenCalledTimes(1);
    });

    it("reloads resource when new resource identifier is passed in location props", () => {
        const oldResource = new Resource({iri: namespace + resourceName, label: resourceName, terms: []});
        const wrapper = shallow(<ResourceSummary
            resource={oldResource} {...resourceHandlers} {...intlFunctions()} {...intlDataForShallow()}
            history={history} location={location} match={match}/>);
        const newFragment = "another-resource";
        const newMatch = Object.assign({}, match);
        newMatch.params.name = newFragment;
        wrapper.setProps({match: newMatch});
        expect(loadResource).toHaveBeenCalledWith({fragment: newFragment, namespace});
        wrapper.setProps({resource: new Resource({iri: namespace + newFragment, label: newFragment, terms: []})});
    });

    it("does not attempt to reload resource when namespace is missing in location and fragment is identical", () => {
        const resource = new Resource({
            iri: "http://onto.fel.cvut.cz/ontologies/termit/resources/" + resourceName,
            label: resourceName
        });
        const wrapper = shallow(<ResourceSummary
            resource={EMPTY_RESOURCE} {...resourceHandlers} {...intlFunctions()} {...intlDataForShallow()}
            history={history} location={location} match={match}/>);
        wrapper.setProps({resource});
        wrapper.update();
        expect(loadResource).toHaveBeenCalledTimes(1);
    });

    it("clears resource on unmnount", () => {
        const resource = new Resource({
            iri: namespace + resourceName,
            label: resourceName
        });
        const wrapper = shallow(<ResourceSummary
            resource={resource} {...resourceHandlers} {...intlFunctions()} {...intlDataForShallow()}
            history={history} location={location} match={match}/>);
        return Promise.resolve().then(() => {
            wrapper.unmount();
            expect(clearResource).toHaveBeenCalled();
        });
    });

    it("invokes remove action and closes remove confirmation dialog on remove", () => {
        const resource = new Resource({
            iri: namespace + resourceName,
            label: resourceName
        });
        const wrapper = shallow(<ResourceSummary
            resource={resource} {...resourceHandlers} {...intlFunctions()} {...intlDataForShallow()}
            history={history} location={location} match={match}/>);
        (wrapper.instance() as ResourceSummary).onRemove();
        expect(removeResource).toHaveBeenCalledWith(resource);
        expect(wrapper.state("showRemoveDialog")).toBeFalsy();
    });

    it("does not render remove button for Document related to Vocabulary", () => {
        const doc = new Document({
            iri: namespace + resourceName,
            label: resourceName,
            files: [],
            vocabulary: {iri: Generator.generateUri()}
        });
        const wrapper = mountWithIntl(<ResourceSummary resource={doc} {...resourceHandlers} {...intlFunctions()}
                                                       history={history} location={location} match={match}/>);
        expect(wrapper.exists("button#resource-detail-remove")).toBeFalsy();
    });

    it("does not render remove button for Document containing files", () => {
        const doc = new Document({
            iri: namespace + resourceName,
            label: resourceName,
            files: [new File({iri: Generator.generateUri(), label: "test.html"})]
        });
        const wrapper = mountWithIntl(<ResourceSummary resource={doc} {...resourceHandlers} {...intlFunctions()}
                                                       history={history} location={location} match={match}/>);
        expect(wrapper.exists("button#resource-detail-remove")).toBeFalsy();
    });

    it("renders content button for File", () => {
        const file = new File({
            iri: namespace + resourceName,
            label: resourceName,
            types: [VocabularyUtils.FILE]
        });
        const wrapper = mountWithIntl(<Router history={history}>
            <ResourceSummary resource={file} {...resourceHandlers} {...intlFunctions()} history={history}
                             location={location} match={match}/></Router>);
        return Promise.resolve().then(() => {
            wrapper.update();
            expect(wrapper.exists("a#resource-detail-view-content")).toBeTruthy();
        });
    });

    it("does not render content button for non-File Resource", () => {
        const doc = new Document({
            iri: namespace + resourceName,
            label: resourceName,
            files: [],
            types: [VocabularyUtils.DOCUMENT]
        });
        const wrapper = mountWithIntl(<Router history={history}>
            <ResourceSummary resource={doc} {...resourceHandlers} {...intlFunctions()} history={history}
                             location={location} match={match}/></Router>);
        return Promise.resolve().then(() => {
            wrapper.update();
            expect(wrapper.exists("a#resource-detail-view-content")).toBeFalsy();
        });
    });

    it("does not render content button for File without content", () => {
        const file = new File({
            iri: namespace + resourceName,
            label: resourceName,
            types: [VocabularyUtils.FILE]
        });
        (hasContent as jest.Mock).mockImplementation(() => Promise.resolve(false));
        const wrapper = shallow(<ResourceSummary
            resource={file} {...resourceHandlers} {...intlFunctions()} {...intlDataForShallow()} history={history}
            location={location} match={match}/>);
        return Promise.resolve().then(() => {
            wrapper.update();
            expect(wrapper.exists("#resource-detail-view-content")).toBeFalsy();
            expect(hasContent).toHaveBeenCalledWith(VocabularyUtils.create(file.iri));
        });
    });
});