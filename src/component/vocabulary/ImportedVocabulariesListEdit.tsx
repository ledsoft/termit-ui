import * as React from "react";
import {injectIntl} from "react-intl";
// @ts-ignore
import {IntelligentTreeSelect} from "intelligent-tree-select";
import withI18n, {HasI18n} from "../hoc/withI18n";
import Vocabulary from "../../model/Vocabulary";
import {AssetData} from "../../model/Asset";
import {Col, FormGroup, Label, Row} from "reactstrap";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import Utils from "../../util/Utils";

interface ImportedVocabulariesListEditProps extends HasI18n {
    vocabularies: { [key: string]: Vocabulary };
    importedVocabularies?: AssetData[];
    onChange: (change: object) => void;
}

export class ImportedVocabulariesListEdit extends React.Component<ImportedVocabulariesListEditProps> {

    public onChange = (selected: Vocabulary[]) => {
        const selectedVocabs = selected.map(v => ({iri: v.iri}));
        this.props.onChange({importedVocabularies: selectedVocabs});
    };

    public render() {
        const i18n = this.props.i18n;
        const options = Object.keys(this.props.vocabularies).map((v) => this.props.vocabularies[v]);
        const selected = Utils.sanitizeArray(this.props.importedVocabularies).map(v => v.iri!);
        return <Row>
            <Col xl={6} md={12}>
                <FormGroup>
                    <Label className="attribute-label">{i18n("vocabulary.detail.imports")}</Label>
                    <IntelligentTreeSelect className="p-0"
                                           onChange={this.onChange}
                                           value={selected}
                                           options={options}
                                           valueKey="iri"
                                           labelKey="label"
                                           childrenKey="children"
                                           isMenuOpen={false}
                                           multi={true}
                                           showSettings={false}
                                           displayInfoOnHover={false}
                                           renderAsTree={false}
                                           simpleTreeData={true}
                                           valueRenderer={Utils.labelValueRenderer}
                    />
                </FormGroup>
            </Col>
        </Row>;
    }
}

export default connect((state: TermItState) => {
    return {vocabularies: state.vocabularies};
})(injectIntl(withI18n(ImportedVocabulariesListEdit)));