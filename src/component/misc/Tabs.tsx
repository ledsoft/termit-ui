import * as React from 'react';
import {Nav, NavItem, NavLink, TabContent, TabPane} from 'reactstrap';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {injectIntl} from "react-intl";

interface TabsProps extends HasI18n {
    /**
     * ID of the active tab. The ID should be also a localization key of its title.
     */
    activeTabLabelKey: string,
    /**
     * Map of IDs to the actual components
     */
    tabs: { [activeTabLabelKey: string]: React.SFC },
    /**
     * Tab change function.
     */
    changeTab: (selectedTabLabelKey: string) => void
}

class Tabs extends React.Component<TabsProps> {

    constructor(props: TabsProps) {
        super(props);
    }

    public render() {
        const navlinks: any[] = [];
        const tabs: any[] = [];

        Object.keys(this.props.tabs).forEach((id) => {
            const changeTab = () => this.props.changeTab(id);
            navlinks.push(
                <NavItem key={id}>
                    <NavLink
                        className={(id === this.props.activeTabLabelKey) ? 'active' : ''}
                        onClick={changeTab}>
                    {this.props.formatMessage(id,{})}
                    </NavLink>
                </NavItem>
            );

            const tabComponent = this.props.tabs[id]({});
            tabs.push(
                <TabPane tabId={id} key={id}>
                    {tabComponent}
                </TabPane>
            );
        });

        return <div><Nav tabs={true}>
            {navlinks}
        </Nav>
            <TabContent activeTab={this.props.activeTabLabelKey}>
                {tabs}
            </TabContent>
        </div>
    }
}

export default injectIntl(withI18n(Tabs));