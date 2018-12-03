import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {FormGroup, Label} from "reactstrap";
// @ts-ignore
import {IntelligentTreeSelect} from "intelligent-tree-select";
import "intelligent-tree-select/lib/styles.css";
import Term from "../../model/Term";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {ThunkDispatch} from "../../util/Types";
// import VocabularyUtils from "../../util/VocabularyUtils";
import {AssetData} from '../../model/Asset';
import FetchOptionsFunction from "../../model/Functions";
import {fetchVocabularyTerms} from "../../action/AsyncActions";
import Vocabulary from "../../model/Vocabulary";
import VocabularyUtils from "../../util/VocabularyUtils";

interface ResourceRelatedTermsEditProps extends HasI18n {
    vocabulary: Vocabulary;
    terms: Term[];
    onChange: (subTerms: AssetData[]) => void;
    fetchTerms: (fetchOptions: FetchOptionsFunction, normalizedName: string) => Promise<Term[]>;
}

export class ResourceRelatedTermsEdit extends React.Component<ResourceRelatedTermsEditProps> {

    private onChange = (val: Term[]) => {
        this.props.onChange(val.map(v => Object.assign({}, {iri: v.iri})));
    };

    private fetchOptions = ({searchString, optionID, limit, offset}: FetchOptionsFunction) => {
        return this.props.fetchTerms({
            searchString,
            optionID,
            limit,
            offset
        }, VocabularyUtils.getFragment(this.props.vocabulary.iri));
    };

    private valueRenderer = (option: Term) => {
        return option.label;
    };

    private resolveSelectedSubTerms(): string[] {
        return this.props.terms.map(t => t.iri!);
    }

    public render() {
        const selected = this.resolveSelectedSubTerms();
        return <FormGroup>
            <Label className='attribute-label'>{this.props.i18n('resource.metadata.tags')}</Label>
            <IntelligentTreeSelect className='resource-tags-edit'
                                   onChange={this.onChange}
                                   value={selected}
                                   fetchOptions={this.fetchOptions}
                                   valueKey='iri'
                                   labelKey='label'
                                   childrenKey='plainSubTerms'
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
        vocabulary : state.vocabulary
    }
}, ((dispatch: ThunkDispatch) => {
    return {
        fetchTerms: (fetchOptions: FetchOptionsFunction, normalizedName: string) => dispatch(fetchVocabularyTerms(fetchOptions, normalizedName)),
    }
}))(injectIntl(withI18n(ResourceRelatedTermsEdit)));
