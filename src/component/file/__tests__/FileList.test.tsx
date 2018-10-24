import * as React from "react";
import {FileList} from "../../file/FileList";
import File from "../../../model/File";
import {mountWithIntl} from "../../../__tests__/environment/Environment";
import {formatMessage, i18n} from "../../../__tests__/environment/IntlUtil";
import {MemoryRouter} from "react-router";
import FileLink from "../FileLink";
import {Button} from "reactstrap";
import VocabularyUtils, {IRI} from "../../../util/VocabularyUtils";


describe('FileList', () => {

    const documentIri = VocabularyUtils.create("http://ex.org/document");
    let files: File[];
    let file: File;
    let startFileTextAnalysis: (documentIri: IRI, fileName: string) => void
    beforeEach(() => {
        files = [
            new File({
                iri: "http://ex.org/file1",
                fileName: "fileName1",
                comment: "comment1"
            }),
            new File({
                iri: "http://ex.org/file2",
                fileName: "fileName2",
            })
        ];
        file = files[0];
        startFileTextAnalysis = jest.fn();
    });

    it('renders file links', () => {

        const wrapper = mountWithIntl(<MemoryRouter>
                <FileList
                    documentIri={documentIri}
                    files={files}
                    startFileTextAnalysis={startFileTextAnalysis}
                    i18n={i18n} formatMessage={formatMessage} locale={'en'}/>
            </MemoryRouter>
        );
        expect(wrapper.find(FileLink).exists()).toBeTruthy();
    });


    it('renders file metadata', () => {

        const wrapper = mountWithIntl(<MemoryRouter>
                <FileList
                    documentIri={documentIri}
                    files={files}
                    startFileTextAnalysis={startFileTextAnalysis}
                    i18n={i18n} formatMessage={formatMessage} locale={'en'}/>
            </MemoryRouter>
        );
        expect(wrapper.text()).toContain("comment1");
        expect(wrapper.text()).toContain("fileName1");
        expect(wrapper.text()).toContain("fileName2");
    });

    it('renders text analysis button', () => {

        const wrapper = mountWithIntl(<MemoryRouter>
                <FileList
                    documentIri={documentIri}
                    files={[file]}
                    startFileTextAnalysis={startFileTextAnalysis}
                    i18n={i18n} formatMessage={formatMessage} locale={'en'}/>
            </MemoryRouter>
        );
        expect(wrapper.find(Button).exists()).toBeTruthy();
    });

    it('on text analysis button click starts the analysis', () => {

        const wrapper = mountWithIntl(<MemoryRouter>
                <FileList
                    documentIri={documentIri}
                    files={[file]}
                    startFileTextAnalysis={startFileTextAnalysis}
                    i18n={i18n} formatMessage={formatMessage} locale={'en'}/>
            </MemoryRouter>
        );

        expect(startFileTextAnalysis).not.toBeCalled();
        wrapper.find(Button).simulate("click");
        expect(startFileTextAnalysis).toBeCalledWith(documentIri, file.fileName)
    });
});