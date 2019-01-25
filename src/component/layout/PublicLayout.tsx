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
    let wallpaperStyle;
    let navbarBackground;
    let navbarBackgroundIsLight;

    if (Constants.LAYOUT_WALLPAPER) {
        wallpaperStyle = {
            backgroundImage: "url(" + Constants.LAYOUT_WALLPAPER + ")",
            backgroundPosition: Constants.LAYOUT_WALLPAPER_POSITION || "center center",
        };
        navbarBackground = Constants.LAYOUT_WALLPAPER_NAVBAR_BACKGROUND;
        navbarBackgroundIsLight = Constants.LAYOUT_WALLPAPER_NAVBAR_BACKGROUND_IS_LIGHT;
    } else {
        wallpaperStyle = {};
        navbarBackground = Constants.LAYOUT_NAVBAR_BACKGROUND;
        navbarBackgroundIsLight = Constants.LAYOUT_NAVBAR_BACKGROUND_IS_LIGHT;
    }

    return <div className="main-container" style={wallpaperStyle}>
        <header>
            <Navbar light={navbarBackgroundIsLight}
                    expand={"lg"}
                    className={(navbarBackgroundIsLight ? "navbar-light" : "navbar-dark") + " d-flex"}
                    style={{background: navbarBackground}}>
                <NavbarBrand href="/">
                    {Constants.APP_NAME}
                </NavbarBrand>
            </Navbar>
        </header>
        <Container fluid={true} className="pt-5 pb-5 flex-grow-1 main-container">
            {props.children}
        </Container>
        <Footer dark={!navbarBackgroundIsLight}/>
    </div>;
};

export default injectIntl(withI18n(PublicLayout));
