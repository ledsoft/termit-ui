import * as React from 'react';
import {injectIntl} from 'react-intl';
import {Panel} from 'react-bootstrap';
import withI18n, {HasI18n} from '../hoc/withI18n';

class Vocabularies extends React.Component<HasI18n> {
    public render() {
        const i18n = this.props.i18n;
        return <Panel bsStyle='info'>
            <Panel.Heading>
                <Panel.Title componentClass='h3'>{i18n('vocabulary.management.vocabularies')}</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
                TODO
            </Panel.Body>
        </Panel>
    }
}

export default injectIntl(withI18n(Vocabularies));