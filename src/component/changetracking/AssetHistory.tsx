import * as React from "react";
import withI18n, {HasI18n} from "../hoc/withI18n";
import Asset from "../../model/Asset";
import ChangeRecord from "../../model/changetracking/ChangeRecord";
import {Table} from "reactstrap";
import {connect} from "react-redux";
import {injectIntl} from "react-intl";
import {ThunkDispatch} from "../../util/Types";
import {loadHistory} from "../../action/AsyncActions";
import {UpdateRecord} from "../../model/changetracking/UpdateRecord";
import UpdateRow from "./UpdateRow";
import PersistRow from "./PersistRow";
import PersistRecord from "../../model/changetracking/PersistRecord";

interface AssetHistoryProps extends HasI18n {
    asset: Asset;

    loadHistory: (asset: Asset) => Promise<ChangeRecord[]>;
}

export const AssetHistory: React.FC<AssetHistoryProps> = props => {
    const [records, setRecords] = React.useState<ChangeRecord[]>([]);
    React.useEffect(() => {
        props.loadHistory(props.asset).then(recs => setRecords(recs));
    }, [props.asset]);
    const i18n = props.i18n;
    return <div className="additional-metadata-container">
        <Table striped={true}>
            <thead>
            <tr>
                <th className="col-xs-2">{i18n("history.whenwho")}</th>
                <th className="col-xs-1">{i18n("history.type")}</th>
                <th className="col-xs-2">{i18n("history.changedAttribute")}</th>
                <th className="col-xs-2">{i18n("history.originalValue")}</th>
                <th className="col-xs-2">{i18n("history.newValue")}</th>
            </tr>
            </thead>
            <tbody>
            {records.map(r => r instanceof UpdateRecord ?
                <UpdateRow key={r.iri} record={r as UpdateRecord}/> :
                <PersistRow key={r.iri} record={r as PersistRecord}/>)}
            </tbody>
        </Table>
    </div>;
};

export default connect(undefined, (dispatch: ThunkDispatch) => {
    return {
        loadHistory: (asset: Asset) => dispatch(loadHistory(asset))
    };
})(injectIntl(withI18n(AssetHistory)));
