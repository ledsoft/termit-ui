import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "./hoc/withI18n";
import * as classNames from 'classnames';
import './Footer.scss';
import Constants from "../util/Constants";

interface FooterProps extends HasI18n {
    className?: string
}

const Footer: React.SFC<FooterProps> = (props) => {
    const i18n = props.i18n;
    const cls = classNames('footer', props.className);
    return <footer className={cls}>
        <div className="container-fluid">
            <p className="text-muted footer-copyright">
                &copy; <a href="https://kbss.felk.cvut.cz" target="_blank"
                          title={i18n('footer.copyright')}>{i18n('footer.copyright')}</a>, 2018
            </p>
            <p className="text-muted footer-version">
                {props.formatMessage('footer.version', {version: Constants.VERSION})}
            </p>
        </div>
    </footer>;
};

export default injectIntl(withI18n(Footer));