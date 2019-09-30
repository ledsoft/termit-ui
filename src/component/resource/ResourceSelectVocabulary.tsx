import * as React from "react";
import {injectIntl} from "react-intl";
import Asset from "../../model/Asset";
import {Button, ButtonToolbar, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import withI18n, {HasI18n} from "../hoc/withI18n";
import Vocabulary from "../../model/Vocabulary";
import VocabularySelect from "../vocabulary/VocabularySelect";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";

interface PropsConnected {
    vocabularies: Vocabulary[]
}

interface ResourceSelectVocabularyProps extends PropsConnected, HasI18n {
    show: boolean;
    onSubmit: (voc: Vocabulary | null) => void;
    onCancel: () => void;
    asset: Asset;
}

interface ResourceSelectVocabularyState {
    vocabularySelect: Vocabulary | null;
}

class ResourceSelectVocabulary extends React.Component<ResourceSelectVocabularyProps, ResourceSelectVocabularyState> {
    public constructor(props: ResourceSelectVocabularyProps) {
        super(props);
        this.state = {
            vocabularySelect: null,
        };
    }

    private onVocabularySet(voc: Vocabulary): void {
        this.setState({vocabularySelect: voc});
    }

    private onSubmit = () => {
        this.props.onSubmit(this.state.vocabularySelect);
    };

    public render() {
        const onVocabularySet = this.onVocabularySet.bind(this);
        return <Modal isOpen={this.props.show} toggle={this.props.onCancel}>
            <ModalHeader toggle={this.props.onCancel}>{this.props.i18n("vocabulary.select-vocabulary")}</ModalHeader>
            <ModalBody>
                <VocabularySelect id="select-vocabulary-analyze-resource" vocabulary={this.state.vocabularySelect} onVocabularySet={onVocabularySet}/>
            </ModalBody>
            <ModalFooter>
                <ButtonToolbar className="pull-right">
                    <Button id="select-vocabulary-submit" color="primary" size="sm"
                            onClick={this.onSubmit}>{this.props.i18n("file.metadata.startTextAnalysis.text")}</Button>
                    <Button id="select-vocabulary-cancel" color="secondary" size="sm"
                            onClick={this.props.onCancel}>{this.props.i18n("cancel")}</Button>
                </ButtonToolbar>
            </ModalFooter>
        </Modal>;
    }
};

export default connect<PropsConnected>((state: TermItState) => {
    return {
        vocabularies: Object.keys(state.vocabularies).map(value => state.vocabularies[value]),
    };
}) (injectIntl(withI18n(ResourceSelectVocabulary)));