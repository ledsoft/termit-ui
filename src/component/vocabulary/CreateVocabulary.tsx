import * as React from 'react';
import {injectIntl} from 'react-intl';
import {Button, ButtonToolbar, Col, Form, FormControlProps, Panel} from 'react-bootstrap';
import withI18n, {HasI18n} from '../hoc/withI18n';
import {connect} from 'react-redux';
import TermItState from '../../model/TermItState';
import Input from '../misc/Input';
import Routes from '../../util/Routes';
import Routing from '../../util/Routing';
import Ajax, {params} from "../../util/Ajax";
import Constants from '../../util/Constants';
import withLoading from "../hoc/withLoading";
import {createVocabulary} from "../../action/ComplexActions";
import {ThunkDispatch} from "redux-thunk";
import {Action} from "redux";

interface CreateVocabularyProps extends HasI18n {
    onCreate: ({}: { name: string, iri: string }) => void
}

interface CreateVocabularyState {
    name: string,
    iri: string,
    generateIri: boolean
}

export class CreateVocabulary extends React.Component<CreateVocabularyProps, CreateVocabularyState> {
    constructor(props: CreateVocabularyProps) {
        super(props);
        this.state = {
            name: '',
            iri: '',
            generateIri: true
        };
    }

    private onNameChange = (e: React.FormEvent<FormControlProps>): void => {
        this.setState({name: (e.currentTarget.value as string)});
        this.generateIri();
    };

    private generateIri(): void {
        if (!this.state.generateIri) {
            return;
        }
        Ajax.get(Constants.API_PREFIX + '/vocabularies/identifier', params({name: this.state.name})).then(iri => this.setState({iri}));
    }

    private onIriChange = (e: React.FormEvent<FormControlProps>): void => {
        this.setState({iri: (e.currentTarget.value as string), generateIri: false});
    };

    private onCreate = (): void => {
        this.props.onCreate({name: this.state.name, iri: this.state.iri});
    };

    private static onCancel(): void {
        Routing.transitionTo(Routes.vocabularies);
    }

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
                            <Input name='create-vocabulary.name' label={i18n('vocabulary.name')} value={this.state.name}
                                   onChange={this.onNameChange}/>
                        </Col>
                    </div>
                    <div className='row'>
                        <Col className='col-md-6'>
                            <Input name='create-vocabulary.iri' label={i18n('vocabulary.iri')} value={this.state.iri}
                                   onChange={this.onIriChange} help={i18n('vocabulary.create.iri.help')}/>
                        </Col>
                    </div>
                    <div className='row'>
                        <Col className='col-md-6'>
                            <ButtonToolbar className='pull-right'>
                                <Button onClick={this.onCreate} bsStyle='success' bsSize='small'
                                        disabled={this.state.name.trim().length === 0}>{i18n('vocabulary.create.submit')}</Button>
                                <Button onClick={CreateVocabulary.onCancel} bsSize='small'>{i18n('cancel')}</Button>
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
}, (dispatch: ThunkDispatch<object, undefined, Action>) => {
    return {
        onCreate: (data: { name: string, iri: string }) => dispatch(createVocabulary(data))
    };
})(injectIntl(withI18n(withLoading(CreateVocabulary))));