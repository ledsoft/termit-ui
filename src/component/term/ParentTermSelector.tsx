import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import Term from "../../model/Term";
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
import {AssetData} from "../../model/Asset";

interface ParentTermSelectorProps extends HasI18n {
    termIri: string;
    parent?: AssetData;
    vocabularyIri: string;
    onChange: (parent?: AssetData) => void;
    vocabularyTerms: Term[];
    loadTerms: (fetchOptions: FetchOptionsFunction, vocabularyIri: IRI) => Promise<Term[]>;
}

export class ParentTermSelector extends React.Component<ParentTermSelectorProps> {

    public onChange = (val: Term | null) => {
        if (!val) {
            this.props.onChange(undefined);
        } else if (val.iri !== this.props.termIri) {
            this.props.onChange({iri: val.iri});
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
        return <FormGroup>
            <Label className="attribute-label">{this.props.i18n("term.metadata.parent")}</Label>
            <IntelligentTreeSelect className="term-edit"
                                   onChange={this.onChange}
                                   value={this.props.parent ? this.props.parent.iri : undefined}
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