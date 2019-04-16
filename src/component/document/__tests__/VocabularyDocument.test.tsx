import * as React from "react";
import Vocabulary from "../../../model/Vocabulary";
import Document from "../../../model/Document";
import File from "../../../model/File";
import Generator from "../../../__tests__/environment/Generator";
import {shallow} from "enzyme";
import {VocabularyDocument} from "../VocabularyDocument";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import {intlDataForShallow} from "../../../__tests__/environment/Environment";
import VocabularyUtils from "../../../util/VocabularyUtils";

describe("VocabularyDocument", () => {

    const fileName = "test.html";
    const fileIri = "http://onto.fel.cvut.cz/ontologies/termit/resource/" + fileName;

    let vocabulary: Vocabulary;

    let createFile: (file: File, documentIri: string) => Promise<string>;
    let loadVocabulary: (vocabularyIri: string) => void;

    beforeEach(() => {
        vocabulary = new Vocabulary({
            iri: Generator.generateUri(),
            label: "Test vocabulary",
            document: new Document({
                iri: Generator.generateUri(),
                label: "Test document",
                files: []
            })
        });
        createFile = jest.fn().mockImplementation(() => Promise.resolve(fileIri));
        loadVocabulary = jest.fn().mockImplementation(() => Promise.resolve());
    });

    it("adds file type to data submitted to create action", () => {
        const wrapper = shallow<VocabularyDocument>(<VocabularyDocument vocabulary={vocabulary}
                                                                        loadVocabulary={loadVocabulary}
                                                                        createFile={createFile} {...intlFunctions()} {...intlDataForShallow()}/>);
        const file = new File({
            iri: fileIri,
            label: fileName
        });
        wrapper.instance().createFile(file);
        expect(createFile).toHaveBeenCalled();
        const args = (createFile as jest.Mock).mock.calls[0];
        expect(args[0].types.indexOf(VocabularyUtils.FILE)).not.toEqual(-1);
        expect(args[1]).toEqual(vocabulary.document!.iri);
    });

    it("closes file creation dialog on successful creation", () => {
        const wrapper = shallow<VocabularyDocument>(<VocabularyDocument vocabulary={vocabulary}
                                                                        loadVocabulary={loadVocabulary}
                                                                        createFile={createFile} {...intlFunctions()} {...intlDataForShallow()}/>);
        wrapper.instance().setState({createFileDialogOpen: true});
        const file = new File({
            iri: fileIri,
            label: fileName
        });
        wrapper.instance().createFile(file);
        return Promise.resolve().then(() => {
            expect(wrapper.instance().state.createFileDialogOpen).toBeFalsy();
        });
    });

    it("reloads vocabulary after successful file creation", () => {
        const wrapper = shallow<VocabularyDocument>(<VocabularyDocument vocabulary={vocabulary}
                                                                        loadVocabulary={loadVocabulary}
                                                                        createFile={createFile} {...intlFunctions()} {...intlDataForShallow()}/>);
        const file = new File({
            iri: fileIri,
            label: fileName
        });
        wrapper.instance().createFile(file);
        return Promise.resolve().then(() => {
            expect(loadVocabulary).toHaveBeenCalledWith(vocabulary.iri);
        });
    });
});
