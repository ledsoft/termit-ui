import * as React from "react";
import VocabularyUtils, {IRI} from "../../../util/VocabularyUtils";
import {TextAnalysisRecord} from "../../../model/TextAnalysisRecord";
import {Location} from "history";
import createMemoryHistory from "history/createMemoryHistory";
import {match as Match, RouteComponentProps} from "react-router";
import {shallow} from "enzyme";
import {ResourceFileDetail} from "../ResourceFileDetail";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import {intlDataForShallow} from "../../../__tests__/environment/Environment";
import File from "../../../model/File";
import Generator from "../../../__tests__/environment/Generator";
import {EMPTY_RESOURCE} from "../../../model/Resource";
import FileDetail from "../../file/FileDetail";

describe("ResourceFileDetail", () => {

    const resourceName = "test-resource";
    const resourceNamespace = VocabularyUtils.FILE + "/";

    let loadResource: (resourceIri: IRI) => void;
    let loadLatestTextAnalysisRecord: (resourceIri: IRI) => Promise<TextAnalysisRecord | null>;


    let location: Location;
    const history = createMemoryHistory();
    let match: Match<any>;
    let routeProps: RouteComponentProps<any>;

    let resource: File;

    beforeEach(() => {
        loadResource = jest.fn();
        loadLatestTextAnalysisRecord = jest.fn().mockImplementation(() => Promise.resolve(null));

        location = {
            pathname: "/resource/" + resourceName + "/annotate/",
            search: "?namespace=" + resourceNamespace,
            hash: "",
            state: {}
        };
        match = {
            params: {
                name: resourceName,
            },
            path: location.pathname,
            isExact: true,
            url: "http://localhost:3000/" + location.pathname + location.search
        };
        routeProps = {location, history, match};
        resource = new File({
            iri: resourceNamespace + resourceName,
            label: "Test resource",
            types: [VocabularyUtils.FILE, VocabularyUtils.RESOURCE]
        });
    });

    it("loads resource on mount", () => {
        shallow(<ResourceFileDetail resource={resource} loadResource={loadResource}
                                    loadLatestTextAnalysisRecord={loadLatestTextAnalysisRecord} {...routeProps} {...intlFunctions()} {...intlDataForShallow()}/>);
        expect(loadResource).toHaveBeenCalledWith(VocabularyUtils.create(resourceNamespace + resourceName));
    });

    it("retrieves vocabulary IRI from resource when it belongs to a document related to a vocabulary", () => {
        const vocabularyIri = Generator.generateUri();
        resource.owner = {
            iri: Generator.generateUri(),
            label: "Test document",
            vocabulary: {iri: vocabularyIri},
            files: [resource]
        };
        const wrapper = shallow<ResourceFileDetail>(<ResourceFileDetail resource={EMPTY_RESOURCE}
                                                                        loadResource={loadResource}
                                                                        loadLatestTextAnalysisRecord={loadLatestTextAnalysisRecord} {...routeProps} {...intlFunctions()} {...intlDataForShallow()}/>);
        wrapper.setProps({resource});
        wrapper.update();
        const fileDetail = wrapper.find(FileDetail);
        expect(fileDetail.exists()).toBeTruthy();
        expect(fileDetail.prop("vocabularyIri")).toEqual(VocabularyUtils.create(vocabularyIri));
    });

    it("retrieves latest text analysis record for a standalone file", () => {
        const vocabularyIri = Generator.generateUri();
        const record = new TextAnalysisRecord({
            iri: Generator.generateUri(),
            analyzedResource: resource,
            created: Date.now(),
            vocabularies: [{iri: vocabularyIri}]
        });
        (loadLatestTextAnalysisRecord as jest.Mock).mockImplementation(() => Promise.resolve(record));
        const wrapper = shallow<ResourceFileDetail>(<ResourceFileDetail resource={EMPTY_RESOURCE}
                                                                        loadResource={loadResource}
                                                                        loadLatestTextAnalysisRecord={loadLatestTextAnalysisRecord} {...routeProps} {...intlFunctions()} {...intlDataForShallow()}/>);
        wrapper.setProps({resource});
        wrapper.update();
        return Promise.resolve().then(() => {
            expect(loadLatestTextAnalysisRecord).toHaveBeenCalledWith(VocabularyUtils.create(resourceNamespace + resourceName));
            const fileDetail = wrapper.find(FileDetail);
            expect(fileDetail.exists()).toBeTruthy();
            expect(fileDetail.prop("vocabularyIri")).toEqual(VocabularyUtils.create(vocabularyIri));
        });
    });

    it("renders info when no text analysis record exists for a standalone file", () => {
        const wrapper = shallow<ResourceFileDetail>(<ResourceFileDetail resource={EMPTY_RESOURCE}
                                                                        loadResource={loadResource}
                                                                        loadLatestTextAnalysisRecord={loadLatestTextAnalysisRecord} {...routeProps} {...intlFunctions()} {...intlDataForShallow()}/>);
        wrapper.setProps({resource});
        wrapper.update();
        return Promise.resolve().then(() => {
            expect(loadLatestTextAnalysisRecord).toHaveBeenCalledWith(VocabularyUtils.create(resourceNamespace + resourceName));
            expect(wrapper.find(FileDetail).exists()).toBeFalsy();
            expect(wrapper.exists("#file-detail-no-vocabulary")).toBeTruthy();
        });
    });

    it("rechecks for Vocabulary IRI when new File is provided", () => {
        const vocabularyIri = Generator.generateUri();
        resource.owner = {
            iri: Generator.generateUri(),
            label: "Test document",
            vocabulary: {iri: vocabularyIri},
            files: [resource]
        };
        const wrapper = shallow<ResourceFileDetail>(<ResourceFileDetail resource={resource}
                                                                        loadResource={loadResource}
                                                                        loadLatestTextAnalysisRecord={loadLatestTextAnalysisRecord} {...routeProps} {...intlFunctions()} {...intlDataForShallow()}/>);
        const anotherFile = new File({
            iri: Generator.generateUri(),
            label: resourceName,
            owner: {
                iri: Generator.generateUri(),
                label: "Test document two",
                vocabulary: {iri: Generator.generateUri()},
                files: []
            },
            types: [VocabularyUtils.FILE, VocabularyUtils.RESOURCE]
        });
        wrapper.setProps({resource: anotherFile});
        wrapper.update();
        const fileDetail = wrapper.find(FileDetail);
        expect(fileDetail.prop("vocabularyIri")).toEqual(VocabularyUtils.create(anotherFile.owner!.vocabulary!.iri!));
    });
});