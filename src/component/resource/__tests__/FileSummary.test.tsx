import * as React from "react";
import VocabularyUtils, {IRI} from "../../../util/VocabularyUtils";
import Resource from "../../../model/Resource";
import {shallow} from "enzyme";
import {intlDataForShallow, mountWithIntl} from "../../../__tests__/environment/Environment";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import AppNotification from "../../../model/AppNotification";
import NotificationType from "../../../model/NotificationType";
import File from "../../../model/File";
import {FileSummary} from "../FileSummary";
import Generator from "../../../__tests__/environment/Generator";
import Vocabulary from "../../../model/Vocabulary";

describe("FileSummary", () => {

    const namespace = "http://onto.fel.cvut.cz/ontologies/termit/resources/";
    const resourceName = "test.html";

    let loadResource: (iri: IRI) => Promise<any>;
    let saveResource: (resource: Resource) => Promise<any>;
    let removeResource: (resource: Resource) => Promise<any>;
    let consumeNotification: (notification: AppNotification) => void;
    let publishNotification: (notification: AppNotification) => void;

    let executeFileTextAnalysis: (file: File, vocabularyIri?: string) => Promise<any>;
    let hasContent: (iri: IRI) => Promise<boolean>;
    let downloadContent: (iri: IRI) => void;

    let resourceHandlers: any;

    let file: File;

    beforeEach(() => {
        loadResource = jest.fn().mockImplementation(() => Promise.resolve());
        saveResource = jest.fn().mockImplementation(() => Promise.resolve());
        removeResource = jest.fn().mockImplementation(() => Promise.resolve());
        consumeNotification = jest.fn();
        publishNotification = jest.fn();
        executeFileTextAnalysis = jest.fn().mockImplementation(() => Promise.resolve());
        hasContent = jest.fn().mockImplementation(() => Promise.resolve(true));
        downloadContent = jest.fn();
        resourceHandlers = {
            loadResource,
            saveResource,
            removeResource,
            consumeNotification,
            publishNotification,
            executeFileTextAnalysis,
            hasContent,
            downloadContent
        };
        file = new File({
            iri: namespace + resourceName,
            label: resourceName,
            types: [VocabularyUtils.FILE]
        });
    });

    it("renders content button for File", () => {
        const wrapper = mountWithIntl(<FileSummary resource={file}
                                                   notifications={[]} {...resourceHandlers} {...intlFunctions()}/>);
        return Promise.resolve().then(() => {
            wrapper.update();
            expect(wrapper.exists("button#resource-detail-content-view")).toBeTruthy();
        });
    });

    it("does not render content button for File without content", () => {
        (hasContent as jest.Mock).mockImplementation(() => Promise.resolve(false));
        const wrapper = shallow(<FileSummary
            resource={file} notifications={[]} {...resourceHandlers} {...intlFunctions()}
            {...intlDataForShallow()}/>);
        return Promise.resolve().then(() => {
            wrapper.update();
            expect(wrapper.exists("#resource-detail-content-view")).toBeFalsy();
            expect(hasContent).toHaveBeenCalledWith(VocabularyUtils.create(file.iri));
        });
    });

    it("re-checks File content existence when file content uploaded notification is published ", () => {
        const wrapper = shallow<FileSummary>(<FileSummary resource={file} notifications={[]} {...resourceHandlers}
                                                          {...intlFunctions()} {...intlDataForShallow()}/>);
        const contentNotification: AppNotification = {
            source: {
                type:
                NotificationType.FILE_CONTENT_UPLOADED
            }
        };
        wrapper.setProps({notifications: [contentNotification]});
        wrapper.update(); // The original call + the one after notification expect(hasContent).toHaveBeenCalledTimes(2);
        wrapper.setProps({notifications: []});
    });

    it("consumes File content uploaded notification when it is published", () => {
        const wrapper = shallow<FileSummary>(<FileSummary resource={file}
                                                          notifications={[]} {...resourceHandlers} {...intlFunctions()} {...intlDataForShallow()}/>);
        const contentNotification: AppNotification = {source: {type: NotificationType.FILE_CONTENT_UPLOADED}};
        wrapper.setProps({notifications: [contentNotification]});
        wrapper.update();
        expect(consumeNotification).toHaveBeenCalledWith(contentNotification);
        wrapper.setProps({notifications: []});
    });

    it("publishes notification after text analysis finish for file with vocabulary", () => {
        const documentFile = new File({
            iri: namespace + resourceName,
            label: resourceName,
            owner: {
                iri: Generator.generateUri(),
                label: "Document",
                vocabulary: {iri: Generator.generateUri()},
                files: []
            },
            types: [VocabularyUtils.FILE]
        });
        const wrapper = shallow<FileSummary>(<FileSummary resource={documentFile}
                                                          notifications={[]} {...resourceHandlers} {...intlFunctions()} {...intlDataForShallow()}/>);
        wrapper.instance().onAnalyze();
        expect(executeFileTextAnalysis).toHaveBeenCalledWith(documentFile);
        return Promise.resolve().then(() => {
            expect(publishNotification).toHaveBeenCalledWith({source: {type: NotificationType.TEXT_ANALYSIS_FINISHED}});
        });
    });

    it("publishes notification after text analysis finished when vocabulary was selected", () => {
        const wrapper = shallow<FileSummary>(<FileSummary resource={file}
                                                          notifications={[]} {...resourceHandlers} {...intlFunctions()} {...intlDataForShallow()}/>);
        const vocabulary = new Vocabulary({iri: Generator.generateUri(), label: "Vocabulary"});
        wrapper.instance().onVocabularySet(vocabulary);
        expect(executeFileTextAnalysis).toHaveBeenCalledWith(file, vocabulary.iri);
        return Promise.resolve().then(() => {
            expect(publishNotification).toHaveBeenCalledWith({source: {type: NotificationType.TEXT_ANALYSIS_FINISHED}});
        });
    });

    it("triggers File content download on content download button click", () => {
        const wrapper = shallow<FileSummary>(<FileSummary resource={file}
                                                          notifications={[]} {...resourceHandlers} {...intlFunctions()} {...intlDataForShallow()}/>);
        wrapper.instance().onDownloadContent();
        expect(downloadContent).toHaveBeenCalledWith(VocabularyUtils.create(file.iri));
    });
});