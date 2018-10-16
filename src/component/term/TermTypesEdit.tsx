import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../hoc/withI18n";
// @ts-ignore
import {IntelligentTreeSelect} from "intelligent-tree-select";
import "intelligent-tree-select/lib/styles.css";
import Term from "../../model/Term";
import {connect} from 'react-redux';
import TermItState from "../../model/TermItState";
import {FormGroup, Label} from "reactstrap";

interface TermTypesEditProps extends HasI18n {
    termTypes: string[];
    availableTypes: { [key: string]: Term };
    onChange: (types: string[]) => void;
}

export class TermTypesEdit extends React.Component<TermTypesEditProps> {
    constructor(props: TermTypesEditProps) {
        super(props);
    }

    private onChange = (val: Term[]) => {
        const newTypes = val.map(v => v.iri);
        this.props.onChange(newTypes);
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

    private resolveSelectedTypes(types: Term[]): Term[] {
        return types.filter(t => this.props.termTypes.indexOf(t.iri) !== -1);
    }

    public render() {
        const types = this.props.availableTypes ?
            Object.keys(this.props.availableTypes).map(k => this.props.availableTypes[k]) : [];
        const selected = this.resolveSelectedTypes(types);
        return <FormGroup>
            <Label size='sm'>{this.props.i18n('term.metadata.types')}</Label>
            <IntelligentTreeSelect className='term-edit-types'
                                   name='term-edit-types'
                                   selectValue={this.onChange}
                                   onChange={this.onChange}
                                   value={selected}
                                   options={types}
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
                                   valueRenderer={this.valueRenderer}/>
        </FormGroup>;
    }
}

export default connect((state: TermItState) => {
    return {availableTypes: state.types};
})(injectIntl(withI18n(TermTypesEdit)));
