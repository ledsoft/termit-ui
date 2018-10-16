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
import Vocabulary from "../../model/Vocabulary";
import {ThunkDispatch} from "../../util/Types";
import {loadDefaultTerms} from "../../action/AsyncActions";
import VocabularyUtils from "../../util/VocabularyUtils";
import Utils from '../../util/Utils';

interface TermSubTermsEditProps extends HasI18n {
    vocabulary: Vocabulary;
    subTerms: string[];
    termIri: string;
    vocabularyTerms: Term[];
    onChange: (subTerms: string[]) => void;
    loadVocabularyTerms: (vocabulary: Vocabulary) => void;
}

export class TermSubTermsEdit extends React.Component<TermSubTermsEditProps> {

    public componentDidMount() {
        this.props.loadVocabularyTerms(this.props.vocabulary);
    }

    private onChange = (val: Term[]) => {
        const newSubTerms = val.map(v => v.iri);
        this.props.onChange(newSubTerms);
    };

    private filterParentOptions = (options: Term[], filter: string) => {
        return options.filter(option => {
            const label = option.label;
            return label.toLowerCase().indexOf(filter.toLowerCase()) !== -1
        });
    };

    private valueRenderer = (option: Term) => {
        return option.label;
    };

    private resolveSelectedSubTerms(subTerms: Term[]): Term[] {
        return subTerms.filter(t => this.props.subTerms.indexOf(t.iri) !== -1);
    }

    public render() {
        const options = Utils.sanitizeArray(this.props.vocabularyTerms).filter(t => t.iri !== this.props.termIri);
        const selected = this.resolveSelectedSubTerms(options);
        return <FormGroup>
            <Label size='sm'>{this.props.i18n('term.metadata.subTerms')}</Label>
            {options.length > 0 && <IntelligentTreeSelect className='term-edit'
                                                          name='term-edit-subterms'
                                                          onChange={this.onChange}
                                                          value={selected}
                                                          options={options}
                                                          valueKey='iri'
                                                          labelKey='label'
                                                          childrenKey='subTerms'
                                                          filterOptions={this.filterParentOptions}
                                                          showSettings={false}
                                                          maxHeight={150}
                                                          multi={true}
                                                          displayInfoOnHover={true}
                                                          expanded={true}
                                                          renderAsTree={true}
                                                          valueRenderer={this.valueRenderer}/>}
        </FormGroup>;
    }
}

export default connect((state: TermItState) => {
    return {
        vocabularyTerms: state.defaultTerms
    };
}, ((dispatch: ThunkDispatch) => {
    return {
        loadVocabularyTerms: (vocabulary: Vocabulary) => dispatch(loadDefaultTerms(VocabularyUtils.getFragment(vocabulary.iri)))
    }
}))(injectIntl(withI18n(TermSubTermsEdit)));
