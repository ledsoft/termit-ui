import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from './hoc/withI18n';
import withLoading from './hoc/withLoading';
import {connect} from 'react-redux';
import TermItState from '../model/TermItState';
import {
    Container,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Jumbotron,
    Nav,
    Navbar,
    NavbarBrand,
    NavItem,
    NavLink,
    UncontrolledDropdown
} from 'reactstrap';
import Constants from '../util/Constants';
import User, {EMPTY_USER} from '../model/User';
import './MainView.scss';
import Routes from '../util/Routes';
import Footer from './Footer';
import {loadUser} from '../action/AsyncActions';
import {logout} from '../action/ComplexActions';
import {Route, RouteComponentProps, Switch, withRouter} from 'react-router';
import Dashboard from './dashboard/Dashboard';
import LanguageSelector from "./main/LanguageSelector";
import Messages from "./message/Messages";
import Statistics from "./statistics/Statistics";
import NavbarSearch from "./search/label/NavbarSearch";
import Search from "./search/label/Search";
import FacetedSearch from "./search/facets/FacetedSearch";
import FileDetail from "./file/FileDetail";
import {ThunkDispatch} from "../util/Types";
import ResourceManagement from "./resource/ResourceManagement";
import {Breadcrumbs} from "react-breadcrumbs";
import BreadcrumbRoute from "./breadcrumb/BreadcrumbRoute";
import VocabularyManagementRoute from "./vocabulary/VocabularyManagementRoute";

interface MainViewProps extends HasI18n, RouteComponentProps<any> {
    user: User,
    loadUser: () => void,
    logout: () => void
}

export class MainView extends React.Component<MainViewProps> {

    constructor(props: MainViewProps) {
        super(props);
    }

    public componentDidMount() {
        if (this.props.user === EMPTY_USER) {
            this.props.loadUser();
        }
    }

    private onUserProfileClick = () => {
        alert('Not implemented, yet!');
    };

    public render() {
        const {i18n, user} = this.props;
        const path = this.props.location.pathname;
        if (user === EMPTY_USER) {
            return this.renderPlaceholder();
        }
        return <div className='wrapper'>
            <header>
                <Navbar color="light" light={true} expand={"md"} className={"d-flex"}>

                    <NavbarBrand>{Constants.APP_NAME}</NavbarBrand>

                    <Nav navbar={true} className={"flex-grow-1"}>
                        <NavItem active={path === Routes.dashboard.path}>
                            <NavLink
                                href={MainView.hashPath(Routes.dashboard.path)}>{i18n('main.nav.dashboard')}</NavLink>
                        </NavItem>
                        <NavItem active={path.startsWith(Routes.vocabularies.path)}>
                            <NavLink
                                href={MainView.hashPath(Routes.vocabularies.path)}>{i18n('main.nav.vocabularies')}</NavLink>
                        </NavItem>
                        <NavItem active={path.startsWith(Routes.resources.path)}>
                            <NavLink
                                href={MainView.hashPath(Routes.resources.path)}>{i18n('main.nav.resources')}</NavLink>
                        </NavItem>
                        <NavItem active={path === Routes.statistics.path}>
                            <NavLink
                                href={MainView.hashPath(Routes.statistics.path)}>{i18n('main.nav.statistics')}</NavLink>
                        </NavItem>
                        <NavItem active={path === Routes.facetedSearch.path}>
                            <NavLink
                                href={MainView.hashPath(Routes.facetedSearch.path)}>{i18n('main.nav.facetedSearch')}</NavLink>
                        </NavItem>
                    </Nav>
                    <Nav navbar={true}>
                        <NavbarSearch/>
                    </Nav>
                    <Nav navbar={true}>
                        <LanguageSelector/>
                    </Nav>
                    <Nav navbar={true}>
                        <UncontrolledDropdown id='logout' nav={true} inNavbar={true}>
                            <DropdownToggle nav={true} caret={true}>
                                {user.abbreviatedName}
                            </DropdownToggle>
                            <DropdownMenu right={true}>
                                <DropdownItem disabled={true}
                                              title={i18n('not-implemented')}
                                              onClick={this.onUserProfileClick}>{i18n('main.user-profile')}</DropdownItem>
                                <DropdownItem divider={true}/>
                                <DropdownItem onClick={this.props.logout}>{i18n('main.logout')}</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </Nav>
                </Navbar>
                <Breadcrumbs className="breadcrumb-bar"/>
            </header>
            <Messages/>
            <Container fluid={true} className="mt-5 mb-5">
                <Switch>

                    <BreadcrumbRoute title={i18n("main.nav.resources")} path={Routes.resources.path}
                                     component={ResourceManagement}/>
                    <BreadcrumbRoute title={i18n("main.nav.vocabularies")} path={Routes.annotateFile.path}
                                     component={FileDetail} exact={true}/>
                    <BreadcrumbRoute title={i18n("main.nav.vocabularies")} path={Routes.vocabularies.path}
                                     component={VocabularyManagementRoute}/>
                    <BreadcrumbRoute title={i18n("main.nav.statistics")} path={Routes.statistics.path}
                                     component={Statistics}/>
                    <BreadcrumbRoute title={i18n("main.nav.search")} path={Routes.search.path} component={Search}/>
                    <BreadcrumbRoute title={i18n("main.nav.facetedSearch")} path={Routes.facetedSearch.path}
                                     component={FacetedSearch}/>
                    <Route component={Dashboard}/>
                </Switch>
            </Container>
            <Footer/>
        </div>;
    }

    private renderPlaceholder() {
        return <div className='wrapper center'><Jumbotron><h1>{this.props.i18n('message.welcome')}</h1></Jumbotron>
        </div>;
    }

    /**
     * Have to explicitly add the hash to NavLink paths, otherwise NavLinks act as if using browser history.
     */
    private static hashPath(path: string): string {
        return '#' + path;
    }
}

export default connect((state: TermItState) => {
    return {
        loading: state.loading,
        user: state.user,
        intl: state.intl    // Pass intl in props to force UI re-render on language switch
    };
}, (dispatch: ThunkDispatch) => {
    return {
        loadUser: () => dispatch(loadUser()),
        logout: () => dispatch(logout())
    };
})(injectIntl(withI18n(withLoading(withRouter(MainView), {containerClass: 'app-container'}))));