import * as React from 'react';
import {injectIntl} from 'react-intl';
import {Button, Card, CardBody, CardHeader, Col, Row} from 'reactstrap';
import withI18n, {HasI18n} from '../hoc/withI18n';
import Routes from "../../util/Routes";
import Routing from '../../util/Routing';

class Vocabularies extends React.Component<HasI18n> {

    private static onCreateVocabularyClick() {
        Routing.transitionTo(Routes.createVocabulary)
    }

    public render() {
        const i18n = this.props.i18n;
        return <Card>
            <CardHeader color='info'>
                <h5>{i18n('vocabulary.management.vocabularies')}</h5>
            </CardHeader>
            <CardBody>
                <Row>
                    <Col md={12}>
                        <Button color='primary' title={i18n('vocabulary.vocabularies.create.tooltip')} size='sm'
                                onClick={Vocabularies.onCreateVocabularyClick}>{i18n('vocabulary.vocabularies.create')}</Button>
                    </Col>
                </Row>
                TODO
            </CardBody>
        </Card>
    }
}

export default injectIntl(withI18n(Vocabularies));