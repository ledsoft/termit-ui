import * as React from "react";
import {DocumentDetail} from "../DocumentDetail";
import Document from "../../../model/Document";
import FileList from "../../file/FileList";
import VocabularyUtils, {IRI} from "../../../util/VocabularyUtils";
import {intlDataForShallow, mountWithIntl} from "../../../__tests__/environment/Environment";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import {MemoryRouter} from "react-router";
import {shallow} from "enzyme";

describe('DocumentDetail', () => {

    let document: Document;
    let loadDocument: (iri: IRI) => void
    let documentIri: IRI;
    const newDocumentIri = VocabularyUtils.create("http://ex.org/new-document-iri");
    beforeEach(() => {
        document = new Document({
            iri: "http://ex.org/document1",
            label: "Document1",
            files: []
        });
        documentIri = VocabularyUtils.create(document.iri);
        loadDocument = jest.fn();
    });

    it('renders file list', () => {
        const wrapper = mountWithIntl(<MemoryRouter>
                <DocumentDetail
                    iri={documentIri}
                    document={document}
                    loadDocument={loadDocument}
                    {...intlFunctions()}/>
            </MemoryRouter>
        );
        expect(wrapper.find(FileList).exists()).toBeTruthy();
    });

    it('does not load document on mount if already loaded', () => {
        shallow(<DocumentDetail
            iri={documentIri}
            document={document}
            loadDocument={loadDocument}
            {...intlFunctions()} {...intlDataForShallow()}/>
        );
        expect(loadDocument).not.toHaveBeenCalled();
    });

    it('loads document on mount if not loaded', () => {
        shallow(<DocumentDetail
            iri={newDocumentIri}
            document={document}
            loadDocument={loadDocument}
            {...intlFunctions()} {...intlDataForShallow()}/>
        );
        expect(loadDocument).toHaveBeenCalledWith(newDocumentIri);
    });



});