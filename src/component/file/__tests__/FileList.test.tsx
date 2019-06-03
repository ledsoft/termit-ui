import * as React from "react";
import {FileList} from "../FileList";
import File from "../../../model/File";
import {mountWithIntl} from "../../../__tests__/environment/Environment";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import {MemoryRouter} from "react-router";
import {Button} from "reactstrap";
import ResourceLink from "../../resource/ResourceLink";
import FileContentLink from "../../resource/file/FileContentLink";


describe("FileList", () => {
    let files: File[];
    let file: File;
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
        file = files[0];
    });

    it("renders vocabulary file links", () => {
        const wrapper = mountWithIntl(<MemoryRouter>
                <FileList files={files} {...intlFunctions()}/>
            </MemoryRouter>
        );
        expect(wrapper.find(FileContentLink).exists()).toBeTruthy();
    });


    it("renders file metadata", () => {
        const wrapper = mountWithIntl(<MemoryRouter>
                <FileList files={files} {...intlFunctions()}/>
            </MemoryRouter>
        );
        expect(wrapper.text()).toContain("fileName1");
        expect(wrapper.text()).toContain("fileName2");
    });

    it("renders text analysis button", () => {
        const wrapper = mountWithIntl(<MemoryRouter>
                <FileList files={[file]} {...intlFunctions()}/>
            </MemoryRouter>
        );
        expect(wrapper.find(Button).exists()).toBeTruthy();
    });

    it("renders Files ordered by label", () => {
        files[0].label = "b";
        files[1].label = "a";
        const wrapper = mountWithIntl(<MemoryRouter>
                <FileList files={files} {...intlFunctions()}/>
            </MemoryRouter>
        );
        const links = wrapper.find(ResourceLink);
        expect(links.length).toEqual(2);
        expect(links.at(0).text()).toContain(files[1].label);
        expect(links.at(1).text()).toContain(files[0].label);
    });
});