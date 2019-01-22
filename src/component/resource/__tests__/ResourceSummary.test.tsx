import * as React from "react";
import {IRI} from "../../../util/VocabularyUtils";
import {shallow} from "enzyme";
import {ResourceSummary} from "../ResourceSummary";
import Resource, {EMPTY_RESOURCE} from "../../../model/Resource";
import {intlDataForShallow} from "../../../__tests__/environment/Environment";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import {Location} from "history";
import createMemoryHistory from "history/createMemoryHistory";
import {match as Match} from "react-router";
import Generator from "../../../__tests__/environment/Generator";

describe("ResourceSummary", () => {

    const resourceName = "test-resource";

    let loadResource: (iri: IRI) => Promise<any>;
    let loadResourceTerms: (iri: IRI) => Promise<any>;
    let saveResource: (resource: Resource) => Promise<any>;
    let removeResource: (resource: Resource) => Promise<any>;
    let clearResource: () => void;

    let resourceHandlers: any;

    let location: Location;
    const history = createMemoryHistory();
    let match: Match<any>;

    beforeEach(() => {
        loadResource = jest.fn().mockImplementation(() => Promise.resolve());
        loadResourceTerms = jest.fn().mockImplementation(() => Promise.resolve());
        saveResource = jest.fn().mockImplementation(() => Promise.resolve());
        removeResource = jest.fn().mockImplementation(() => Promise.resolve());
        clearResource = jest.fn();
        resourceHandlers = {loadResource, loadResourceTerms, saveResource, removeResource, clearResource};

        location = {
            pathname: "/resource/" + resourceName,
            search: "",
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
        expect(loadResource).toHaveBeenCalledWith({fragment: resourceName});
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
        const oldResource = new Resource({iri: Generator.generateUri(), label: resourceName, terms: []});
        const wrapper = shallow(<ResourceSummary
            resource={oldResource} {...resourceHandlers} {...intlFunctions()} {...intlDataForShallow()}
            history={history} location={location} match={match}/>);
        const newFragment = "another-resource";
        const newMatch = Object.assign({}, match);
        newMatch.params.name = newFragment;
        wrapper.setProps({match: newMatch});
        expect(loadResource).toHaveBeenCalledWith({fragment: newFragment});
    });

    it("uses namespace for resource loading when it is present in URL", () => {
        const namespace = "http://onto.fel.cvut.cz/ontologies/termit/resources/";
        location.search = "?namespace=" + namespace;
        shallow(<ResourceSummary
            resource={EMPTY_RESOURCE} {...resourceHandlers} {...intlFunctions()} {...intlDataForShallow()}
            history={history} location={location} match={match}/>);
        expect(loadResource).toHaveBeenCalledWith({fragment: resourceName, namespace});
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
            iri: "http://onto.fel.cvut.cz/ontologies/termit/resources/" + resourceName,
            label: resourceName
        });
        const wrapper = shallow(<ResourceSummary
            resource={resource} {...resourceHandlers} {...intlFunctions()} {...intlDataForShallow()}
            history={history} location={location} match={match}/>);
        wrapper.unmount();
        expect(clearResource).toHaveBeenCalled();
    });

    it("invokes remove action and closes remove confirmation dialog on remove", () => {
        const resource = new Resource({
            iri: "http://onto.fel.cvut.cz/ontologies/termit/resources/" + resourceName,
            label: resourceName
        });
        const wrapper = shallow(<ResourceSummary
            resource={resource} {...resourceHandlers} {...intlFunctions()} {...intlDataForShallow()}
            history={history} location={location} match={match}/>);
        (wrapper.instance() as ResourceSummary).onRemove();
        expect(removeResource).toHaveBeenCalledWith(resource);
        expect(wrapper.state("showRemoveDialog")).toBeFalsy();
    });
});