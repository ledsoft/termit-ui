import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from '../hoc/withI18n';
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {fetchVocabularyTerms, loadDefaultTerms, loadFileContent, saveFileContent} from "../../action/AsyncActions";
import Document from "../../model/Document";
import {RouteComponentProps} from "react-router";
import VocabularyUtils, {IRI} from "../../util/VocabularyUtils";
import Vocabulary from "../../model/Vocabulary";
import IntlData from "../../model/IntlData";
import {ThunkDispatch} from "../../util/Types";
import {Annotator} from "../annotator/Annotator";
import Term from "../../model/Term";
import FetchOptionsFunction from "../../model/Functions";


interface FileDetailProps extends HasI18n, RouteComponentProps<any> {
    vocabulary: Vocabulary,
    document: Document,
    fileContent: string | null
    loadFileContent: (documentIri: IRI, fileName: string) => void,
    saveFileContent: (documentIri: IRI, fileName: string, fileContent: string) => void
    loadDefaultTerms: (normalizedName: string, namespace?: string) => void
    intl: IntlData,
    fetchTerms: (fetchOptions: FetchOptionsFunction, normalizedName: string) => Promise<Term[]>;
    defaultTerms: Term[]
}

// interface FileDetailState {
//     terms: {};
// }

// TODO "file detail" --> "file content detail"
export class FileDetail extends React.Component<FileDetailProps> {

    private terms: object = {};
    private lastExecutedPromise: Promise<Term> | null = null;

    constructor(props: FileDetailProps) {
        super(props);
        // this.state = {
        //     terms: {}
        // };
    }

    public componentDidMount(): void {
        const normalizedFileName = this.props.match.params.name;
        this.props.loadFileContent(VocabularyUtils.create(this.props.document.iri), normalizedFileName);
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
        this.props.saveFileContent(VocabularyUtils.create(this.props.document.iri), normalizedFileName, newFileContent);
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

    private getVocabularyNormalizedName():string {
        return VocabularyUtils.create(this.props.vocabulary.iri).fragment;
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
                return this.props.fetchTerms({optionID: termIri}, this.getVocabularyNormalizedName())
                    .then((terms: Term[]) => {
                        this.updateTerms(terms);
                        const t = this.terms[termIri];
                        if (!t) {
                            throw Error("Term " + termIri + "not found.");
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
        loadFileContent: (documentIri: IRI, fileName: string) => dispatch(loadFileContent(documentIri, fileName)),
        saveFileContent: (documentIri: IRI, fileName: string, fileContent: string) => dispatch(saveFileContent(documentIri, fileName, fileContent)),
        loadDefaultTerms: (normalizedName: string, namespace?: string) => dispatch(loadDefaultTerms(normalizedName, namespace)),
        fetchTerms: (fetchOptions: FetchOptionsFunction, normalizedName: string) => dispatch(fetchVocabularyTerms(fetchOptions, normalizedName))
    };
})(injectIntl(withI18n(FileDetail)));