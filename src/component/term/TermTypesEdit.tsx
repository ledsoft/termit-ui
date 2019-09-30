import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
// @ts-ignore
import {IntelligentTreeSelect} from "intelligent-tree-select";
import "intelligent-tree-select/lib/styles.css";
import Term from "../../model/Term";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {FormGroup, Label} from "reactstrap";
import VocabularyUtils from "../../util/VocabularyUtils";
import Utils from "../../util/Utils";

interface TermTypesEditProps extends HasI18n {
    termTypes: string[];
    availableTypes: { [key: string]: Term };
    onChange: (types: string[]) => void;
}

export class TermTypesEdit extends React.Component<TermTypesEditProps> {

    public onChange = (val: Term | null) => {
        this.props.onChange(val ? [val.iri, VocabularyUtils.TERM] : [VocabularyUtils.TERM]);
    };

    private resolveSelectedTypes(types: Term[]): string | undefined {
        const matching = types.filter(t => t.iri !== VocabularyUtils.TERM && this.props.termTypes.indexOf(t.iri) !== -1);
        return matching.length > 0 ? matching[0].iri : undefined;
    }

    private getTypesForSelector() {
        if (!this.props.availableTypes) {
            return [];
        }
        const typesMap = {};
        Object.keys(this.props.availableTypes).forEach(t => typesMap[t] = Object.assign({}, this.props.availableTypes[t]));
        const types = Object.keys(typesMap).map(k => typesMap[k]);
        types.forEach(t => {
            if (t.subTerms) {
                // The tree-select needs parent for proper function
                // @ts-ignore
                t.subTerms.forEach(st => typesMap[st].parent = t.iri);
            }
        });
        return types;
    }

    public render() {
        const types = this.getTypesForSelector();
        const selected = this.resolveSelectedTypes(types);
        return <FormGroup>
            <Label className="attribute-label">{this.props.i18n("term.metadata.types")}</Label>
            <IntelligentTreeSelect onChange={this.onChange}
                                   value={selected}
                                   options={types}
                                   valueKey="iri"
                                   labelKey="label"
                                   childrenKey="subTerms"
                                   showSettings={false}
                                   maxHeight={150}
                                   multi={false}
                                   displayInfoOnHover={true}
                                   expanded={true}
                                   renderAsTree={true}
                                   valueRenderer={Utils.labelValueRenderer}/>
        </FormGroup>;
    }
}

export default connect((state: TermItState) => {
    return {availableTypes: state.types};
})(injectIntl(withI18n(TermTypesEdit)));
