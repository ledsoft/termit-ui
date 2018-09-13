import SparqlFaceter from "./SparqlFaceter";
import {ThunkDispatch} from "redux-thunk";
import {Action} from "redux";
import TermItState from "../../model/TermItState";
import {connect} from "react-redux";
import {selectVocabularyTerm} from "../../action/SyncActions";

interface Props {
    lang: string
}

export default connect((state: TermItState) : Props => {
    return {
        lang : state.intl.locale
    };
}, (dispatch: ThunkDispatch<object, undefined, Action>) => {
    return {
        selectVocabularyTerm: (selectedTerm: any) => dispatch(selectVocabularyTerm(selectedTerm))
    };
})(SparqlFaceter);