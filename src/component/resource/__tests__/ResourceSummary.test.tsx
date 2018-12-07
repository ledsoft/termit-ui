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
// import Generator from "../../../__tests__/environment/Generator";

describe("ResourceSummary", () => {

    const resourceName = "test-resource";

    let loadResource: (iri: IRI) => Promise<any>;
    let loadResourceTerms: (iri: IRI) => Promise<any>;
    let saveResource: (resource: Resource) => Promise<any>;

    let location: Location;
    const history = createMemoryHistory();
    let match: Match<any>;

    beforeEach(() => {
        loadResource = jest.fn().mockImplementation(()=> Promise.resolve() );
        loadResourceTerms = jest.fn().mockImplementation(()=> Promise.resolve() );
        saveResource = jest.fn().mockImplementation(() => Promise.resolve());

        location = {
            pathname: '/resource/' + resourceName,
            search: '',
            hash: '',
            state: {}
        };
        match = {
            params: {
                name: resourceName,
            },
            path: location.pathname,
            isExact: true,
            url: 'http://localhost:3000/' + location.pathname
        };
    });

    it("loads resource on mount", () => {
        shallow(<ResourceSummary 
            loadResource={loadResource} loadResourceTerms={loadResourceTerms}
            resource={EMPTY_RESOURCE}
            saveResource={saveResource} {...intlFunctions()} {...intlDataForShallow()}
            history={history} 
            location={location} 
            match={match}/>);
        expect(loadResource).toHaveBeenCalledWith({fragment: resourceName});
    });

    it("does not attempt to reload resource on update when it is empty resource", () => {
        const wrapper = shallow(<ResourceSummary loadResource={loadResource} loadResourceTerms={loadResourceTerms}
                                                resource={EMPTY_RESOURCE}
                                                saveResource={saveResource} {...intlFunctions()} {...intlDataForShallow()}
                                                history={history} location={location} match={match}/>);
        wrapper.setProps({resource: EMPTY_RESOURCE});
        wrapper.update();
        expect(loadResource).toHaveBeenCalledTimes(1);
    });

    it("reloads resource when new resource identifier is passed in location props", () => {
        const oldResource = new Resource({iri: Generator.generateUri(), label: resourceName, terms: []});
        const wrapper = shallow(<ResourceSummary loadResource={loadResource} loadResourceTerms={loadResourceTerms}
                                resource={oldResource}
                                saveResource={saveResource} {...intlFunctions()} {...intlDataForShallow()}
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
        shallow(<ResourceSummary loadResource={loadResource} loadResourceTerms={loadResourceTerms}
                                resource={EMPTY_RESOURCE}
                                saveResource={saveResource} {...intlFunctions()} {...intlDataForShallow()}
                                history={history} location={location} match={match}/>);
        expect(loadResource).toHaveBeenCalledWith({fragment: resourceName, namespace});
    });
});