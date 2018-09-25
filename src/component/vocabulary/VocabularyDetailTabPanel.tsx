import * as React from 'react';
import Vocabulary from "../../model/Vocabulary";
import './VocabularyDetail.scss';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {injectIntl} from "react-intl";
import VocabularyMetadata from "./VocabularyMetadata";
import Tabs from "../misc/Tabs";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {ThunkDispatch} from "redux-thunk";
import {Action} from "redux";
import VocabularyTerm from "../../model/VocabularyTerm";
import TermMetadata from "../term/TermMetadata";

interface VocabularyDetailProps extends HasI18n {
    vocabulary: Vocabulary
    selectedTerm: VocabularyTerm | null
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

    public componentDidUpdate(prevProps: VocabularyDetailProps){
        if (prevProps.selectedTerm !== this.props.selectedTerm) {
            this.setState({activeTabID: this.getActiveTab()})
        }
    }

    private getActiveTab() {
        return (this.props.selectedTerm === null)? 'vocabulary.detail.tabs.metadata' : 'vocabulary.detail.tabs.termdetail';
    }

    private toggle(id : string) {
        this.setState({activeTabID: id})
    }

    private isTermSelected() {
        return this.props.selectedTerm !== null;
    }

    public render() {
        const select = ( id : string ) => {
            this.toggle(id);
        };
        const tabs = {};
        tabs['vocabulary.detail.tabs.metadata'] = () => <VocabularyMetadata vocabulary={this.props.vocabulary}/>;
        if (this.isTermSelected()) {
            tabs['vocabulary.detail.tabs.termdetail'] = () => {
                if (this.props.selectedTerm){
                    return <TermMetadata term={this.props.selectedTerm}/>;
                }
                return <div/>
            }
        }

        return <Tabs
            activeTabLabelKey={this.state.activeTabID}
            tabs={ tabs }
            changeTab={select}
        />
    }
}

export default connect((state: TermItState) => {
    return {
        selectedTerm: state.selectedTerm
    };
}, (dispatch: ThunkDispatch<object, undefined, Action>) => {
    return {
    };
})(injectIntl(withI18n(VocabularyDetailTabPanel)));