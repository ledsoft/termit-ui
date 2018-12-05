import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from '../hoc/withI18n';
import ResourceList from "./ResourceList";
import PanelWithActions from "../misc/PanelWithActions";
import {GoPlus} from "react-icons/go";
import Routes from "../../util/Routes";
import {Link} from "react-router-dom";

class Resources extends React.Component<HasI18n> {

    public render() {
        const i18n = this.props.i18n;
        const actions = [];
        actions.push(<Link key='resource.management.add' className="btn btn-info btn-sm"
                           to={Routes.createVocabulary.link()}><GoPlus/> {i18n('resource.management.add')}</Link>);
        return (<PanelWithActions
                    title={i18n('resource.management.resources')}
                    component={<ResourceList/>}
                    actions={actions}
            />);
    }
}

export default injectIntl(withI18n(Resources));
