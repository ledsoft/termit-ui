import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import Term, {TermData} from "../../model/Term";
import FetchOptionsFunction from "../../model/Functions";
import VocabularyUtils, {IRI} from "../../util/VocabularyUtils";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {ThunkDispatch} from "../../util/Types";
import {loadTerms} from "../../action/AsyncActions";
import {FormGroup, Label} from "reactstrap";
import Utils from "../../util/Utils";
// @ts-ignore
import {IntelligentTreeSelect} from "intelligent-tree-select";

interface ParentTermSelectorProps extends HasI18n {
    termIri: string;
    parentTerms?: TermData[];
    vocabularyIri: string;
    onChange: (newParents: Term[]) => void;
    vocabularyTerms: Term[];
    loadTerms: (fetchOptions: FetchOptionsFunction, vocabularyIri: IRI) => Promise<Term[]>;
}

export class ParentTermSelector extends React.Component<ParentTermSelectorProps> {

    public onChange = (val: Term[] | Term | null) => {
        if (!val) {
            this.props.onChange([]);
        } else {
            this.props.onChange(Utils.sanitizeArray(val).filter(v => v.iri !== this.props.termIri));
        }
    };

    private fetchOptions = ({searchString, optionID, limit, offset}: FetchOptionsFunction) => {
        return this.props.loadTerms({
            searchString,
            optionID,
            limit,
            offset
        }, VocabularyUtils.create(this.props.vocabularyIri));
    };

    public render() {
        // Assuming there should be at most one parent within the same vocabulary
        const selected = Utils.sanitizeArray(this.props.parentTerms).find(t => t.vocabulary !== undefined && t.vocabulary!.iri === this.props.vocabularyIri);
        return <FormGroup>
            <Label className="attribute-label">{this.props.i18n("term.metadata.parent")}</Label>
            <IntelligentTreeSelect onChange={this.onChange}
                                   value={selected ? selected.iri : undefined}
                                   fetchOptions={this.fetchOptions}
                                   fetchLimit={100000}
                                   valueKey="iri"
                                   labelKey="label"
                                   childrenKey="plainSubTerms"
                                   simpleTreeData={true}
                                   showSettings={false}
                                   maxHeight={150}
                                   multi={false}
                                   renderAsTree={true}
                                   valueRenderer={Utils.labelValueRenderer}/>
        </FormGroup>;
    }
}

export default connect((state: TermItState) => {
    return {
        vocabularyTerms: state.defaultTerms
    };
}, ((dispatch: ThunkDispatch) => {
    return {
        loadTerms: (fetchOptions: FetchOptionsFunction, vocabularyIri: IRI) => dispatch(loadTerms(fetchOptions, vocabularyIri)),
    }
}))(injectIntl(withI18n(ParentTermSelector)));