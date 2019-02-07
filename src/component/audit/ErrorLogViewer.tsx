import * as React from "react";
import {injectIntl} from "react-intl";
import {ErrorLogItem} from "../../model/ErrorInfo";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {Table} from "reactstrap";

interface ErrorLogViewerProps extends HasI18n {
    errors: ErrorLogItem[];
}

export const ErrorLogViewer: React.SFC<ErrorLogViewerProps> = (props) => {
    const i18n = props.i18n;
    const errors = props.errors;
    return <Table striped={true} responsive={true}>
        <thead>
        <tr>
            <th className="col-xs-3">{i18n("log-viewer.timestamp")}</th>
            <th className="col-xs-9">{i18n("log-viewer.error")}</th>
        </tr>
        </thead>
        <tbody>
        {errors.map(item => {
            return <tr key={item.timestamp}>
                <td>{new Date(item.timestamp).toLocaleString(props.locale)}</td>
                <td>{JSON.stringify(item.error, null, 2)}</td>
            </tr>
        })}
        </tbody>
    </Table>;
};

export default connect((state: TermItState) => {
    return {
        errors: state.errors
    };
})(injectIntl(withI18n(ErrorLogViewer)));