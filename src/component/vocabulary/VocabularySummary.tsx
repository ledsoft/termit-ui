import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {RouteComponentProps} from "react-router";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import Vocabulary from "../../model/Vocabulary";
import {loadVocabulary} from "../../action/ComplexActions";
import {ThunkDispatch} from "redux-thunk";
import {Action} from "redux";
import PanelWithActions from "../misc/PanelWithActions";
import VocabularyMetadata from "./VocabularyMetadata";
import {Button} from "reactstrap";

interface VocabularySummaryProps {
    vocabulary: Vocabulary;
    loadVocabulary: (name: string) => void;
}

export class VocabularySummary extends React.Component<VocabularySummaryProps & HasI18n & RouteComponentProps<any>> {

    public componentDidMount(): void {
        const normalizedName = this.props.match.params.name;
        this.props.loadVocabulary(normalizedName);
    }

    public render() {
        const normalizedName = this.props.match.params.name;
        const actions = [];
        actions.push(
            <Link key="vocabulary.summary.gotodetail"
                  to={"/vocabulary/" + this.props.vocabulary.name + "/detail"}>
                <Button color='primary'
                        size='sm'
                        title={this.props.i18n('vocabulary.summary.gotodetail.label')}>🔍
                </Button>
            </Link>
        );
        return <div>
            <PanelWithActions
            title={this.props.formatMessage('vocabulary.summary.title', {name: normalizedName})}
            actions={actions}
            component={<VocabularyMetadata vocabulary={this.props.vocabulary}/>}
        /></div>;
    }
}

export default connect((state: TermItState) => {
    return {
        vocabulary: state.vocabulary
    };
}, (dispatch: ThunkDispatch<object, undefined, Action>) => {
    return {
        loadVocabulary: (normalizedName: string) => dispatch(loadVocabulary(normalizedName))
    };
})(injectIntl(withI18n(VocabularySummary)));