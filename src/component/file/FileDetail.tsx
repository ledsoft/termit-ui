import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from '../hoc/withI18n';
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {
    fetchVocabularyTerm,
    fetchVocabularyTerms,
    loadDefaultTerms,
    loadFileContent,
    saveFileContent
} from "../../action/AsyncActions";
import Document from "../../model/Document";
import {RouteComponentProps} from "react-router";
import VocabularyUtils, {IRI} from "../../util/VocabularyUtils";
import Vocabulary from "../../model/Vocabulary";
import IntlData from "../../model/IntlData";
import {ThunkDispatch} from "../../util/Types";
import {Annotator} from "../annotator/Annotator";
import Term from "../../model/Term";
import FetchOptionsFunction from "../../model/Functions";
import Utils from "../../util/Utils";


interface FileDetailProps extends HasI18n, RouteComponentProps<any> {
    vocabulary: Vocabulary,
    document: Document,
    fileContent: string | null
    loadFileContent: (fileIri: IRI) => void,
    saveFileContent: (fileIri: IRI, fileContent: string) => void
    loadDefaultTerms: (normalizedName: string, namespace?: string) => void
    intl: IntlData
    fetchTerms: (fetchOptions: FetchOptionsFunction, normalizedName: string) => Promise<Term[]>
    fetchTerm: (termNormalizedName: string, vocabularyNormalizedName: string, namespace?: string) => Promise<Term>
    defaultTerms: Term[]
}

// TODO "file detail" --> "file content detail"
export class FileDetail extends React.Component<FileDetailProps> {

    private terms: object = {};
    private lastExecutedPromise: Promise<Term> | null = null;

    constructor(props: FileDetailProps) {
        super(props);
    }

    public componentDidMount(): void {
        const normalizedFileName = this.props.match.params.name;
        this.props.loadFileContent({
            fragment: normalizedFileName,
            namespace: Utils.extractQueryParam(this.props.location.search, "namespace")
        });
        // TODO should not be responsibility of file detail
        if (this.props.defaultTerms.length === 0) {
            this.props.loadDefaultTerms(VocabularyUtils.create(this.props.vocabulary.iri).fragment, VocabularyUtils.create(this.props.vocabulary.iri).namespace);
            this.createInitialFetchTermPromise();
        } else {
            this.updateTerms(this.props.defaultTerms)
        }
    }

    private onUpdate = (newFileContent: string) => {
        const normalizedFileName = this.props.match.params.name;
        this.props.saveFileContent({
            fragment: normalizedFileName,
            namespace: Utils.extractQueryParam(this.props.location.search, "namespace")
        }, newFileContent);
    };

    private updateTerms(retrievedTerms: Term[]) {
        retrievedTerms.forEach((t: Term) => this.terms[t.iri] = t);
    }

    private createInitialFetchTermPromise() {
        this.lastExecutedPromise = this.props.fetchTerms({}, this.getVocabularyNormalizedName())
            .then((terms: Term[]) => {
                this.updateTerms(terms);
            }, (d) => d);
    }

    private getVocabularyNormalizedName(): string {
        return VocabularyUtils.create(this.props.vocabulary.iri).fragment;
    }

    private getVocabularyIri(): IRI {
        return VocabularyUtils.create(this.props.vocabulary.iri);
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
                return this.props.fetchTerm(VocabularyUtils.create(termIri).fragment,
                    this.getVocabularyIri().fragment,
                    this.getVocabularyIri().namespace
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
            this.lastExecutedPromise = this.lastExecutedPromise!
                .then((d) => d, (d) => d)
                .then(this.fetchTermPromiseCreator(termIri));

            return this.lastExecutedPromise;
        } else {
            return Promise.resolve(term)
        }
    }

    public render() {
        return (this.props.fileContent) ?
            <Annotator html={this.props.fileContent} onFetchTerm={this.onFetchTerm} onUpdate={this.onUpdate}
                       intl={this.props.intl}/> : null;
    }
}

export default connect((state: TermItState) => {
    return {
        vocabulary: state.vocabulary,
        document: state.document,
        fileContent: state.fileContent,
        intl: state.intl,
        defaultTerms: state.defaultTerms
    };
}, (dispatch: ThunkDispatch) => {
    return {
        loadFileContent: (fileIri: IRI) => dispatch(loadFileContent(fileIri)),
        saveFileContent: (fileIri: IRI, fileContent: string) => dispatch(saveFileContent(fileIri, fileContent)),
        loadDefaultTerms: (normalizedName: string, namespace?: string) => dispatch(loadDefaultTerms(normalizedName, namespace)),
        fetchTerms: (fetchOptions: FetchOptionsFunction, normalizedName: string) => dispatch(fetchVocabularyTerms(fetchOptions, normalizedName)),
        fetchTerm: (termNormalizedName: string, vocabularyNormalizedName: string, namespace?: string) => dispatch(fetchVocabularyTerm(termNormalizedName, vocabularyNormalizedName, namespace))
    };
})(injectIntl(withI18n(FileDetail)));