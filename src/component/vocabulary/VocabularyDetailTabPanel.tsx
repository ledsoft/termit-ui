import * as React from 'react';
import Vocabulary from "../../model/Vocabulary";
import './VocabularyDetail.scss';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {injectIntl} from "react-intl";
import VocabularyMetadata from "./VocabularyMetadata";
import Tabs from "../misc/Tabs";

interface VocabularyDetailProps extends HasI18n {
    vocabulary: Vocabulary
}

class VocabularyDetailTabPanel extends React.Component<VocabularyDetailProps> {

    constructor(props: VocabularyDetailProps) {
        super(props);
    }

    private getActiveTab() {
        return 'vocabulary.detail.tabs.metadata';
        // TODO bind to redux state
    }

    private toggle(id : string) {
        // TODO bind to redux action
    }

    private isTermSelected() {
        // TODO bind to redux state
        return true;
    }

    public render() {
        const select = ( id : string ) => {
            this.toggle(id);
        }
        const tabs = {};
        tabs['vocabulary.detail.tabs.metadata'] = () => <VocabularyMetadata vocabulary={this.props.vocabulary}/>;
        if (this.isTermSelected()) {
            tabs['vocabulary.detail.tabs.termdetail'] = () => <div>TODO (should appear term detail)</div>;
        }

        return <Tabs
            activeTabLabelKey={this.getActiveTab()}
            tabs={ tabs }
            changeTab={select}
        />
    }
}

export default injectIntl(withI18n(VocabularyDetailTabPanel));