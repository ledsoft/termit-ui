import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {createTerm, fetchVocabularyTerm, loadFileContent, loadTerms, saveFileContent} from "../../action/AsyncActions";
import VocabularyUtils, {IRI, IRIImpl} from "../../util/VocabularyUtils";
import IntlData from "../../model/IntlData";
import {ThunkDispatch} from "../../util/Types";
import {Annotator} from "../annotator/Annotator";
import Term from "../../model/Term";
import FetchOptionsFunction from "../../model/Functions";
import IdentifierResolver from "../../util/IdentifierResolver";
import {filterTermsOutsideVocabularyImportChain} from "../term/Terms";


interface FileDetailProvidedProps {
    iri: IRI;
    vocabularyIri: IRI;
}

interface FileDetailOwnProps extends HasI18n {
    fileContent: string | null;
    loadFileContent: (fileIri: IRI) => void;
    saveFileContent: (fileIri: IRI, fileContent: string) => void;
    intl: IntlData;
    createVocabularyTerm: (term: Term, vocabularyIri: IRI) => Promise<string>;
    fetchTerms: (fetchOptions: FetchOptionsFunction, vocabularyIri: IRI) => Promise<Term[]>;
    fetchTerm: (termNormalizedName: string, vocabularyIri: IRI) => Promise<Term>;
}

type FileDetailProps = FileDetailOwnProps & FileDetailProvidedProps;

interface FileDetailState {
    fileContentId: number;
}

// TODO "file detail" --> "file content detail"
export class FileDetail extends React.Component<FileDetailProps, FileDetailState> {

    private terms: object = {};
    private lastExecutedPromise: Promise<Term> | null = null;

    constructor(props: FileDetailProps) {
        super(props);
        this.state = {fileContentId: 1};
    }

    private loadFileContentData = (): void => {
        this.props.loadFileContent({
            fragment: this.props.iri.fragment,
            namespace: this.props.iri.namespace
        });
    };

    // TODO should not be responsibility of file detail
    private initializeTermFetching = (): void => {
        this.ensureInitialFetchTermPromise(); // TODO ?! should be enough to call it on componentDidMount
    };

    public componentDidMount(): void {
        this.loadFileContentData();
        this.initializeTermFetching();
    }

    public componentDidUpdate(prevProps: FileDetailProps): void {
        if (isDifferent(this.props.iri, prevProps.iri) || isDifferent(this.props.vocabularyIri, prevProps.vocabularyIri)) {
            this.loadFileContentData();
        }
        if (prevProps.fileContent !== this.props.fileContent) {
            this.setState({fileContentId: this.state.fileContentId + 1});
        }
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

    private ensureInitialFetchTermPromise = (): void => {
        if (!this.lastExecutedPromise) {
            this.lastExecutedPromise = this.props.fetchTerms({}, this.props.vocabularyIri)
                .then((terms: Term[]) => {
                    this.updateTerms(filterTermsOutsideVocabularyImportChain(terms, [IRIImpl.toString(this.props.vocabularyIri)]));
                }, (d) => d);
        }
    };

    /**
     * Creates lambda function that checks if term identified by termIri is downloaded.
     * If term is already downloaded resolved promise is returned with term as output.
     * If term is not downloaded it returns fetching request promise that updates terms if succeeds and returns the
     * term.
     * @param termIri Iri of searched term.
     */
    private fetchTermPromiseCreator(termIri: string) {
        return () => {
            const term = this.terms[termIri];

            if (!term) {
                return this.props.fetchTerm(VocabularyUtils.create(termIri).fragment, this.props.vocabularyIri)
                    .then((foundTerm: Term) => {
                        this.updateTerms([foundTerm]);
                        const t = this.terms[termIri];
                        if (!t) {
                            throw Error("Term " + termIri + " not found.");
                        }
                        return t;
                    });
            } else {
                return Promise.resolve(term);
            }
        }
    }

    public onCreateTerm = (term: Term): Promise<Term> => {
        return this.props
            .createVocabularyTerm(term, this.props.vocabularyIri)
            .then((location?: string) => {
                if (!location) {
                    return Promise.reject("Could not create term.");
                }
                const termName = IdentifierResolver.extractNameFromLocation(location);
                return this.props.fetchTerm(termName, this.props.vocabularyIri); // TODO use onFetchTerm
            })
    };

    public onFetchTerm = (termIri: string): Promise<Term> => {

        const term = this.terms[termIri];
        if (!term) {
            if (!this.lastExecutedPromise) { // TODO should be initialized here already
                this.ensureInitialFetchTermPromise();
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
            <Annotator key={this.state.fileContentId}
                       initialHtml={this.props.fileContent}
                       onCreateTerm={this.onCreateTerm} onFetchTerm={this.onFetchTerm}
                       onUpdate={this.onUpdate}
                       intl={this.props.intl}/> : null;
    }
}

function isDifferent(iri1?: IRI, iri2?: IRI): boolean {

    const iri1Str = (iri1) ? iri1!.namespace + iri1!.fragment : null;
    const iri2Str = (iri2) ? iri2!.namespace + iri2!.fragment : null;

    return iri1Str !== iri2Str;
}


export default connect((state: TermItState) => {
    return {
        fileContent: state.fileContent,
        intl: state.intl
    };
}, (dispatch: ThunkDispatch) => {
    return {
        loadFileContent: (fileIri: IRI) => dispatch(loadFileContent(fileIri)),
        saveFileContent: (fileIri: IRI, fileContent: string) => dispatch(saveFileContent(fileIri, fileContent)),
        createVocabularyTerm: (term: Term, vocabularyIri: IRI) => dispatch(createTerm(term, vocabularyIri)),
        fetchTerms: (fetchOptions: FetchOptionsFunction, vocabularyIri: IRI) => dispatch(loadTerms(fetchOptions, vocabularyIri)),
        fetchTerm: (termNormalizedName: string, vocabularyIri: IRI) => dispatch(fetchVocabularyTerm(termNormalizedName, vocabularyIri))
    };
})(injectIntl(withI18n(FileDetail)));
