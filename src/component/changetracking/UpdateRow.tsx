import * as React from "react";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {FormattedDate, FormattedTime, injectIntl} from "react-intl";
import {UpdateRecord, UpdateValueType} from "../../model/changetracking/UpdateRecord";
import AssetLabel from "../misc/AssetLabel";

interface UpdateRowProps extends HasI18n {
    record: UpdateRecord;
}

export const UpdateRow: React.FC<UpdateRowProps> = props => {
    const record = props.record;
    const created = new Date(record.timestamp);
    // TODO
    return <tr>
        <td>
            <div>
                <FormattedDate value={created}/>{" "}
                <FormattedTime value={created}/>
            </div>
            <div className="italics last-edited-message ml-2">
                {record.author.fullName}
            </div>
        </td>
        <td>
            {props.i18n(record.typeLabel)}
        </td>
        <td>
            <AssetLabel iri={record.changedAttribute.iri}/>
        </td>
        <td>
            {renderValue(record.originalValue)}
        </td>
        <td>
            {renderValue(record.newValue)}
        </td>
    </tr>;
};

function renderValue(value?: UpdateValueType) {
    if (!value) {
        return null;
    }
    if (Array.isArray(value)) {
        return <ul>
            {(value as Array<{ iri?: string }>).map((v, i) => <li key={i}>{v.iri ? v.iri : v}</li>)}
        </ul>;
    } else {
        return (value as { iri?: string }).iri ? (value as { iri: string }).iri : value;
    }
}

export default injectIntl(withI18n(UpdateRow));
