import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Button, ButtonToolbar, Col, Form, Label, Row} from "reactstrap";
import Term, {TermData} from "../../model/Term";
import "./TermMetadata.scss";
import CustomInput from "../misc/CustomInput";
import TextArea from "../misc/TextArea";
import Vocabulary from "../../model/Vocabulary";
import Ajax, {params} from "../../util/Ajax";
import Constants from '../../util/Constants';
import VocabularyUtils from "../../util/VocabularyUtils";

interface TermMetadataEditProps extends HasI18n {
    vocabulary: Vocabulary,
    term: Term,
    save: (term: Term) => void;
    cancel: () => void;
}

interface TermMetadataEditState extends TermData {
    labelExists: boolean;
}

export class TermMetadataEdit extends React.Component<TermMetadataEditProps, TermMetadataEditState> {
    constructor(props: TermMetadataEditProps) {
        super(props);
        this.state = Object.assign({labelExists: false}, props.term);
    }

    private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const change = {};
        change[e.currentTarget.name] = e.currentTarget.value;
        this.setState(change);
    };

    private onLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.onChange(e);
        this.setState({labelExists: false});
        const label = e.currentTarget.value;
        if (label === this.props.term.label) {
            return;
        }
        const vocabIri = VocabularyUtils.create(this.props.vocabulary.iri);
        const url = Constants.API_PREFIX + '/vocabularies/' + vocabIri.fragment + '/terms/label';
        Ajax.get(url, params({namespace: vocabIri.namespace, label})).then((data) => {
            this.setState({labelExists: data === true});
        });
    };

    private onSave = () => {
        const t = new Term(this.state);
        this.props.save(t);
    };

    private isValid(): boolean {
        return this.state.iri!.length > 0 && this.state.label.length > 0 && !this.state.labelExists;
    }

    public render() {
        const i18n = this.props.i18n;
        return <div className='term-edit-panel'>
            <Form>
                <Row>
                    <Col sm={12} md={6}>
                        <CustomInput name='iri' onChange={this.onChange} value={this.state.iri}
                                     label={i18n('term.metadata.identifier')}/>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12} md={6}>
                        <CustomInput name='label' value={this.state.label} onChange={this.onLabelChange}
                                     label={i18n('term.metadata.label')} invalid={this.state.labelExists}
                                     invalidMessage={this.state.labelExists ? this.props.formatMessage('term.metadata.labelExists.message', {label: this.state.label}) : undefined}/>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12} md={6}>
                        <TextArea name='comment' value={this.state.comment}
                                  onChange={this.onChange} rows={3} label={i18n('term.metadata.comment')}/>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12} md={6}>
                        <Label>{i18n('term.metadata.subTerms')}</Label>
                        &nbsp;
                    </Col>
                </Row>
                <Row>
                    <Col sm={12} md={6}>
                        <Label>{i18n('term.metadata.types')}</Label>
                        &nbsp;
                    </Col>
                </Row>
                <Row>
                    <Col sm={12} md={6}>
                        <Label>{i18n('term.metadata.source')}</Label>
                        &nbsp;
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} md={6}>
                        <ButtonToolbar className='pull-right'>
                            <Button size='sm' color='success' disabled={!this.isValid()}
                                    onClick={this.onSave}>{i18n('save')}</Button>
                            <Button size='sm' color='link' onClick={this.props.cancel}>{i18n('cancel')}</Button>
                        </ButtonToolbar>
                    </Col>
                </Row>
            </Form>
        </div>;
    }
}

export default injectIntl(withI18n(TermMetadataEdit));