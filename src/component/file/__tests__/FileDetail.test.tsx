import * as React from "react";
import Document from "../../../model/Document";
import {FileDetail} from "../FileDetail";
import Vocabulary from "../../../model/Vocabulary";
import OntologicalVocabulary, {IRI} from "../../../util/VocabularyUtils";
import {intl, intlFunctions} from "../../../__tests__/environment/IntlUtil";
import createMemoryHistory from "history/createMemoryHistory";
import {shallow} from "enzyme";
import {match} from "react-router";
import Generator from "../../../__tests__/environment/Generator";
import {Annotator} from "../../annotator/Annotator";
import FetchOptionsFunction from "../../../model/Functions";
import Term from "../../../model/Term";

function generateTerm(i: number): Term {
    return new Term({
        iri: "http://example.org/term" + i,
        label: "test term " + i,
        types: ["http://example.org/type" + i, OntologicalVocabulary.TERM],
    });
}


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
    let mockedFunctionLikeProps: {
        loadFileContent: (documentIri: IRI, fileName: string) => void
        saveFileContent: (documentIri: IRI, fileName: string, fileContent: string) => void
        loadDefaultTerms: (normalizedName: string, namespace?: string) => void
        fetchTerms: (fetchOptions: FetchOptionsFunction, normalizedName: string) => Promise<Term[]>;
    };
    let mockDataProps: {
        defaultTerms: Term[]
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
        mockedFunctionLikeProps = {
            loadFileContent: jest.fn(),
            saveFileContent: jest.fn(),
            loadDefaultTerms: jest.fn(),
            fetchTerms: (fetchOptions, normalizedName) => Promise.resolve([])
        }
        mockDataProps = {
            defaultTerms: []
        }
    });

    it('loads file content on mount', () => {
        shallow(<FileDetail
            vocabulary={vocabulary}
            document={document}
            fileContent={fileContent}
            {...mockDataProps}
            {...mockedFunctionLikeProps}
            intl={intl()}
            {...intlFunctions()}
            history={history} location={location} match={routeMatch}
        />);

        expect(mockedFunctionLikeProps.loadFileContent).toBeCalled();
    });


    it('renders annotator of file content', () => {

        const wrapper = shallow(<FileDetail
            vocabulary={vocabulary}
            document={document}
            fileContent={fileContent}
            {...mockedFunctionLikeProps}
            {...mockDataProps}
            intl={intl()}
            {...intlFunctions()}
            history={history} location={location} match={routeMatch}
        />);

        expect(wrapper.find(Annotator).exists()).toBeTruthy()
    });


    it('fetches root terms within initialization', () => {
        mockedFunctionLikeProps.fetchTerms = jest.fn(() => Promise.resolve([]))

        shallow(<FileDetail
            vocabulary={vocabulary}
            document={document}
            fileContent={fileContent}
            {...mockDataProps}
            {...mockedFunctionLikeProps}
            intl={intl()}
            {...intlFunctions()}
            history={history} location={location} match={routeMatch}
        />);

        expect(mockedFunctionLikeProps.fetchTerms).toBeCalledWith({}, expect.anything())
    });

    it('fetches root terms within initialization', () => {
        const terms: Term[] = [1,2,3].map(i => generateTerm(i));
        mockedFunctionLikeProps.fetchTerms = jest.fn(() => Promise.resolve(terms))

        shallow(<FileDetail
            vocabulary={vocabulary}
            document={document}
            fileContent={fileContent}
            {...mockDataProps}
            {...mockedFunctionLikeProps}
            intl={intl()}
            {...intlFunctions()}
            history={history} location={location} match={routeMatch}
        />);

        expect(mockedFunctionLikeProps.fetchTerms).toBeCalledWith({}, expect.anything())
    });

    it('onFetchTerm returns cached root term', async () => {
        const terms: Term[] = [0,1,2,3].map(i => generateTerm(i));
        mockedFunctionLikeProps.fetchTerms = jest.fn(() => Promise.resolve(terms))

        const wrapper = shallow(<FileDetail
            vocabulary={vocabulary}
            document={document}
            fileContent={fileContent}
            {...mockDataProps}
            {...mockedFunctionLikeProps}
            intl={intl()}
            {...intlFunctions()}
            history={history} location={location} match={routeMatch}
        />);

        // @ts-ignore
        const returnedTerm = await wrapper.instance().onFetchTerm(terms[1].iri);

        expect(mockedFunctionLikeProps.fetchTerms).toBeCalledWith({}, expect.anything())
        expect(mockedFunctionLikeProps.fetchTerms).toHaveBeenCalledTimes(1);
        expect(returnedTerm).toEqual(terms[1]);
    });

    it('onFetchTerm fetches non-root term', async () => {
        const terms: Term[] = [0,1,2,3].map(i => generateTerm(i));
        const term4 = generateTerm(4);
        const term4WithRandomTerms = [terms[2], term4, terms[3]];
        mockedFunctionLikeProps.fetchTerms = jest.fn()
            .mockImplementationOnce(() => Promise.resolve(terms))
            .mockImplementationOnce(() => Promise.resolve(term4WithRandomTerms));

        const wrapper = shallow(<FileDetail
            vocabulary={vocabulary}
            document={document}
            fileContent={fileContent}
            {...mockDataProps}
            {...mockedFunctionLikeProps}
            intl={intl()}
            {...intlFunctions()}
            history={history} location={location} match={routeMatch}
        />);


        // @ts-ignore
        const returnedTerm = await wrapper.instance().onFetchTerm(term4.iri);

        expect(mockedFunctionLikeProps.fetchTerms).toBeCalledWith({}, expect.anything())
        expect(mockedFunctionLikeProps.fetchTerms).toBeCalledWith({optionID: term4.iri}, expect.anything())
        expect(mockedFunctionLikeProps.fetchTerms).toHaveBeenCalledTimes(2);
        expect(returnedTerm).toEqual(term4);
    });
});