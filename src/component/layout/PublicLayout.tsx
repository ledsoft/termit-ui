import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import Footer from "../Footer";
import {Container, Navbar, NavbarBrand} from "reactstrap";
import Constants from "../../util/Constants";

interface PublicLayoutProps extends HasI18n {
    className?: string,
    title: string,
}

const PublicLayout: React.SFC<PublicLayoutProps> = (props) => {
    return <div className="main-container" style={Constants.LAYOUT_WALLPAPER ? {backgroundImage: "url(" + Constants.LAYOUT_WALLPAPER + ")"} : {}}>
        <header>
            <Navbar light={Constants.LAYOUT_NAVBAR_BACKGROUND_IS_LIGHT}
                    expand={"lg"}
                    className={(Constants.LAYOUT_NAVBAR_BACKGROUND_IS_LIGHT ? "navbar-light" : "navbar-dark") + " d-flex"}
                    style={{background: Constants.LAYOUT_NAVBAR_BACKGROUND}}>
                <NavbarBrand href="/">
                    {Constants.APP_NAME}
                </NavbarBrand>
            </Navbar>
        </header>
        <Container fluid={true} className="pt-5 pb-5 flex-grow-1 main-container">
            {props.children}
        </Container>
        <Footer />
    </div>;
};

export default injectIntl(withI18n(PublicLayout));
