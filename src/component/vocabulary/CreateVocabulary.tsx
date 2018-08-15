import * as React from 'react';
import {injectIntl} from 'react-intl';
import {Button, ButtonToolbar, Col, Form, FormControlProps, Panel} from 'react-bootstrap';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {connect} from 'react-redux';
import TermItState from "../../model/TermItState";
import Input from '../misc/Input';

interface CreateVocabularyProps extends HasI18n {
    loading: boolean
}

interface CreateVocabularyState {
    name: string,
    iri: string
}

export class CreateVocabulary extends React.Component<CreateVocabularyProps, CreateVocabularyState> {
    constructor(props: CreateVocabularyProps) {
        super(props);
        this.state = {
            name: "",
            iri: ""
        };
    }

    private onNameChange = (e: React.FormEvent<FormControlProps>): void => {
        this.setState({name: (e.currentTarget.value as string)});
    };

    private onIriChange = (e: React.FormEvent<FormControlProps>): void => {
        // TODO
    };

    private onCreate = (): void => {
        // TODO
    };

    private onCancel = (): void => {
        // TODO
    };

    public render() {
        const i18n = this.props.i18n;
        return <Panel bsStyle='info'>
            <Panel.Heading>
                <Panel.Title componentClass='h3'>{i18n('vocabulary.create.title')}</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
                <Form>
                    <div className='row'>
                        <Col className='col-md-6'>
                            <Input label={i18n('vocabulary.name')} value={this.state.name}
                                   onChange={this.onNameChange}/>
                        </Col>
                    </div>
                    <div className='row'>
                        <Col className='col-md-6'>
                            <Input label={i18n('vocabulary.iri')} value={this.state.iri} onChange={this.onIriChange}/>
                        </Col>
                    </div>
                    <div className='row'>
                        <Col className='col-md-6'>
                            <ButtonToolbar className='pull-right'>
                                <Button onClick={this.onCreate} bsStyle='success'
                                        bsSize='small'>{i18n('vocabulary.create.submit')}</Button>
                                <Button onClick={this.onCancel} bsSize='small'>{i18n('cancel')}</Button>
                            </ButtonToolbar>
                        </Col>
                    </div>
                </Form>
            </Panel.Body>
        </Panel>;
    }
}

export default connect((state: TermItState) => {
    return {
        loading: state.loading
    };
})(injectIntl(withI18n(CreateVocabulary)));