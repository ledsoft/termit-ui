import * as React from 'react';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {injectIntl} from "react-intl";
import Tabs from "../misc/Tabs";
import Vocabulary from "../../model/Vocabulary";
import DocumentDetail from "./DocumentDetail";
import IRIFactory from "../../util/VocabularyUtils";

interface DocumentTabProps extends HasI18n {
    vocabulary: Vocabulary
}

class DocumentTab extends React.Component<DocumentTabProps> {

    constructor(props: DocumentTabProps) {
        super(props);
    }

    private getActiveTab() {
        return 'vocabulary.detail.tabs.annotations';
    }

    public render() {

        const select = (id: string) => {
            id.toString()
        };
        const tabs = {};
        if (this.props.vocabulary.document) {
            const documentIRI = IRIFactory.create(this.props.vocabulary.document!.iri);
            tabs['vocabulary.detail.tabs.annotations'] = <DocumentDetail iri={documentIRI}/>;
        }
        return <div>
            <Tabs
                activeTabLabelKey={this.getActiveTab()}
                tabs={tabs}
                changeTab={select}
            />
        </div>
    }
}

export default injectIntl(withI18n(DocumentTab));