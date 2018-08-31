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
    Nav,
    Navbar,
    NavbarBrand,
    NavItem,
    NavLink,
    UncontrolledDropdown
} from 'reactstrap';
import Constants from '../util/Constants';
import User from '../model/User';
import './MainView.scss';
import Routes from '../util/Routes';
import Footer from './Footer';
import {ThunkDispatch} from 'redux-thunk';
import {Action} from 'redux';
import {loadUser, logout} from '../action/ComplexActions';
import {Route, Switch} from 'react-router';
import Dashboard from './dashboard/Dashboard';
import VocabularyManagement from './vocabulary/VocabularyManagement';
import VocabularyDetail from "./vocabulary/VocabularyDetail";
import LanguageSelector from "./main/LanguageSelector";

interface MainViewProps extends HasI18n {
    user: User,
    loadUser: () => void,
    logout: () => void
}

interface State {
    dropDownOpen: boolean;
}

class MainView extends React.Component<MainViewProps, State> {

    constructor(props: MainViewProps) {
        super(props);

        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.state = {
            dropDownOpen: false,
        };
    }

    public componentDidMount() {
        this.props.loadUser();
    }

    private toggleDropdown() {
        this.setState({
            dropDownOpen: !this.state.dropDownOpen
        });
    }

    private onUserProfileClick = () => {
        alert('Not implemented, yet!');
    };

    public render() {
        const {i18n, user} = this.props;
        return <div className='wrapper'>
            <header>
                <Navbar color="light" light={true} expand={"md"} className={"d-flex"}>

                    <NavbarBrand>{Constants.APP_NAME}</NavbarBrand>

                    <Nav navbar={true} className={"flex-grow-1"}>
                        <NavItem>
                            <NavLink href={Routes.dashboard.path}>{i18n('main.nav.dashboard')}</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href={Routes.vocabularies.path}>{i18n('main.nav.vocabularies')}</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href={Routes.statistics.path}>{i18n('main.nav.statistics')}</NavLink>
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
                                <DropdownItem
                                    onClick={this.onUserProfileClick}>{i18n('main.user-profile')}</DropdownItem>
                                <DropdownItem divider={true}/>
                                <DropdownItem onClick={this.props.logout}>{i18n('main.logout')}</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </Nav>
                </Navbar>
            </header>
            <Container fluid={true} className={"mt-5"}>
                <Switch>
                    <Route path={Routes.vocabularyDetail.path} component={VocabularyDetail}/>
                    <Route path={Routes.vocabularies.path} component={VocabularyManagement}/>
                    <Route component={Dashboard}/>
                </Switch>
            </Container>
            <Footer/>
        </div>;
    }
}

export default connect((state: TermItState) => {
    return {
        loading: state.loading,
        user: state.user
    };
}, (dispatch: ThunkDispatch<object, undefined, Action>) => {
    return {
        loadUser: () => dispatch(loadUser()),
        logout: () => dispatch(logout())
    };
})(injectIntl(withI18n(withLoading(MainView, {containerClass: 'app-container'}))));