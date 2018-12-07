import * as React from 'react';
import {injectIntl} from 'react-intl';
import {Button, ButtonToolbar, Card, CardBody, CardHeader, Col, Form, Row} from 'reactstrap';
import withI18n, {HasI18n} from '../hoc/withI18n';
import {connect} from 'react-redux';
import TermItState from '../../model/TermItState';
import CustomInput from '../misc/CustomInput';
import Routes from '../../util/Routes';
import Routing from '../../util/Routing';
import Ajax, {params} from "../../util/Ajax";
import Constants from '../../util/Constants';
import withLoading from "../hoc/withLoading";
import {createVocabulary} from "../../action/AsyncActions";
import Vocabulary from "../../model/Vocabulary";
import {ThunkDispatch} from "../../util/Types";
import TextArea from "../misc/TextArea";

interface CreateVocabularyProps extends HasI18n {
    onCreate: (vocabulary: Vocabulary) => void
}

interface CreateVocabularyState {
    label: string;
    comment: string;
    iri: string;
    generateIri: boolean;
}

export class CreateVocabulary extends React.Component<CreateVocabularyProps, CreateVocabularyState> {
    constructor(props: CreateVocabularyProps) {
        super(props);
        this.state = {
            label: '',
            comment: '',
            iri: '',
            generateIri: true
        };
    }

    private onNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const label = e.currentTarget.value;
        this.setState({label});
        this.generateIri(label);
    };

    private generateIri(label: string): void {
        if (!this.state.generateIri) {
            return;
        }
        Ajax.get(Constants.API_PREFIX + '/vocabularies/identifier', params({name: label})).then(iri => this.setState({iri}));
    }

    private onIriChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({iri: (e.currentTarget.value as string), generateIri: false});
    };

    private onCommentChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({comment: e.currentTarget.value});
    };

    private onCreate = (): void => {
        this.props.onCreate(new Vocabulary({label: this.state.label, iri: this.state.iri}));
    };

    private static onCancel(): void {
        Routing.transitionTo(Routes.vocabularies);
    }

    public render() {
        const i18n = this.props.i18n;
        return <Card>
            <CardHeader color='info'>
                <h5>{i18n('vocabulary.create.title')}</h5>
            </CardHeader>
            <CardBody>
                <Form>
                    <Row>
                        <Col xl={6} md={12}>
                            <CustomInput name='create-vocabulary.name' label={i18n('vocabulary.name')}
                                         value={this.state.label}
                                         onChange={this.onNameChange}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xl={6} md={12}>
                            <CustomInput name='create-vocabulary.iri' label={i18n('vocabulary.iri')}
                                         value={this.state.iri}
                                         onChange={this.onIriChange} help={i18n('vocabulary.create.iri.help')}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xl={6} md={12}>
                            <TextArea name='create-vocabulary.comment' label={i18n('vocabulary.comment')}
                                      type="textarea" rows={3} value={this.state.comment} help={i18n('optional')}
                                      onChange={this.onCommentChange}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xl={6} md={12}>
                            <ButtonToolbar className='pull-right'>
                                <Button onClick={this.onCreate} color='success' size='sm'
                                        disabled={this.state.label.trim().length === 0}>{i18n('vocabulary.create.submit')}</Button>
                                <Button onClick={CreateVocabulary.onCancel} color='secondary'
                                        size='sm'>{i18n('cancel')}</Button>
                            </ButtonToolbar>
                        </Col>
                    </Row>
                </Form>
            </CardBody>
        </Card>;
    }
}

export default connect((state: TermItState) => {
    return {
        loading: state.loading
    };
}, (dispatch: ThunkDispatch) => {
    return {
        onCreate: (vocabulary: Vocabulary) => dispatch(createVocabulary(vocabulary))
    };
})(injectIntl(withI18n(withLoading(CreateVocabulary))));