import * as React from 'react';
import {injectIntl} from 'react-intl';
import Vocabulary from "../../model/Vocabulary";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Button, ButtonToolbar, Col, Form, Row} from "reactstrap";
import CustomInput from "../misc/CustomInput";

interface VocabularyEditProps extends HasI18n {
    vocabulary: Vocabulary;
    save: (vocabulary: Vocabulary) => void;
    cancel: () => void;
}

interface VocabularyEditState {
    label: string;
}

export class VocabularyEdit extends React.Component<VocabularyEditProps, VocabularyEditState> {
    constructor(props: VocabularyEditProps) {
        super(props);
        this.state = {
            label: this.props.vocabulary.label
        }
    }

    private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({label: e.currentTarget.value});
    };

    private onSave = () => {
        const newVocabulary = new Vocabulary(Object.assign({}, this.props.vocabulary, {label: this.state.label}));
        this.props.save(newVocabulary);
    };

    public render() {
        const i18n = this.props.i18n;
        return <div className='metadata-panel'>
            <Form>
                <Row>
                    <Col xl={6} md={12}>
                        <CustomInput label={i18n('vocabulary.iri')} value={this.props.vocabulary.iri}
                                     disabled={true}/>
                    </Col>
                </Row>
                <Row>
                    <Col xl={6} md={12}>
                        <CustomInput name='vocabulary-edit-name' label={i18n('vocabulary.name')}
                                     value={this.state.label} onChange={this.onChange}/>
                    </Col>
                </Row>
                <Row>
                    <Col xl={6} md={12}>
                        <ButtonToolbar className='pull-right'>
                            <Button onClick={this.onSave} color='success' size='sm'
                                    disabled={this.state.label.trim().length === 0}>{i18n('save')}</Button>
                            <Button onClick={this.props.cancel} color='secondary' size='sm'>{i18n('cancel')}</Button>
                        </ButtonToolbar>
                    </Col>
                </Row>
            </Form>
        </div>;
    }
}

export default injectIntl(withI18n(VocabularyEdit));
