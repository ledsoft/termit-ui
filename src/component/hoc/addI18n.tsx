import * as React from 'react';
import InjectedIntlProps = ReactIntl.InjectedIntlProps;

export interface HasI18n extends InjectedIntlProps {

    i18n(id: string): void;

    formatMessage(msgId: string, values: {}): void;
}

const addI18n = <P extends HasI18n>(Component: React.ComponentType<P>) => {
    class Wrapper extends React.Component<P & HasI18n> {
        protected i18n = (id: string) => {
            return this.props.intl.messages[id];
        };

        protected formatMessage = (msgId: string, values: {}) => {
            return this.props.intl.formatMessage({id: msgId}, values);
        };

        public render() {
            return <Component i18n={this.i18n} formatMessage={this.formatMessage} {...this.props}/>;
        }
    }

    return Wrapper;
};

export default addI18n;