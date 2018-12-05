import * as React from "react";
import Document from "../../../model/Document";
import {FileDetail} from "../FileDetail";
import Vocabulary from "../../../model/Vocabulary";
import {IRI} from "../../../util/VocabularyUtils";
import {intl, intlFunctions} from "../../../__tests__/environment/IntlUtil";
import createMemoryHistory from "history/createMemoryHistory";
import {shallow} from "enzyme";
import {match} from "react-router";
import Generator from "../../../__tests__/environment/Generator";
import {Annotator} from "../../annotator/Annotator";

describe('FileDetail', () => {

    let document: Document;
    let vocabulary: Vocabulary;
    let fileContent: string;
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
    let mockedCallbackProps: {
        loadFileContent: (documentIri: IRI, fileName: string) => void
        saveFileContent: (documentIri: IRI, fileName: string, fileContent: string) => void
        loadDefaultTerms: (normalizedName: string, namespace?: string) => void
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
        fileContent = "<html><body>Test content</body></html>"
        mockedCallbackProps = {
            loadFileContent: jest.fn(),
            saveFileContent: jest.fn(),
            loadDefaultTerms: jest.fn()
        }
    });

    it('loads file content on mount', () => {
        shallow(<FileDetail
            vocabulary={vocabulary}
            document={document}
            fileContent={fileContent}
            {...mockedCallbackProps}
            intl={intl()}
            {...intlFunctions()}
            history={history} location={location} match={routeMatch}
        />);

        expect(mockedCallbackProps.loadFileContent).toBeCalled();
    });


    it('renders annotator of file content', () => {

        const wrapper = shallow(<FileDetail
            vocabulary={vocabulary}
            document={document}
            fileContent={fileContent}
            {...mockedCallbackProps}
            intl={intl()}
            {...intlFunctions()}
            history={history} location={location} match={routeMatch}
        />);

        expect(wrapper.find(Annotator).exists()).toBeTruthy()
    });
});