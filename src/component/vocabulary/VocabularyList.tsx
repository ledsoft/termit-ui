import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {loadVocabularies} from "../../action/AsyncActions";
import VocabularyLink from "./VocabularyLink";
import Vocabulary from "../../model/Vocabulary";
import {Table} from "reactstrap";
import {ThunkDispatch} from "../../util/Types";
import classNames from "classnames";

interface VocabularyListProps extends HasI18n {
    loadVocabularies: () => void;
    vocabularies: { [id: string]: Vocabulary };
    selectedVocabulary: Vocabulary;
}

class VocabularyList extends React.Component<VocabularyListProps> {

    public componentDidMount() {
        this.props.loadVocabularies();
    }

    public render() {
        // Note that the highlighting does not work properly, as there is no way of judging whether no vocabulary is
        // currently selected in the view This will be resolved with the UI redesign.
        const vocabularies = Object.keys(this.props.vocabularies).map((v) => this.props.vocabularies[v]);
        const rows = vocabularies.map(v =>
            <tr key={v.iri}>
                <td className={classNames({"bold": v.iri === this.props.selectedVocabulary.iri})}>
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
        vocabularies: state.vocabularies,
        selectedVocabulary: state.vocabulary
    };
}, (dispatch: ThunkDispatch) => {
    return {
        loadVocabularies: () => dispatch(loadVocabularies())
    };
})(injectIntl(withI18n(VocabularyList)));