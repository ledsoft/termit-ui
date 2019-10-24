import * as React from "react";
import {IntlShape} from "react-intl";

export interface HasI18n {

    i18n(id: string): string;

    formatMessage(msgId: string, values: {} | undefined): string;

    locale: string;
}

// type HOC<PWrapped> = React.ComponentClass<PWrapped> | React.SFC<PWrapped>;

export default function withI18n<P extends HasI18n>(Component: React.ComponentType<P>): React.ComponentClass<Pick<P, Exclude<keyof P, keyof HasI18n>> & {intl: IntlShape}> {
    class Wrapper extends React.Component<P & HasI18n & {intl: IntlShape}> {
        protected i18n = (id: string): string => {
            return this.props.intl.messages[id] as string || ("{" + id + "}");
        };

        protected formatMessage = (msgId: string, values: {} | undefined = {}): string => {
            return this.props.intl.formatMessage({id: msgId}, values);
        };

        public render() {
            return <Component i18n={this.i18n} formatMessage={this.formatMessage} locale={this.props.intl.locale} {...this.props}/>;
        }
    }

    return Wrapper;
}
