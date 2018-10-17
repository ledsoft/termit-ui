import * as React from "react";
import {DocumentDetail} from "../DocumentDetail";
import Document from "../../../model/Document";
import FileList from "../../file/FileList";
import File from "../../../model/File";
import VocabularyUtils, {IRI} from "../../../util/VocabularyUtils";
import {mountWithIntl} from "../../../__tests__/environment/Environment";
import {formatMessage, i18n} from "../../../__tests__/environment/IntlUtil";
import {MemoryRouter} from "react-router";


describe('DocumentDetail', () => {

    let document: Document;
    let loadDocument: (iri: IRI) => void
    let documentIri: IRI;
    let file: File;
    beforeEach(() => {
        file = new File({
            iri: "http://file1",
            fileName: "file1"
        });
        document = new Document({
            iri: "http://document1",
            name: "",
            files: [file],
            description: ""
        });
        documentIri = VocabularyUtils.create(document.iri);
        loadDocument = jest.fn();
    });

    it('renders file list if document contains files', () => {

        const wrapper = mountWithIntl(<MemoryRouter>
                <DocumentDetail
                    iri={documentIri}
                    document={document}
                    loadDocument={loadDocument}
                    i18n={i18n} formatMessage={formatMessage}/>
            </MemoryRouter>
        );
        expect(wrapper.find(FileList).exists()).toBeTruthy();
    });

    it('does not render file list if document files are missing', () => {

        document.files = [];
        const wrapper = mountWithIntl(<MemoryRouter>
                <DocumentDetail
                    iri={documentIri}
                    document={document}
                    loadDocument={loadDocument}
                    i18n={i18n} formatMessage={formatMessage}/>
            </MemoryRouter>
        );
        expect(wrapper.find(FileList).exists()).toBeFalsy();
    });

});