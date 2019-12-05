import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import Term, {TermData} from "../../model/Term";
import FetchOptionsFunction from "../../model/Functions";
import VocabularyUtils, {IRI} from "../../util/VocabularyUtils";
import {connect} from "react-redux";
import {ThunkDispatch, TreeSelectFetchOptionsParams} from "../../util/Types";
import {loadImportedVocabularies, loadTerms} from "../../action/AsyncActions";
import {FormGroup, Label} from "reactstrap";
import Utils from "../../util/Utils";
// @ts-ignore
import {IntelligentTreeSelect} from "intelligent-tree-select";
import IncludeImportedTermsToggle from "./IncludeImportedTermsToggle";
import {createTermsWithImportsOptionRenderer} from "../misc/treeselect/Renderers";
import Vocabulary from "../../model/Vocabulary";
import TermItState from "../../model/TermItState";
import CustomInput from "../misc/CustomInput";
import {commonTermTreeSelectProps, processTermsForTreeSelect} from "./TermTreeSelectHelper";

function filterOutCurrentTerm(terms: Term[], currentTermIri?: string) {
    if (currentTermIri) {
        const result = [];
        for (const t of terms) {
            if (t.iri === currentTermIri) {
                continue;
            }
            if (t.plainSubTerms) {
                t.plainSubTerms = t.plainSubTerms.filter(st => st !== currentTermIri);
            }
            result.push(t);
        }
        return result;
    } else {
        return terms;
    }
}

interface ParentTermSelectorProps extends HasI18n {
    id: string;
    termIri?: string;
    parentTerms?: TermData[];
    vocabularyIri: string;
    currentVocabulary?: Vocabulary;
    onChange: (newParents: Term[]) => void;
    loadTerms: (fetchOptions: FetchOptionsFunction, vocabularyIri: IRI) => Promise<Term[]>;
    loadImportedVocabularies: (vocabularyIri: IRI) => Promise<string[]>;
}

interface ParentTermSelectorState {
    includeImported: boolean;
    importedVocabularies?: string[];
}

export class ParentTermSelector extends React.Component<ParentTermSelectorProps, ParentTermSelectorState> {

    private readonly treeComponent: React.RefObject<IntelligentTreeSelect>;

    constructor(props: ParentTermSelectorProps) {
        super(props);
        this.treeComponent = React.createRef();
        this.state = {includeImported: ParentTermSelector.hasParentInDifferentVocabulary(props.vocabularyIri, props.parentTerms)};
    }

    private static hasParentInDifferentVocabulary(vocabularyIri: string, parentTerms?: TermData[]) {
        return Utils.sanitizeArray(parentTerms).findIndex(pt => pt.vocabulary !== undefined && pt.vocabulary.iri !== vocabularyIri) !== -1;
    }

    public componentDidMount(): void {
        if (this.props.currentVocabulary && this.props.currentVocabulary.iri === this.props.vocabularyIri) {
            // No need to load imported vocabularies when vocabulary in state matches the term's vocabulary
            this.setState({importedVocabularies: this.props.currentVocabulary.allImportedVocabularies});
        } else {
            this.props.loadImportedVocabularies(VocabularyUtils.create(this.props.vocabularyIri)).then(data => this.setState({importedVocabularies: data}));
        }
    }

    public componentDidUpdate(): void {
        if (!this.state.importedVocabularies) {
            // This can happen when the component is displayed while vocabulary is still being loaded
            this.props.loadImportedVocabularies(VocabularyUtils.create(this.props.vocabularyIri)).then(data => this.setState({importedVocabularies: data}));
        }
    }

    public onChange = (val: Term[] | Term | null) => {
        if (!val) {
            this.props.onChange([]);
        } else {
            this.props.onChange(Utils.sanitizeArray(val).filter(v => v.iri !== this.props.termIri));
        }
    };

    public fetchOptions = (fetchOptions: TreeSelectFetchOptionsParams<TermData>) => {
        // Use option vocabulary when present, it may differ from the current vocabulary (when option is from imported
        // vocabulary)
        return this.props.loadTerms({
            ...fetchOptions,
            includeImported: this.state.includeImported
        }, VocabularyUtils.create(fetchOptions.option ? fetchOptions.option.vocabulary!.iri! : this.props.vocabularyIri)).then(terms => {
            const matchingVocabularies = Utils.sanitizeArray(this.state.importedVocabularies).concat(this.props.vocabularyIri);
            return filterOutCurrentTerm(processTermsForTreeSelect(terms, matchingVocabularies, fetchOptions), this.props.termIri);
        });
    };

    private onIncludeImportedToggle = () => {
        this.setState({includeImported: !this.state.includeImported}, () => this.treeComponent.current.resetOptions());
    };

    private resolveSelectedParent() {
        const parents = Utils.sanitizeArray(this.props.parentTerms);
        // Try first finding a parent within the same vocabulary
        let selected = parents.find(t => t.vocabulary !== undefined && t.vocabulary.iri === this.props.vocabularyIri);
        if (!selected) {
            // Otherwise, find a parent with a vocabulary
            selected = parents.find(t => t.vocabulary !== undefined);
        }
        return selected ? selected.iri : undefined;
    }

    public render() {
        return <FormGroup id={this.props.id}>
            <Label className="attribute-label">{this.props.i18n("term.metadata.parent")}</Label>
            <IncludeImportedTermsToggle id={this.props.id + "-include-imported"} onToggle={this.onIncludeImportedToggle}
                                        includeImported={this.state.includeImported} style={{float: "right"}}/>
            {this.renderSelector()}
        </FormGroup>;
    }

    private renderSelector() {
        if (!this.state.importedVocabularies) {
            // render placeholder input until imported vocabularies are loaded
            return <CustomInput placeholder={this.props.i18n("glossary.select.placeholder")} disabled={true}/>;
        } else {
            return <IntelligentTreeSelect onChange={this.onChange}
                                          ref={this.treeComponent}
                                          value={this.resolveSelectedParent()}
                                          fetchOptions={this.fetchOptions}
                                          fetchLimit={300}
                                          maxHeight={200}
                                          multi={false}
                                          optionRenderer={createTermsWithImportsOptionRenderer(this.props.vocabularyIri)}
                                          {...commonTermTreeSelectProps(this.props.i18n)}/>;
        }
    }
}

export default connect((state: TermItState) => {
    return {
        currentVocabulary: state.vocabulary
    };
}, ((dispatch: ThunkDispatch) => {
    return {
        loadTerms: (fetchOptions: FetchOptionsFunction, vocabularyIri: IRI) => dispatch(loadTerms(fetchOptions, vocabularyIri)),
        loadImportedVocabularies: (vocabularyIri: IRI) => dispatch(loadImportedVocabularies(vocabularyIri))
    }
}))(injectIntl(withI18n(ParentTermSelector)));
