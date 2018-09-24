import SparqlFaceter from "./SparqlFaceter";
import {ThunkDispatch} from "redux-thunk";
import {Action} from "redux";
import TermItState from "../../model/TermItState";
import {connect} from "react-redux";
import {selectVocabularyTerm} from "../../action/SyncActions";
import Constants from "../../util/Constants";

interface Props {
    lang: string,
    endpointUrl:string
}

export default connect((state: TermItState) : Props => {
    return {
        lang : state.intl.locale,
        endpointUrl : Constants.endpoint_url
    };
}, (dispatch: ThunkDispatch<object, undefined, Action>) => {
    return {
        selectVocabularyTerm: (selectedTerm: any) => dispatch(selectVocabularyTerm(selectedTerm))
    };
})(SparqlFaceter);