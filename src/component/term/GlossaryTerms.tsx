import * as React from 'react';
import {injectIntl} from 'react-intl';
import {Panel} from 'react-bootstrap';
import withI18n, {HasI18n} from '../hoc/withI18n';
import Vocabulary from "../../model/Vocabulary";

// TODO The vocabulary will be required (or replaced by a tree of terms directly)
interface GlossaryTermsProps extends HasI18n {
    vocabulary?: Vocabulary
}

export class GlossaryTerms extends React.Component<GlossaryTermsProps> {

    public render() {
        const i18n = this.props.i18n;
        return <Panel bsStyle='info'>
            <Panel.Heading>
                <Panel.Title componentClass='h3'>{i18n('glossary.title')}</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
                <div className='row'>
                    <div className='col-xs-12'>
                        Glossary term tree
                    </div>
                </div>
            </Panel.Body>
        </Panel>
    }
}

export default injectIntl(withI18n(GlossaryTerms));