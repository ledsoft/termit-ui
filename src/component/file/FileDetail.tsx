import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {
    fetchVocabularyTerm,
    fetchVocabularyTerms,
    loadDefaultTerms,
    loadFileContent,
    saveFileContent
} from "../../action/AsyncActions";
import VocabularyUtils, {IRI} from "../../util/VocabularyUtils";
import IntlData from "../../model/IntlData";
import {ThunkDispatch} from "../../util/Types";
import {Annotator} from "../annotator/Annotator";
import Term from "../../model/Term";
import FetchOptionsFunction from "../../model/Functions";


interface FileDetailProvidedProps {
    iri: IRI
    vocabularyIri: IRI
}

interface FileDetailOwnProps extends HasI18n {
    fileContent: string | null
    loadFileContent: (fileIri: IRI) => void
    saveFileContent: (fileIri: IRI, fileContent: string) => void
    loadDefaultTerms: (normalizedName: string, namespace?: string) => void
    intl: IntlData
    fetchTerms: (fetchOptions: FetchOptionsFunction, vocabularyNormalizedName: string, namespace?: string) => Promise<Term[]>
    fetchTerm: (termNormalizedName: string, vocabularyNormalizedName: string, namespace?: string) => Promise<Term>
    defaultTerms: Term[]
}

type FileDetailProps = FileDetailOwnProps & FileDetailProvidedProps;

// TODO "file detail" --> "file content detail"
export class FileDetail extends React.Component<FileDetailProps> {

    private terms: object = {};
    private lastExecutedPromise: Promise<Term> | null = null;

    constructor(props: FileDetailProps) {
        super(props);
    }

    private loadFileContentData = (): void => {
        this.props.loadFileContent({
            fragment: this.props.iri.fragment,
            namespace: this.props.iri.namespace
        });
    };

    // TODO should not be responsibility of file detail
    private initializeTermFetching = (): void => {
        this.createInitialFetchTermPromise(); // TODO ?! should be enough to call it on componentDidMount
        if (this.props.defaultTerms.length === 0) {
            this.props.loadDefaultTerms(this.props.vocabularyIri.fragment, this.props.vocabularyIri.namespace);
        } else {
            this.updateTerms(this.props.defaultTerms)
        }
    };

    public componentDidMount(): void {
        this.loadFileContentData();
        this.initializeTermFetching();

    }

    public componentDidUpdate(): void {
        this.initializeTermFetching();
    }

    private onUpdate = (newFileContent: string) => {
        this.props.saveFileContent({
            fragment: this.props.iri.fragment,
            namespace: this.props.iri.namespace
        }, newFileContent);
    };

    private updateTerms(retrievedTerms: Term[]) {
        retrievedTerms.forEach((t: Term) => this.terms[t.iri] = t);
    }

    private createInitialFetchTermPromise = ():void => {
        if (!this.lastExecutedPromise) {
            this.lastExecutedPromise = this.props.fetchTerms(
                {},
                this.props.vocabularyIri.fragment,
                this.props.vocabularyIri.namespace
            )
                .then((terms: Term[]) => {
                    this.updateTerms(terms);
                }, (d) => d);
        }
    }

    /**
     * Creates lambda function that checks if term identified by termIri is downloaded.
     * If term is already downloaded resolved promise is returned with term as output.
     * If term is not downloaded it returns fetching request promise that updates terms if succeeds and returns the term.
     * @param termIri Iri of searched term.
     */
    private fetchTermPromiseCreator(termIri: string) {
        return () => {
            const term = this.terms[termIri];

            if (!term) {
                return this.props.fetchTerm(
                    VocabularyUtils.create(termIri).fragment,
                    this.props.vocabularyIri.fragment,
                    this.props.vocabularyIri.namespace
                )
                    .then((foundTerm: Term) => {
                        this.updateTerms([foundTerm]);
                        const t = this.terms[termIri];
                        if (!t) {
                            throw Error("Term " + termIri + " not found.");
                        }
                        return t;
                    })
            } else {
                return Promise.resolve(term);
            }
        }
    }

    public onFetchTerm = (termIri: string): Promise<Term> => {

        const term = this.terms[termIri];
        if (!term) {
            if (!this.lastExecutedPromise) { // TODO should be initialized here already
                this.createInitialFetchTermPromise();
            }
            this.lastExecutedPromise = this.lastExecutedPromise!
                .then((d) => d, (d) => d)
                .then(this.fetchTermPromiseCreator(termIri));

            return this.lastExecutedPromise;
        } else {
            return Promise.resolve(term)
        }
    };

    public render() {
        return (this.props.fileContent) ?
            <Annotator html={this.props.fileContent} onFetchTerm={this.onFetchTerm} onUpdate={this.onUpdate}
                       intl={this.props.intl}/> : null;
    }
}

export default connect((state: TermItState) => {
    return {
        fileContent: state.fileContent,
        intl: state.intl,
        defaultTerms: state.defaultTerms
    };
}, (dispatch: ThunkDispatch) => {
    return {
        loadFileContent: (fileIri: IRI) => dispatch(loadFileContent(fileIri)),
        saveFileContent: (fileIri: IRI, fileContent: string) => dispatch(saveFileContent(fileIri, fileContent)),
        loadDefaultTerms: (normalizedName: string, namespace?: string) => dispatch(loadDefaultTerms(normalizedName, namespace)),
        fetchTerms: (fetchOptions: FetchOptionsFunction, vocabularyNormalizedName: string, namespace?: string) => dispatch(fetchVocabularyTerms(fetchOptions, vocabularyNormalizedName, namespace)),
        fetchTerm: (termNormalizedName: string, vocabularyNormalizedName: string, namespace?: string) => dispatch(fetchVocabularyTerm(termNormalizedName, vocabularyNormalizedName, namespace))
    };
})(injectIntl(withI18n(FileDetail)));