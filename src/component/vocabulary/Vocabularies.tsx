import * as React from 'react';
import {injectIntl} from 'react-intl';
import {Button, Panel} from 'react-bootstrap';
import withI18n, {HasI18n} from '../hoc/withI18n';
import Routes from "../../util/Routes";
import Routing from '../../util/Routing';

class Vocabularies extends React.Component<HasI18n> {

    private static onCreateVocabularyClick() {
        Routing.transitionTo(Routes.createVocabulary)
    }

    public render() {
        const i18n = this.props.i18n;
        return <Panel bsStyle='info'>
            <Panel.Heading>
                <Panel.Title componentClass='h3'>{i18n('vocabulary.management.vocabularies')}</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
                <div className='row'>
                    <div className='col-xs-12'>
                        <Button bsStyle='primary' title={i18n('vocabulary.vocabularies.create.tooltip')} bsSize='small'
                                onClick={Vocabularies.onCreateVocabularyClick}>{i18n('vocabulary.vocabularies.create')}</Button>
                    </div>
                </div>
                TODO
            </Panel.Body>
        </Panel>
    }
}

export default injectIntl(withI18n(Vocabularies));