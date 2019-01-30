import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {FormGroup, Label} from "reactstrap";
// @ts-ignore
import {IntelligentTreeSelect} from "intelligent-tree-select";
import "intelligent-tree-select/lib/styles.css";
import Term from "../../model/Term";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import Vocabulary from "../../model/Vocabulary";
import {ThunkDispatch} from "../../util/Types";
import VocabularyUtils, {IRI} from "../../util/VocabularyUtils";
import {AssetData} from "../../model/Asset";
import FetchOptionsFunction from "../../model/Functions";
import {loadTerms} from "../../action/AsyncActions";

interface TermSubTermsEditProps extends HasI18n {
    vocabulary: Vocabulary;
    subTerms: AssetData[];
    termIri: string;
    vocabularyTerms: Term[];
    onChange: (subTerms: AssetData[]) => void;
    loadTerms: (fetchOptions: FetchOptionsFunction, vocabularyIri: IRI) => Promise<Term[]>;
}

export class TermSubTermsEdit extends React.Component<TermSubTermsEditProps> {

    private onChange = (val: Term[]) => {
        const newSubTerms: AssetData[] = val.map(v => Object.assign({}, {iri: v.iri})).filter(v => this.props.termIri !== v.iri);
        this.props.onChange(newSubTerms);
    };

    private fetchOptions = ({searchString, optionID, limit, offset}: FetchOptionsFunction) => {
        return this.props.loadTerms({
            searchString,
            optionID,
            limit,
            offset
        }, VocabularyUtils.create(this.props.vocabulary.iri));
    };

    private valueRenderer = (option: Term) => {
        return option.label;
    };

    private resolveSelectedSubTerms(): string[] {
        return this.props.subTerms.map(t => t.iri!);
    }

    public render() {
        const selected = this.resolveSelectedSubTerms();
        return <FormGroup>
            <Label className="attribute-label">{this.props.i18n("term.metadata.subTerms")}</Label>
            <IntelligentTreeSelect className="term-edit"
                                   onChange={this.onChange}
                                   value={selected}
                                   fetchOptions={this.fetchOptions}
                                   fetchLimit={100000}
                                   valueKey="iri"
                                   labelKey="label"
                                   childrenKey="plainSubTerms"
                                   simpleTreeData={true}
                                   showSettings={false}
                                   maxHeight={150}
                                   multi={true}
                                   displayInfoOnHover={true}
                                   expanded={true}
                                   renderAsTree={true}
                                   valueRenderer={this.valueRenderer}/>
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
}))(injectIntl(withI18n(TermSubTermsEdit)));
