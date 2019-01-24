import * as React from "react";
import {FileDetail} from "../FileDetail";
import OntologicalVocabulary from "../../../util/VocabularyUtils";
import VocabularyUtils, {IRI} from "../../../util/VocabularyUtils";
import {intl, intlFunctions} from "../../../__tests__/environment/IntlUtil";
import {shallow} from "enzyme";
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


describe("FileDetail", () => {

    const fileIri = VocabularyUtils.create("http://file.org/file-iri");
    const vocabularyIri = VocabularyUtils.create("http://vocabulary.org/vocabulary-iri");
    let fileContent: string;
    let mockedFunctionLikeProps: {
        loadFileContent: (fileIri: IRI) => void
        saveFileContent: (fileIri: IRI, fileContent: string) => void
        loadDefaultTerms: (normalizedName: string, namespace?: string) => void
        fetchTerms: (fetchOptions: FetchOptionsFunction, vocabularyNormalizedName: string, namespace?: string) => Promise<Term[]>
        fetchTerm: (termNormalizedName: string, vocabularyNormalizedName: string, namespace?: string) => Promise<Term>
    };
    let mockDataProps: {
        defaultTerms: Term[]
    };


    beforeEach(() => {
        fileContent = "<html><body>Test content</body></html>";
        mockedFunctionLikeProps = {
            loadFileContent: jest.fn(),
            saveFileContent: jest.fn(),
            loadDefaultTerms: jest.fn(),
            fetchTerms: (fetchOptions, normalizedName) => Promise.resolve([]),
            fetchTerm: (termNormalizedName, vocabularyNormalizedName, namespace) => Promise.resolve(generateTerm(0))
        };
        mockDataProps = {
            defaultTerms: []
        }
    });

    it("loads file content on mount", () => {
        shallow(<FileDetail
            iri={fileIri}
            vocabularyIri={vocabularyIri}
            fileContent={fileContent}
            {...mockDataProps}
            {...mockedFunctionLikeProps}
            intl={intl()}
            {...intlFunctions()}
        />);

        expect(mockedFunctionLikeProps.loadFileContent).toBeCalled();
    });


    it("renders annotator of file content", () => {

        const wrapper = shallow(<FileDetail
            iri={fileIri}
            vocabularyIri={vocabularyIri}
            fileContent={fileContent}
            {...mockedFunctionLikeProps}
            {...mockDataProps}
            intl={intl()}
            {...intlFunctions()}
        />);

        expect(wrapper.find(Annotator).exists()).toBeTruthy()
    });


    it("fetches root terms within initialization", () => {
        mockedFunctionLikeProps.fetchTerms = jest.fn(() => Promise.resolve([]));

        shallow(<FileDetail
            iri={fileIri}
            vocabularyIri={vocabularyIri}
            fileContent={fileContent}
            {...mockDataProps}
            {...mockedFunctionLikeProps}
            intl={intl()}
            {...intlFunctions()}
        />);

        expect(mockedFunctionLikeProps.fetchTerms).toBeCalledWith({}, vocabularyIri.fragment, vocabularyIri.namespace)
    });

    it("onFetchTerm returns cached root term", async () => {
        const terms: Term[] = [0, 1, 2, 3].map(i => generateTerm(i));
        mockedFunctionLikeProps.fetchTerms = jest.fn(() => Promise.resolve(terms))

        const wrapper = shallow(<FileDetail
            iri={fileIri}
            vocabularyIri={vocabularyIri}
            fileContent={fileContent}
            {...mockDataProps}
            {...mockedFunctionLikeProps}
            intl={intl()}
            {...intlFunctions()}
        />);

        // @ts-ignore
        const returnedTerm = await wrapper.instance().onFetchTerm(terms[1].iri);

        expect(mockedFunctionLikeProps.fetchTerms).toBeCalledWith({}, vocabularyIri.fragment, vocabularyIri.namespace)
        expect(mockedFunctionLikeProps.fetchTerms).toHaveBeenCalledTimes(1);
        expect(returnedTerm).toEqual(terms[1]);
    });

    it("onFetchTerm fetches non-root term", async () => {
        const terms: Term[] = [0, 1, 2, 3].map(i => generateTerm(i));
        const term4 = generateTerm(4);
        mockedFunctionLikeProps.fetchTerms = jest.fn()
            .mockImplementationOnce(() => Promise.resolve(terms));
        mockedFunctionLikeProps.fetchTerm = jest.fn()
            .mockImplementationOnce(() => Promise.resolve(term4));

        const wrapper = shallow(<FileDetail
            iri={fileIri}
            vocabularyIri={vocabularyIri}
            fileContent={fileContent}
            {...mockDataProps}
            {...mockedFunctionLikeProps}
            intl={intl()}
            {...intlFunctions()}
        />);


        // @ts-ignore
        const returnedTerm = await wrapper.instance().onFetchTerm(term4.iri);

        expect(mockedFunctionLikeProps.fetchTerms).toBeCalledWith({}, vocabularyIri.fragment, vocabularyIri.namespace);
        expect(mockedFunctionLikeProps.fetchTerm).toBeCalledWith(
            VocabularyUtils.create(term4.iri).fragment,
            expect.anything(),
            expect.anything()
        );
        expect(mockedFunctionLikeProps.fetchTerms).toHaveBeenCalledTimes(1);
        expect(mockedFunctionLikeProps.fetchTerm).toHaveBeenCalledTimes(1);
        expect(returnedTerm).toEqual(term4);
    });
});