import * as React from 'react';
import Vocabulary from "../../model/Vocabulary";
import './VocabularyDetail.scss';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {injectIntl} from "react-intl";
import VocabularyMetadata from "./VocabularyMetadata";
import Tabs from "../misc/Tabs";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import Term from "../../model/Term";
import {RouteComponentProps, withRouter} from "react-router";
import Routes from "../../util/Routes";
import {loadVocabularyTerm} from "../../action/AsyncActions";
import {ThunkDispatch} from '../../util/Types';
import TermMetadata from '../term/TermMetadata';

interface VocabularyDetailProps extends HasI18n, RouteComponentProps<any> {
    vocabulary: Vocabulary
    selectedTerm: Term | null
    getVocabularyTermByName: (termNormalizedName: string, vocabularyNormalizedName: string) => any

}

interface VocabularyDetailState {
    activeTabID: string
}

class VocabularyDetailTabPanel extends React.Component<VocabularyDetailProps, VocabularyDetailState> {

    constructor(props: VocabularyDetailProps) {
        super(props);
        this.state = {
            activeTabID: 'vocabulary.detail.tabs.metadata'
        }
    }

    public componentDidMount() {
        if (this.props.match.path === Routes.vocabularyTermDetail.path && !this.props.selectedTerm) {
            this.props.getVocabularyTermByName(this.props.match.params.termName, this.props.match.params.name);
        }
        this.setState({activeTabID: this.getActiveTab()});
    }

    public componentDidUpdate(prevProps: VocabularyDetailProps) {
        if (this.props.selectedTerm === null && this.props.match.path === Routes.vocabularyTermDetail.path) {
            this.props.getVocabularyTermByName(this.props.match.params.termName, this.props.match.params.name);
        }
        if (this.props.selectedTerm != null && prevProps.selectedTerm === null) {
            this.setState({activeTabID: this.getActiveTab()});
        }
    }

    private getActiveTab() {
        return (this.props.selectedTerm === null) ? 'vocabulary.detail.tabs.metadata' : 'vocabulary.detail.tabs.termdetail';
    }

    private toggle(id: string) {
        this.setState({activeTabID: id})
    }

    private isTermSelected() {
        return this.props.selectedTerm !== null;
    }

    public render() {
        const select = (id: string) => {
            this.toggle(id);
        };
        const tabs = {};
        tabs['vocabulary.detail.tabs.metadata'] = <VocabularyMetadata vocabulary={this.props.vocabulary}/>;
        if (this.isTermSelected()) {
            tabs['vocabulary.detail.tabs.termdetail'] =
                <TermMetadata term={this.props.selectedTerm!} vocabulary={this.props.vocabulary}/>
        }

        return <Tabs activeTabLabelKey={this.state.activeTabID} tabs={tabs} changeTab={select}/>;
    }
}

export default withRouter(connect((state: TermItState) => {
    return {
        vocabulary: state.vocabulary,
        selectedTerm: state.selectedTerm
    };
}, (dispatch: ThunkDispatch) => {
    return {
        getVocabularyTermByName: (termNormalizedName: string, vocabularyNormalizedName: string) => dispatch(loadVocabularyTerm(termNormalizedName, vocabularyNormalizedName))
    };
})(injectIntl(withI18n(VocabularyDetailTabPanel))));