import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import Term, {TermData} from "../../model/Term";
import FetchOptionsFunction from "../../model/Functions";
import VocabularyUtils, {IRI} from "../../util/VocabularyUtils";
import {connect} from "react-redux";
import {ThunkDispatch, TreeSelectFetchOptionsParams} from "../../util/Types";
import {loadTerms} from "../../action/AsyncActions";
import {FormGroup, Label} from "reactstrap";
import Utils from "../../util/Utils";
// @ts-ignore
import {IntelligentTreeSelect} from "intelligent-tree-select";
import IncludeImportedTermsToggle from "./IncludeImportedTermsToggle";
import {createTermsWithImportsOptionRenderer} from "../misc/treeselect/Renderers";

interface ParentTermSelectorProps extends HasI18n {
    id: string;
    termIri?: string;
    parentTerms?: TermData[];
    vocabularyIri: string;
    onChange: (newParents: Term[]) => void;
    loadTerms: (fetchOptions: FetchOptionsFunction, vocabularyIri: IRI) => Promise<Term[]>;
}

export class ParentTermSelector extends React.Component<ParentTermSelectorProps, { includeImported: boolean }> {

    private readonly treeComponent: React.RefObject<IntelligentTreeSelect>;

    constructor(props: ParentTermSelectorProps) {
        super(props);
        this.treeComponent = React.createRef();
        this.state = {includeImported: ParentTermSelector.hasParentInDifferentVocabulary(props.vocabularyIri, props.parentTerms)};
    }

    private static hasParentInDifferentVocabulary(vocabularyIri: string, parentTerms?: TermData[]) {
        return Utils.sanitizeArray(parentTerms).findIndex(pt => pt.vocabulary !== undefined && pt.vocabulary.iri !== vocabularyIri) !== -1;
    }

    public onChange = (val: Term[] | Term | null) => {
        if (!val) {
            this.props.onChange([]);
        } else {
            this.props.onChange(Utils.sanitizeArray(val).filter(v => v.iri !== this.props.termIri));
        }
    };

    public fetchOptions = ({searchString, optionID, limit, offset, option}: TreeSelectFetchOptionsParams<TermData>) => {
        // Use option vocabulary when present, it may differ from the current vocabulary (when option is from imported
        // vocabulary)
        return this.props.loadTerms({
            searchString,
            optionID,
            limit,
            offset,
            includeImported: this.state.includeImported
        }, VocabularyUtils.create(option ? option.vocabulary!.iri! : this.props.vocabularyIri)).then(terms => {
            const currentTermIri = this.props.termIri;
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
            }
            return terms;
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
            <IntelligentTreeSelect onChange={this.onChange}
                                   ref={this.treeComponent}
                                   value={this.resolveSelectedParent()}
                                   fetchOptions={this.fetchOptions}
                                   fetchLimit={100000}
                                   valueKey="iri"
                                   labelKey="label"
                                   childrenKey="plainSubTerms"
                                   simpleTreeData={true}
                                   showSettings={false}
                                   maxHeight={200}
                                   multi={false}
                                   renderAsTree={true}
                                   placeholder={this.props.i18n("glossary.select.placeholder")}
                                   optionRenderer={createTermsWithImportsOptionRenderer(this.props.vocabularyIri)}
                                   valueRenderer={Utils.labelValueRenderer}/>
        </FormGroup>;
    }
}

export default connect(undefined, ((dispatch: ThunkDispatch) => {
    return {
        loadTerms: (fetchOptions: FetchOptionsFunction, vocabularyIri: IRI) => dispatch(loadTerms(fetchOptions, vocabularyIri)),
    }
}))(injectIntl(withI18n(ParentTermSelector)));
