import * as React from "react";
import {FileList} from "../FileList";
import File from "../../../model/File";
import {mountWithIntl} from "../../../__tests__/environment/Environment";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import {MemoryRouter} from "react-router";
import {Button} from "reactstrap";
import Vocabulary from "../../../model/Vocabulary";
import Generator from "../../../__tests__/environment/Generator";
import VocabularyFileContentLink from "../../vocabulary/VocabularyFileContentLink";
import ResourceLink from "../../resource/ResourceLink";


describe("FileList", () => {
    let files: File[];
    let file: File;
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
    });

    it("renders vocabulary file links", () => {
        const wrapper = mountWithIntl(<MemoryRouter>
                <FileList files={files} vocabulary={vocabulary} {...intlFunctions()}/>
            </MemoryRouter>
        );
        expect(wrapper.find(VocabularyFileContentLink).exists()).toBeTruthy();
    });


    it("renders file metadata", () => {
        const wrapper = mountWithIntl(<MemoryRouter>
                <FileList files={files} vocabulary={vocabulary} {...intlFunctions()}/>
            </MemoryRouter>
        );
        expect(wrapper.text()).toContain("fileName1");
        expect(wrapper.text()).toContain("fileName2");
    });

    it("renders text analysis button", () => {
        const wrapper = mountWithIntl(<MemoryRouter>
                <FileList files={[file]} vocabulary={vocabulary} {...intlFunctions()}/>
            </MemoryRouter>
        );
        expect(wrapper.find(Button).exists()).toBeTruthy();
    });

    it("renders Files ordered by label", () => {
        files[0].label = "b";
        files[1].label = "a";
        const wrapper = mountWithIntl(<MemoryRouter>
                <FileList files={files} vocabulary={vocabulary} {...intlFunctions()}/>
            </MemoryRouter>
        );
        const links = wrapper.find(ResourceLink);
        expect(links.length).toEqual(2);
        expect(links.at(0).text()).toContain(files[1].label);
        expect(links.at(1).text()).toContain(files[0].label);
    });
});