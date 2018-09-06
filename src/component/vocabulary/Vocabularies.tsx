import * as React from 'react';
import {injectIntl} from 'react-intl';
import {Button} from 'reactstrap';
import withI18n, {HasI18n} from '../hoc/withI18n';
import Routes from "../../util/Routes";
import Routing from '../../util/Routing';
import VocabularyList from "./VocabularyList";
import PanelWithActions from "../misc/PanelWithActions";

class Vocabularies extends React.Component<HasI18n> {

    private static onCreateVocabularyClick() {
        Routing.transitionTo(Routes.createVocabulary)
    }

    public render() {
        const i18n = this.props.i18n;
        const actions = [];
        actions.push(<Button key='vocabulary.vocabularies.create'
                             color='primary'
                             title={i18n('vocabulary.vocabularies.create.tooltip')}
                             size='sm'
                             onClick={Vocabularies.onCreateVocabularyClick}>{i18n('vocabulary.vocabularies.create')}</Button>);
        return (<PanelWithActions
                    title={i18n('vocabulary.management.vocabularies')}
                    component={<VocabularyList/>}
                    actions={actions}
            />);
    }
}

export default injectIntl(withI18n(Vocabularies));