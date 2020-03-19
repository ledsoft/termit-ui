import * as React from "react";
import withI18n, {HasI18n} from "../hoc/withI18n";
import ChangeRecord from "../../model/changetracking/ChangeRecord";
import {FormattedDate, FormattedTime, injectIntl} from "react-intl";
import {i18n} from "../../__tests__/environment/IntlUtil";
import {UpdateRecord} from "../../model/changetracking/UpdateRecord";

interface HistoryRowProps extends HasI18n {
    record: ChangeRecord;
}

export const HistoryRow: React.FC<HistoryRowProps> = props => {
    const record = props.record;
    const created = new Date(record.timestamp);
    // TODO
    return <tr>
        <td>
            <div>
                <FormattedDate value={created}/>
                <FormattedTime value={created}/>
            </div>
            <div className="italics last-edited-message ml-2">
                {record.author.fullName}
            </div>
        </td>
        <td>
            {i18n(record.typeLabel)}
        </td>
        <td>
            {record instanceof UpdateRecord ? (record as UpdateRecord).changedAttribute : "&nbsp;"}
        </td>
        <td>
            {record instanceof UpdateRecord ? (record as UpdateRecord).originalValue : "&nbsp;"}
        </td>
        <td>
            {record instanceof UpdateRecord ? (record as UpdateRecord).newValue : "&nbsp;"}
        </td>
    </tr>;
};

export default injectIntl(withI18n(HistoryRow));
