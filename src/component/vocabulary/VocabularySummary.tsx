import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {RouteComponentProps} from "react-router";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import Vocabulary, {EMPTY_VOCABULARY} from "../../model/Vocabulary";
import {loadVocabulary, updateVocabulary} from "../../action/AsyncActions";
import VocabularyMetadata from "./VocabularyMetadata";
import {Button, ButtonToolbar} from "reactstrap";
import PanelWithActions from "../misc/PanelWithActions";
import VocabularyUtils, {IRI} from "../../util/VocabularyUtils";
import {GoPencil, GoThreeBars} from 'react-icons/go';
import {ThunkDispatch} from "../../util/Types";
import EditableComponent from "../misc/EditableComponent";
import Routing from '../../util/Routing';
import Routes from "../../util/Routes";
import VocabularyEdit from "./VocabularyEdit";
import Utils from "../../util/Utils";

interface VocabularySummaryProps extends HasI18n, RouteComponentProps<any> {
    vocabulary: Vocabulary;
    loadVocabulary: (iri: IRI) => void;
    updateVocabulary: (vocabulary: Vocabulary) => Promise<any>;
}

export class VocabularySummary extends EditableComponent<VocabularySummaryProps> {

    constructor(props: VocabularySummaryProps) {
        super(props);
        this.state = {
            edit: false
        };
    }

    public componentDidMount(): void {
        this.loadVocabulary();
    }

    public componentDidUpdate(): void {
        if (this.props.vocabulary !== EMPTY_VOCABULARY) {
            this.loadVocabulary();
        }
    }

    private loadVocabulary(): void {
        const normalizedName = this.props.match.params.name;
        const namespace = Utils.extractQueryParam(this.props.location.search, 'namespace');
        const iri = VocabularyUtils.create(this.props.vocabulary.iri);
        if (iri.fragment !== normalizedName || iri.namespace !== namespace) {
            this.props.loadVocabulary({fragment: normalizedName, namespace});
        }
    }

    private openTerms = () => {
        const iri = VocabularyUtils.create(this.props.vocabulary.iri);
        Routing.transitionTo(Routes.vocabularyDetail, {
            params: new Map([['name', iri.fragment]]),
            query: new Map([['namespace', iri.namespace!]])
        });
    };

    public onSave = (vocabulary: Vocabulary) => {
        this.props.updateVocabulary(vocabulary).then(() => {
            this.onCloseEdit();
            this.props.loadVocabulary(VocabularyUtils.create(vocabulary.iri));
        });
    };

    public render() {
        const buttons = [<Button key='vocabulary.summary.detail' color='info' size='sm'
                                 title={this.props.i18n('vocabulary.summary.gotodetail.label')}
                                 onClick={this.openTerms}>
            <GoThreeBars/>
        </Button>];
        if (!this.state.edit) {
            buttons.push(<Button key='vocabulary.summary.edit' size='sm' color='info' title={this.props.i18n('edit')}
                                 onClick={this.onEdit}><GoPencil/></Button>);
        }
        const actions = [<ButtonToolbar key='vocabulary.summary.actions'>{buttons}</ButtonToolbar>];
        const component = this.state.edit ?
            <VocabularyEdit save={this.onSave} cancel={this.onCloseEdit} vocabulary={this.props.vocabulary}/> :
            <VocabularyMetadata vocabulary={this.props.vocabulary}/>;
        return <div>
            <PanelWithActions
                title={this.props.vocabulary.label}
                actions={actions}
                component={component}/>
        </div>;
    }
}

export default connect((state: TermItState) => {
    return {
        vocabulary: state.vocabulary
    };
}, (dispatch: ThunkDispatch) => {
    return {
        loadVocabulary: (iri: IRI) => dispatch(loadVocabulary(iri)),
        updateVocabulary: (vocabulary: Vocabulary) => dispatch(updateVocabulary(vocabulary))
    };
})(injectIntl(withI18n(VocabularySummary)));