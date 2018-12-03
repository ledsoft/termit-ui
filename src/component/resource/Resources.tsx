import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from '../hoc/withI18n';
import ResourceList from "./ResourceList";
import PanelWithActions from "../misc/PanelWithActions";

class Resources extends React.Component<HasI18n> {

    public render() {
        const i18n = this.props.i18n;
        return (<PanelWithActions
                    title={i18n('resource.management.resources')}
                    component={<ResourceList/>}
                    actions={[]}
            />);
    }
}

export default injectIntl(withI18n(Resources));