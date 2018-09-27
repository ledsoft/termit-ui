import * as React from 'react';
import Vocabulary from "../../model/Vocabulary";
import './VocabularyDetail.scss';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {injectIntl} from "react-intl";
import VocabularyMetadata from "./VocabularyMetadata";
import Tabs from "../misc/Tabs";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import VocabularyTerm from "../../model/VocabularyTerm";
import TermMetadata from "../term/TermMetadata";
import {RouteComponentProps, withRouter} from "react-router";
import Routes from "../../util/Routes";
import {selectVocabularyTerm} from "../../action/SyncActions";
import {getVocabularyTermByName} from "../../action/ComplexActions";
import Routing from "../../util/Routing";
import {ThunkDispatch} from '../../util/Types';

interface VocabularyDetailProps extends HasI18n, RouteComponentProps<any> {
    vocabulary: Vocabulary
    selectedTerm: VocabularyTerm | null
    getVocabularyTermByName: (termNormalizedName: string, vocabularyNormalizedName: string) => any
    selectTerm: (term: VocabularyTerm | null) => void

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
            this.props.getVocabularyTermByName(this.props.match.params.termName, this.props.match.params.name)
                .then((term: VocabularyTerm | null) => {
                    this.props.selectTerm(term)
                });
        }
        this.setState({activeTabID: this.getActiveTab()});
    }

    public componentDidUpdate(prevProps: VocabularyDetailProps) {
        if (this.props.selectedTerm === null && this.props.match.path === Routes.vocabularyTermDetail.path) {
            Routing.transitionTo(Routes.vocabularyDetail, {params: new Map([['name', this.props.match.params.name]])});
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
        tabs['vocabulary.detail.tabs.metadata'] = () => <VocabularyMetadata vocabulary={this.props.vocabulary}/>;
        if (this.isTermSelected()) {
            tabs['vocabulary.detail.tabs.termdetail'] = () => {
                if (this.props.selectedTerm) {
                    return <TermMetadata term={this.props.selectedTerm}/>;
                }
                return <div/>
            }
        }

        return <Tabs
            activeTabLabelKey={this.state.activeTabID}
            tabs={tabs}
            changeTab={select}
        />
    }
}

export default withRouter(connect((state: TermItState) => {
    return {
        selectedTerm: state.selectedTerm
    };
}, (dispatch: ThunkDispatch) => {
    return {
        getVocabularyTermByName: (termNormalizedName: string, vocabularyNormalizedName: string) => dispatch(getVocabularyTermByName(termNormalizedName, vocabularyNormalizedName)),
        selectTerm: (term: VocabularyTerm | null) => dispatch(selectVocabularyTerm(term)),
    };
})(injectIntl(withI18n(VocabularyDetailTabPanel))));