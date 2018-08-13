import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "./hoc/withI18n";
import withLoading from "./hoc/withLoading";
import {connect} from "react-redux";
import TermItState from "../model/TermItState";
import {MenuItem, Nav, Navbar, NavDropdown, NavItem} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import Constants from '../util/Constants';
import User from "../model/User";
import './MainView.scss';
import Routes from '../util/Routes';
import Footer from './Footer';
import LanguageSelector from "./main/LanguageSelector";
import {ThunkDispatch} from "redux-thunk";
import {Action} from "redux";
import {loadUser, logout} from "../action/ComplexActions";
import {Route, Switch} from "react-router";
import Dashboard from "./dashboard/Dashboard";

interface MainViewProps extends HasI18n {
    user: User,
    loadUser: () => void,
    logout: () => void
}

class MainView extends React.Component<MainViewProps> {

    constructor(props: MainViewProps) {
        super(props);
    }

    public componentDidMount() {
        this.props.loadUser();
    }

    private onUserProfileClick = () => {
        alert('Not implemented, yet!');
    };

    public render() {
        const {i18n, user} = this.props;
        return <div className='wrapper'>
            <header>
                <Navbar fluid={true}>
                    <Navbar.Header>
                        <Navbar.Brand>{Constants.APP_NAME}</Navbar.Brand>
                    </Navbar.Header>
                    <Nav>
                        <LinkContainer
                            to={Routes.dashboard.name}><NavItem>{i18n('main.dashboard.nav')}</NavItem></LinkContainer>
                        <LinkContainer
                            to={Routes.statistics.name}><NavItem>{i18n('main.statistics.nav')}</NavItem></LinkContainer>
                    </Nav>
                    <Nav pullRight={true} className='nav-right'>
                        <LanguageSelector/>
                        <NavDropdown id='logout' title={user.abbreviatedName}>
                            <MenuItem onClick={this.onUserProfileClick}>{i18n('main.user-profile')}</MenuItem>
                            <MenuItem divider={true}/>
                            <MenuItem onClick={this.props.logout}>{i18n('main.logout')}</MenuItem>
                        </NavDropdown>
                    </Nav>
                </Navbar>
            </header>
            <div className='content'>
                <Switch>
                    <Route component={Dashboard}/>
                </Switch>
            </div>
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