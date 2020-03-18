import {IRI} from "../util/VocabularyUtils";
import ActionType from "./ActionType";
import {ThunkDispatch} from "../util/Types";
import {asyncActionFailure, asyncActionRequest, asyncActionSuccess} from "./SyncActions";
import Ajax, {param} from "../util/Ajax";
import Constants from "../util/Constants";
import {ErrorData} from "../model/ErrorInfo";
import JsonLdUtils from "../util/JsonLdUtils";
import {ChangeRecordData, CONTEXT as CHANGE_RECORD_CONTEXT} from "../model/changetracking/ChangeRecord";
import AssetFactory from "../util/AssetFactory";

export function loadTermHistory(termIri: IRI) {
    const action = {type: ActionType.LOAD_TERM_HISTORY};
    return (dispatch: ThunkDispatch) => {
        dispatch(asyncActionRequest(action, true));
        return Ajax.get(`${Constants.API_PREFIX}/terms/${termIri.fragment}/history`, param("namespace", termIri.namespace))
            .then(data => JsonLdUtils.compactAndResolveReferencesAsArray(data, CHANGE_RECORD_CONTEXT))
            .then((data: ChangeRecordData[]) => {
                dispatch(asyncActionSuccess(action));
                return data.map(d => AssetFactory.createChangeRecord(d));
            })
            .catch((error: ErrorData) => {
                dispatch(asyncActionFailure(action, error));
                return [];
            });
    }
}
