import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {
    createVocabularyTerm,
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
import IdentifierResolver from "../../util/IdentifierResolver";


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
    createVocabularyTerm: (term: Term, vocabularyIri: IRI) => Promise<string>
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

    public componentDidUpdate(prevProps : FileDetailProps): void {
        if (isDifferent(this.props.iri, prevProps.iri)) {
            this.loadFileContentData();
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

    private createInitialFetchTermPromise = (): void => {
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
    };

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

    public onCreateTerm = (term: Term): Promise<Term> => {
        return this.props
            .createVocabularyTerm(term, this.props.vocabularyIri)
            .then((location: string) => {
                    // TODO nasty workaround for createVocabularyTerm sending error in resolved promise,
                    //      i.e. location.type === "PUBLISH_MESSAGE"
                // @ts-ignore
                if (location.type) {
                    return Promise.reject("Could not create term");
                }
                const termName = IdentifierResolver.extractNameFromLocation(location);
                return this.props.fetchTerm(termName, this.props.vocabularyIri.fragment, this.props.vocabularyIri.namespace); // TODO use onFetchTerm
            })
    };

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
            <Annotator html={this.props.fileContent}
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
        intl: state.intl,
        defaultTerms: state.defaultTerms
    };
}, (dispatch: ThunkDispatch) => {
    return {
        loadFileContent: (fileIri: IRI) => dispatch(loadFileContent(fileIri)),
        saveFileContent: (fileIri: IRI, fileContent: string) => dispatch(saveFileContent(fileIri, fileContent)),
        loadDefaultTerms: (normalizedName: string, namespace?: string) => dispatch(loadDefaultTerms(normalizedName, namespace)),
        createVocabularyTerm: (term: Term, vocabularyIri: IRI) => dispatch(createVocabularyTerm(term, vocabularyIri)),
        fetchTerms: (fetchOptions: FetchOptionsFunction, vocabularyNormalizedName: string, namespace?: string) => dispatch(fetchVocabularyTerms(fetchOptions, vocabularyNormalizedName, namespace)),
        fetchTerm: (termNormalizedName: string, vocabularyNormalizedName: string, namespace?: string) => dispatch(fetchVocabularyTerm(termNormalizedName, vocabularyNormalizedName, namespace))
    };
})(injectIntl(withI18n(FileDetail)));