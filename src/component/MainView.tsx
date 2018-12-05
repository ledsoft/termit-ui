import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from './hoc/withI18n';
import withLoading from './hoc/withLoading';
import {connect} from 'react-redux';
import TermItState from '../model/TermItState';
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
} from 'reactstrap';
import Constants from '../util/Constants';
import User, {EMPTY_USER} from '../model/User';
import './MainView.scss';
import Routes from '../util/Routes';
import Footer from './Footer';
import {loadUser} from '../action/AsyncActions';
import {logout} from '../action/ComplexActions';
import {Route, RouteComponentProps, Switch, withRouter} from 'react-router';
import VocabularyManagement from './vocabulary/VocabularyManagement';
import VocabularyDetail from "./vocabulary/VocabularyDetail";
import LanguageSelector from "./main/LanguageSelector";
import Messages from "./message/Messages";
import Statistics from "./statistics/Statistics";
import NavbarSearch from "./search/label/NavbarSearch";
import Search from "./search/label/Search";
import FacetedSearch from "./search/facets/FacetedSearch";
import FileDetail from "./file/FileDetail";
import {ThunkDispatch} from "../util/Types";
import ResourceManagement from "./resource/ResourceManagement";

interface MainViewProps extends HasI18n, RouteComponentProps<any> {
    user: User,
    loadUser: () => void,
    logout: () => void,
    backgroundColor: string,
    backgroundIsLight: boolean,
}

interface MainViewState {
    isMainMenuOpen: boolean;
}

export class MainView extends React.Component<MainViewProps, MainViewState> {

    public static defaultProps: Partial<MainViewProps> = {
        backgroundColor: "#777",
        backgroundIsLight: false,
    };

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
        alert('Not implemented, yet!');
    };

    public render() {
        const {i18n, user} = this.props;
        const path = this.props.location.pathname;
        if (user === EMPTY_USER) {
            return this.renderPlaceholder();
        }
        return <>
            <header>
                <Navbar light={this.props.backgroundIsLight} expand={"lg"} className={"navbar-dark d-flex"} style={{background: this.props.backgroundColor}}>
                    <NavbarBrand href={MainView.hashPath(Routes.search.path)}>
                        {Constants.APP_NAME}
                    </NavbarBrand>
                    <Nav navbar={true} className={"flex-grow-1"}>
                        <NavbarSearch/>
                    </Nav>
                    <NavbarToggler onClick={this.toggle}/>

                    <Collapse isOpen={this.state.isMainMenuOpen} navbar={true}>
                        <Nav navbar={true} className={"flex-grow-1 justify-content-end"}>
                            <NavItem active={path.startsWith(Routes.vocabularies.path)}>
                                <NavLink href={MainView.hashPath(Routes.vocabularies.path)}>{i18n('main.nav.vocabularies')}</NavLink>
                            </NavItem>
                            <NavItem active={path === Routes.statistics.path}>
                                <NavLink href={MainView.hashPath(Routes.statistics.path)}>{i18n('main.nav.statistics')}</NavLink>
                            </NavItem>
                            <NavItem active={path === Routes.resources.path}>
                                <NavLink href={MainView.hashPath(Routes.resources.path)}>{i18n('main.nav.resources')}</NavLink>
                            </NavItem>
                            <NavItem active={path === Routes.facetedSearch.path}>
                                <NavLink href={MainView.hashPath(Routes.facetedSearch.path)}>{i18n('main.nav.facetedSearch')}</NavLink>
                            </NavItem>
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
                    </Collapse>
                </Navbar>
            </header>
            <Messages/>
            <Container fluid={true} className="mt-5 mb-5 flex-grow-1">
                <Switch>
                    <Route path={Routes.vocabularyDetail.path} component={VocabularyDetail} exact={true}/>
                    <Route path={Routes.resources.path} component={ResourceManagement}/>
                    <Route path={Routes.createVocabularyTerm.path} component={VocabularyDetail} exact={true}/>
                    <Route path={Routes.vocabularyTermDetail.path} component={VocabularyDetail} exact={true}/>
                    <Route path={Routes.annotateFile.path} component={FileDetail} exact={true}/>
                    <Route path={Routes.vocabularies.path} component={VocabularyManagement}/>
                    <Route path={Routes.statistics.path} component={Statistics}/>
                    <Route path={Routes.search.path} component={Search}/>
                    <Route path={Routes.facetedSearch.path} component={FacetedSearch}/>
                    <Route component={Search}/>
                </Switch>
            </Container>
            <Footer/>
        </>;
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
