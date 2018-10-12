import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Button, ButtonToolbar, Col, Form, Label, Row} from "reactstrap";
import Term, {TermData} from "../../model/Term";
import "./TermMetadata.scss";
import CustomInput from "../misc/CustomInput";
import TextArea from "../misc/TextArea";

interface TermMetadataEditProps extends HasI18n {
    term: Term,
    save: (term: Term) => void;
    cancel: () => void;
}

class TermMetadataEdit extends React.Component<TermMetadataEditProps, TermData> {
    constructor(props: TermMetadataEditProps) {
        super(props);
        this.state = Object.assign({}, props.term);
    }

    private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const change = {};
        change[e.currentTarget.name] = e.currentTarget.value;
        this.setState(change);
    };

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
                        <CustomInput name='label' value={this.state.label} onChange={this.onChange}
                                     label={i18n('term.metadata.label')}/>
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
                            <Button size='sm' color='success'>{i18n('save')}</Button>
                            <Button size='sm' color='link' onClick={this.props.cancel}>{i18n('cancel')}</Button>
                        </ButtonToolbar>
                    </Col>
                </Row>
            </Form>
        </div>;
    }
}

export default injectIntl(withI18n(TermMetadataEdit));