import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "./hoc/withI18n";
import './Footer.scss';

const Footer: React.SFC<HasI18n> = (props) => {
    const i18n = props.i18n;
    return <footer className="footer">
        <div className="container-fluid">
            <p className="text-muted" style={{float: 'left'}}>
                &copy; <a href="https://kbss.felk.cvut.cz" target="_blank"
                          title="KBSS at FEL ČVUT">{i18n('footer.copyright')}</a>, 2018
            </p>
            <p className="text-muted" style={{float: 'right'}}>
                Version: Dev
            </p>
        </div>
    </footer>;
};

export default injectIntl(withI18n(Footer));