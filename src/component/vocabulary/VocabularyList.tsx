import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from '../hoc/withI18n';
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {loadVocabularies} from "../../action/ComplexActions";
import {ThunkDispatch} from "redux-thunk";
import {Action} from "redux";
import VocabularyLink from "./VocabularyLink";
import Vocabulary from "../../model/Vocabulary";
import {Table} from "reactstrap";

interface VocabularyListProps extends HasI18n {
    loadVocabularies : () => void,
    vocabularies : {[id : string]: Vocabulary}
}

class VocabularyList extends React.Component<VocabularyListProps> {

    public componentDidMount() {
        this.props.loadVocabularies();
    }

    public render() {
        const vocabularies = Object.keys(this.props.vocabularies).map((v) => this.props.vocabularies[v]);
        const rows = vocabularies.map(v =>
            <tr key={v.iri}>
                <td>
                    <VocabularyLink vocabulary={v}/>
                </td>
            </tr>
            );
        return <div>
            <Table borderless={true}>
                <tbody>
                {rows}
                </tbody>
            </Table>
        </div>
    }
}

export default connect((state: TermItState) => {
    return {
        vocabularies: state.vocabularies
    };
}, (dispatch: ThunkDispatch<object, undefined, Action>) => {
    return {
        loadVocabularies: () => dispatch(loadVocabularies())
    };
})(injectIntl(withI18n(VocabularyList)));