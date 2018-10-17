import * as React from "react";
import {FileList} from "../../file/FileList";
import File from "../../../model/File";
import {mountWithIntl} from "../../../__tests__/environment/Environment";
import {formatMessage, i18n} from "../../../__tests__/environment/IntlUtil";
import {MemoryRouter} from "react-router";
import FileLink from "../FileLink";


describe('FileList', () => {

    let files: File[];
    beforeEach(() => {
        files = [
            new File({
                iri: "http://ex.org/file1",
                fileName: "file1"
            })
        ];
    });

    it('renders file links', () => {

        const wrapper = mountWithIntl(<MemoryRouter>
                <FileList
                    files={files}
                    i18n={i18n} formatMessage={formatMessage}/>
            </MemoryRouter>
        );
        expect(wrapper.find(FileLink).exists()).toBeTruthy();
    });
});