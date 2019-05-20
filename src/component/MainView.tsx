import * as React from "react";
import classNames from "classnames";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "./hoc/withI18n";
import withLoading from "./hoc/withLoading";
import {connect} from "react-redux";
import TermItState from "../model/TermItState";
import {
    Collapse,
    Container,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Jumbotron,
    Nav,
    Navbar,
    NavbarBrand,
    NavbarToggler,
    NavItem,
    NavLink,
    UncontrolledDropdown
} from "reactstrap";
import Constants from "../util/Constants";
import User, {EMPTY_USER} from "../model/User";
import "./MainView.scss";
import Routes from "../util/Routes";
import Footer from "./Footer";
import {loadUser} from "../action/AsyncActions";
import {logout} from "../action/ComplexActions";
import {Route, RouteComponentProps, Switch, withRouter} from "react-router";
import Messages from "./message/Messages";
import Statistics from "./statistics/Statistics";
import NavbarSearch from "./search/label/NavbarSearch";
import Search from "./search/label/Search";
import FacetedSearch from "./search/facets/FacetedSearch";
import {ThunkDispatch} from "../util/Types";
import ResourceManagement from "./resource/ResourceManagement";
import SearchTypeTabs from "./search/SearchTypeTabs";
import SearchTerms from "./search/SearchTerms";
import {Breadcrumbs} from "react-breadcrumbs";
import BreadcrumbRoute from "./breadcrumb/BreadcrumbRoute";
import VocabularyManagementRoute from "./vocabulary/VocabularyManagementRoute";
import Dashboard from "./dashboard/Dashboard";
import SearchVocabularies from "./search/SearchVocabularies";

interface MainViewProps extends HasI18n, RouteComponentProps<any> {
    user: User;
    loadUser: () => void;
    logout: () => void;
}

interface MainViewState {
    isMainMenuOpen: boolean;
}

export class MainView extends React.Component<MainViewProps, MainViewState> {

    public static defaultProps: Partial<MainViewProps> = {};

    constructor(props: MainViewProps) {
        super(props);
        this.state = {
            isMainMenuOpen: false
        };
    }

    public componentDidMount() {
        if (this.props.user === EMPTY_USER) {
            this.props.loadUser();
        }
    }

    public toggle = () => {
        this.setState({
            isMainMenuOpen: !this.state.isMainMenuOpen
        });
    };

    private onUserProfileClick = () => {
        alert("Not implemented, yet!");
    };

    private isDashboardRoute() {
        return this.props.location.pathname === Routes.dashboard.path;
    }

    public render() {
        const {i18n, user} = this.props;
        const path = this.props.location.pathname;

        if (user === EMPTY_USER) {
            return this.renderPlaceholder();
        }
        return <div className="main-container">
            <header>
                <Navbar light={Constants.LAYOUT_NAVBAR_BACKGROUND_IS_LIGHT}
                        expand={"lg"}
                        className={classNames("d-flex", {
                            "navbar-light": Constants.LAYOUT_NAVBAR_BACKGROUND_IS_LIGHT,
                            "navbar-dark": !Constants.LAYOUT_NAVBAR_BACKGROUND_IS_LIGHT,
                            "bg-light": Constants.LAYOUT_NAVBAR_BACKGROUND_IS_LIGHT
                        })}
                        style={{background: Constants.LAYOUT_NAVBAR_BACKGROUND}}>
                    <NavbarBrand href={MainView.hashPath(Routes.dashboard.path)}>
                        {Constants.APP_NAME}
                    </NavbarBrand>
                    <Nav navbar={true} className={"flex-grow-1"}>
                        <NavbarSearch/>
                    </Nav>
                    <NavbarToggler onClick={this.toggle}/>

                    <Collapse isOpen={this.state.isMainMenuOpen} navbar={true}>
                        <Nav navbar={true} className={"flex-grow-1 justify-content-end"}>
                            <NavItem active={path.startsWith(Routes.vocabularies.path)}>
                                <NavLink id="main-nav-vocabularies"
                                         href={MainView.hashPath(Routes.vocabularies.path)}>{i18n("main.nav.vocabularies")}</NavLink>
                            </NavItem>
                            <NavItem active={path.startsWith(Routes.resources.path)}>
                                <NavLink id="main-nav-resources"
                                         href={MainView.hashPath(Routes.resources.path)}>{i18n("main.nav.resources")}</NavLink>
                            </NavItem>
                            <NavItem active={path.startsWith(Routes.statistics.path)}>
                                <NavLink id="main-nav-statistics"
                                         href={MainView.hashPath(Routes.statistics.path)}>{i18n("main.nav.statistics")}</NavLink>
                            </NavItem>
                            <NavItem active={path.startsWith(Routes.search.path)}>
                                <NavLink id="main-nav-search"
                                         href={MainView.hashPath(Routes.search.path)}>{i18n("main.nav.search")}</NavLink>
                            </NavItem>
                        </Nav>
                        <Nav navbar={true} className="nav-menu-user">
                            <UncontrolledDropdown id="main-menu-user" nav={true} inNavbar={true}>
                                <DropdownToggle nav={true} caret={true}>
                                    {user.abbreviatedName}
                                </DropdownToggle>
                                <DropdownMenu right={true}>
                                    <DropdownItem disabled={true}
                                                  title={i18n("not-implemented")}
                                                  onClick={this.onUserProfileClick}>{i18n("main.user-profile")}</DropdownItem>
                                    <DropdownItem divider={true}/>
                                    <DropdownItem onClick={this.props.logout}>{i18n("main.logout")}</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Nav>
                    </Collapse>
                </Navbar>
                {!this.isDashboardRoute() && <Breadcrumbs className="breadcrumb-bar"/>}
            </header>
            <SearchTypeTabs/>
            <Messages/>
            <Container id="content-container" fluid={true} className="mt-5 mb-5 flex-grow-1">
                <Switch>
                    <BreadcrumbRoute title={i18n("main.nav.resources")} path={Routes.resources.path}
                                     component={ResourceManagement}/>
                    <BreadcrumbRoute title={i18n("main.nav.vocabularies")} path={Routes.vocabularies.path}
                                     component={VocabularyManagementRoute}/>
                    <BreadcrumbRoute title={i18n("main.nav.statistics")} path={Routes.statistics.path}
                                     component={Statistics}/>
                    <BreadcrumbRoute title={i18n("main.nav.searchTerms")} path={Routes.searchTerms.path}
                                     component={SearchTerms}/>
                    <BreadcrumbRoute title={i18n("main.nav.searchVocabularies")} path={Routes.searchVocabularies.path}
                                     component={SearchVocabularies}/>
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
        return <div className="wrapper center"><Jumbotron><h1>{this.props.i18n("message.welcome")}</h1></Jumbotron>
        </div>;
    }

    /**
     * Have to explicitly add the hash to NavLink paths, otherwise NavLinks act as if using browser history.
     */
    private static hashPath(path: string): string {
        return "#" + path;
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
})(injectIntl(withI18n(withLoading(withRouter(MainView), {containerClass: "app-container"}))));
