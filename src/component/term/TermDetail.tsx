import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {RouteComponentProps, withRouter} from "react-router";
import {connect} from "react-redux";
import {ThunkDispatch} from "../../util/Types";
import {loadDefaultTerms, loadTerm, updateTerm} from "../../action/AsyncActions";
import TermMetadata from "./TermMetadata";
import Term from "../../model/Term";
import TermItState from "../../model/TermItState";
import {Button} from "reactstrap";
import Vocabulary from "../../model/Vocabulary";
import PanelWithActions from "../misc/PanelWithActions";
import {GoPencil} from "react-icons/go";
import EditableComponent from "../misc/EditableComponent";
import TermMetadataEdit from "./TermMetadataEdit";
import Utils from "../../util/Utils";
import AppNotification from "../../model/AppNotification";
import {publishNotification} from "../../action/SyncActions";
import NotificationType from "../../model/NotificationType";
import OutgoingLink from "../misc/OutgoingLink";
import {IRI} from "../../util/VocabularyUtils";

interface TermDetailProps extends HasI18n, RouteComponentProps<any> {
    term: Term | null;
    vocabulary: Vocabulary | null;
    loadTerm: (termName: string, vocabularyIri: IRI) => void;
    updateTerm: (term: Term, vocabulary: Vocabulary) => Promise<any>;
    reloadVocabularyTerms: (vocabularyIri: IRI) => void;
    publishNotification: (notification: AppNotification) => void;
}

export class TermDetail extends EditableComponent<TermDetailProps> {

    constructor(props: TermDetailProps) {
        super(props);
        this.state = {
            edit: false
        };
    }

    public componentDidMount(): void {
        this.loadTerm();
    }

    private loadTerm(): void {
        const vocabularyName: string = this.props.match.params.name;
        const termName: string = this.props.match.params.termName;
        const namespace = Utils.extractQueryParam(this.props.location.search, "namespace");
        this.props.loadTerm(termName, {fragment: vocabularyName, namespace});
    }

    private reloadVocabularyTerms(): void {
        const vocabularyName: string = this.props.match.params.name;
        const match = this.props.location.search.match(/namespace=(.+)/);
        let namespace: string | undefined;
        if (match) {
            namespace = match[1];
        }
        this.props.reloadVocabularyTerms({fragment: vocabularyName, namespace});
    }

    public componentDidUpdate(prevProps: TermDetailProps) {
        const currTermName = this.props.match.params.termName;
        const prevTermName = prevProps.match.params.termName;
        if (currTermName !== prevTermName) {
            this.onCloseEdit();
            this.loadTerm();
        }
    }

    public onSave = (term: Term) => {
        const oldChildren = this.props.term!.plainSubTerms;
        this.props.updateTerm(term, this.props.vocabulary!).then(() => {
            this.loadTerm();
            this.reloadVocabularyTerms();
            this.onCloseEdit();
            if (term.plainSubTerms !== oldChildren) {
                this.props.publishNotification({source: {type: NotificationType.TERM_CHILDREN_UPDATED}});
            }
        });
    };

    public render() {
        if (!this.props.term || !this.props.vocabulary) {
            return null;
        }
        const actions = this.state.edit ? [] :
            [<Button size="sm" color="primary" onClick={this.onEdit} key="term-detail-edit"
                     title={this.props.i18n("edit")}><GoPencil/> {this.props.i18n("edit")}</Button>];
        const component = this.state.edit ?
            <TermMetadataEdit save={this.onSave} term={this.props.term!} vocabulary={this.props.vocabulary!}
                              cancel={this.onCloseEdit}/> :
            <TermMetadata term={this.props.term!}/>;
        return <PanelWithActions title={<OutgoingLink label={this.props.term.label} iri={this.props.term.iri}/>}
                                 actions={actions}>{component}</PanelWithActions>;
    }
}

export default connect((state: TermItState) => {
    return {
        term: state.selectedTerm,
        vocabulary: state.vocabulary
    };
}, (dispatch: ThunkDispatch) => {
    return {
        loadTerm: (termName: string, vocabularyIri: IRI) => dispatch(loadTerm(termName, vocabularyIri)),
        updateTerm: (term: Term, vocabulary: Vocabulary) => dispatch(updateTerm(term, vocabulary)),
        reloadVocabularyTerms: (vocabularyIri: IRI) => dispatch(loadDefaultTerms(vocabularyIri)),
        publishNotification: (notification: AppNotification) => dispatch(publishNotification(notification))
    };
})(injectIntl(withI18n(withRouter(TermDetail))));
