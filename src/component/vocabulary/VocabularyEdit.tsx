import * as React from "react";
import {injectIntl} from "react-intl";
import Vocabulary from "../../model/Vocabulary";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Button, ButtonToolbar, Col, Form, Row} from "reactstrap";
import CustomInput from "../misc/CustomInput";
import UnmappedPropertiesEdit from "../genericmetadata/UnmappedPropertiesEdit";
import TextArea from "../misc/TextArea";

interface VocabularyEditProps extends HasI18n {
    vocabulary: Vocabulary;
    save: (vocabulary: Vocabulary) => void;
    cancel: () => void;
}

interface VocabularyEditState {
    label: string;
    comment: string;
    unmappedProperties: Map<string, string[]>;
}

export class VocabularyEdit extends React.Component<VocabularyEditProps, VocabularyEditState> {
    constructor(props: VocabularyEditProps) {
        super(props);
        this.state = {
            label: this.props.vocabulary.label,
            comment: this.props.vocabulary.comment,
            unmappedProperties: this.props.vocabulary.unmappedProperties
        }
    }

    private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const change = {};
        change[e.currentTarget.name.endsWith("label") ? "label" : "comment"] = e.currentTarget.value;
        this.setState(change);
    };

    private onPropertiesChange = (newProperties: Map<string, string[]>) => {
        this.setState({unmappedProperties: newProperties});
    };

    public onSave = () => {
        const newVocabulary = new Vocabulary(Object.assign({}, this.props.vocabulary, {
            label: this.state.label,
            comment: this.state.comment
        }));
        newVocabulary.unmappedProperties = this.state.unmappedProperties;
        this.props.save(newVocabulary);
    };

    public render() {
        const i18n = this.props.i18n;
        return <div className="metadata-panel">
            <Form>
                <Row>
                    <Col xl={6} md={12}>
                        <CustomInput label={i18n("vocabulary.iri")} value={this.props.vocabulary.iri}
                                     disabled={true}/>
                    </Col>
                </Row>
                <Row>
                    <Col xl={6} md={12}>
                        <CustomInput name="vocabulary-edit-label" label={i18n("vocabulary.name")}
                                     value={this.state.label} onChange={this.onChange}/>
                    </Col>
                </Row>
                <Row>
                    <Col xl={6} md={12}>
                        <TextArea name="vocabulary-edit-comment" label={i18n("vocabulary.comment")} rows={3}
                                  value={this.state.comment} onChange={this.onChange}/>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <UnmappedPropertiesEdit properties={this.state.unmappedProperties}
                                                onChange={this.onPropertiesChange}/>
                    </Col>
                </Row>

                <Row>
                    <Col xl={6} md={12}>
                        <ButtonToolbar className="pull-right">
                            <Button onClick={this.onSave} color="success" size="sm"
                                    disabled={this.state.label.trim().length === 0}>{i18n("save")}</Button>
                            <Button onClick={this.props.cancel} color="secondary" size="sm">{i18n("cancel")}</Button>
                        </ButtonToolbar>
                    </Col>
                </Row>
            </Form>
        </div>;
    }
}

export default injectIntl(withI18n(VocabularyEdit));
