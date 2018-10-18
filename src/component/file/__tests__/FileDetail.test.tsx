import * as React from "react";
import Document from "../../../model/Document";
import {FileDetail} from "../FileDetail";
import Vocabulary from "../../../model/Vocabulary";
import {IRI} from "../../../util/VocabularyUtils";
import {formatMessage, i18n, intl} from "../../../__tests__/environment/IntlUtil";
import createMemoryHistory from "history/createMemoryHistory";
import {shallow} from "enzyme";
import {match} from "react-router";
import {mountWithIntl} from "../../../__tests__/environment/Environment";
import Generator from "../../../__tests__/environment/Generator";

describe('FileDetail', () => {

    let document: Document;
    let vocabulary: Vocabulary;
    let fileContent: string;
    let loadContentFile: (documentIri: IRI, fileName: string) => void
    const history = createMemoryHistory();
    const routeMatch: match<any> = {
        params: {},
        isExact: true,
        path: '',
        url: ''
    };
    const location = {
        pathname: '/',
        search: '',
        hash: '',
        state: {}
    };


    beforeEach(() => {
        document = new Document({
            iri: Generator.generateUri(),
            name: "Test document",
            files: []
        });
        vocabulary = new Vocabulary({
            iri: Generator.generateUri(),
            label: 'Test vocabulary'
        });
        fileContent = "<html prefix=\"ddo: http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/\">\n" +
            "<head></head>\n" +
            "<body class=\"cast\" id=\"tcz_cast_prvni\">\n" +
            "    <h1>Část první:</h1>\n" +
            "    <div class=\"hlava\" id=\"tcz_cast_prvni_hlava_I\">\n" +
            "    </div>\n" +
            "</body>\n" +
            "</html>\n";
        loadContentFile = jest.fn();
    });

    it('loads file content on mount', () => {
        shallow(<FileDetail
            vocabulary={vocabulary}
            document={document}
            fileContent={fileContent}
            loadContentFile={loadContentFile}
            intl={intl()}
            i18n={i18n} formatMessage={formatMessage}
            history={history} location={location} match={routeMatch}
        />);

        expect(loadContentFile).toBeCalled();
    });


    it('renders html from file content', () => {

        const wrapper = mountWithIntl(<FileDetail
            vocabulary={vocabulary}
            document={document}
            fileContent={fileContent}
            loadContentFile={loadContentFile}
            intl={intl()}
            i18n={i18n} formatMessage={formatMessage}
            history={history} location={location} match={routeMatch}
        />);

        expect(wrapper.html().includes(fileContent)).toBe(true);
    });


});