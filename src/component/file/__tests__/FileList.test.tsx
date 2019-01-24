import * as React from "react";
import {FileList} from "../FileList";
import File from "../../../model/File";
import {mountWithIntl} from "../../../__tests__/environment/Environment";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import {MemoryRouter} from "react-router";
import {Button} from "reactstrap";
import Vocabulary from "../../../model/Vocabulary";
import Generator from "../../../__tests__/environment/Generator";
import VocabularyFileLink from "../../vocabulary/VocabularyFileLink";


describe("FileList", () => {
    let files: File[];
    let file: File;
    let startFileTextAnalysis: (file: File) => void;
    let vocabulary: Vocabulary;
    beforeEach(() => {
        files = [
            new File({
                iri: "http://ex.org/file1",
                label: "fileName1",
                comment: "comment1"
            }),
            new File({
                iri: "http://ex.org/file2",
                label: "fileName2",
            })
        ];
        vocabulary = new Vocabulary({
            iri: Generator.generateUri(),
            label: "Test vocabulary"
        });
        file = files[0];
        startFileTextAnalysis = jest.fn();
    });

    it("renders vocabulary file links", () => {

        const wrapper = mountWithIntl(<MemoryRouter>
                <FileList
                    files={files}
                    vocabulary={vocabulary}
                    startFileTextAnalysis={startFileTextAnalysis}
                    {...intlFunctions()}/>
            </MemoryRouter>
        );
        expect(wrapper.find(VocabularyFileLink).exists()).toBeTruthy();
    });


    it("renders file metadata", () => {

        const wrapper = mountWithIntl(<MemoryRouter>
                <FileList
                    files={files}
                    vocabulary={vocabulary}
                    startFileTextAnalysis={startFileTextAnalysis}
                    {...intlFunctions()}/>
            </MemoryRouter>
        );
        expect(wrapper.text()).toContain("comment1");
        expect(wrapper.text()).toContain("fileName1");
        expect(wrapper.text()).toContain("fileName2");
    });

    it("renders text analysis button", () => {

        const wrapper = mountWithIntl(<MemoryRouter>
                <FileList
                    files={[file]}
                    vocabulary={vocabulary}
                    startFileTextAnalysis={startFileTextAnalysis}
                    {...intlFunctions()}/>
            </MemoryRouter>
        );
        expect(wrapper.find(Button).exists()).toBeTruthy();
    });

    it("on text analysis button click starts the analysis", () => {

        const wrapper = mountWithIntl(<MemoryRouter>
                <FileList
                    files={[file]}
                    vocabulary={vocabulary}
                    startFileTextAnalysis={startFileTextAnalysis}
                    {...intlFunctions()}/>
            </MemoryRouter>
        );

        expect(startFileTextAnalysis).not.toBeCalled();
        wrapper.find(Button).simulate("click");
        expect(startFileTextAnalysis).toBeCalledWith(file);
    });
});