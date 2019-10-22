import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {RouteComponentProps, withRouter} from "react-router";
import {connect} from "react-redux";
import {ThunkDispatch} from "../../util/Types";
import {loadTerm, updateTerm} from "../../action/AsyncActions";
import TermMetadata from "./TermMetadata";
import Term from "../../model/Term";
import TermItState from "../../model/TermItState";
import {Button} from "reactstrap";
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
import * as _ from "lodash";

interface TermDetailProps extends HasI18n, RouteComponentProps<any> {
    term: Term | null;
    loadTerm: (termName: string, vocabularyIri: IRI) => void;
    updateTerm: (term: Term) => Promise<any>;
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

    public componentDidUpdate(prevProps: TermDetailProps) {
        const currTermName = this.props.match.params.termName;
        const prevTermName = prevProps.match.params.termName;
        if (currTermName !== prevTermName) {
            this.onCloseEdit();
            this.loadTerm();
        }
    }

    public onSave = (term: Term) => {
        const oldParent = this.props.term!.parentTerms;
        this.props.updateTerm(term).then(() => {
            this.loadTerm();
            this.onCloseEdit();
            if (_.xorBy(oldParent, Utils.sanitizeArray(term.parentTerms), t => t.iri).length > 0) {
                this.props.publishNotification({source: {type: NotificationType.TERM_HIERARCHY_UPDATED}});
            }
        });
    };

    public render() {
        if (!this.props.term) {
            return null;
        }
        const actions = this.state.edit ? [] :
            [<Button id="term-detail-edit" size="sm" color="primary" onClick={this.onEdit} key="term-detail-edit"
                     title={this.props.i18n("edit")}><GoPencil/> {this.props.i18n("edit")}</Button>];
        const component = this.state.edit ?
            <TermMetadataEdit save={this.onSave} term={this.props.term!} cancel={this.onCloseEdit}/> :
            <TermMetadata term={this.props.term!}/>;
        return <PanelWithActions id="term-detail"
                                 title={<OutgoingLink label={this.props.term.label} iri={this.props.term.iri}/>}
                                 actions={actions}>{component}</PanelWithActions>;
    }
}

export default connect((state: TermItState) => {
    return {
        term: state.selectedTerm
    };
}, (dispatch: ThunkDispatch) => {
    return {
        loadTerm: (termName: string, vocabularyIri: IRI) => dispatch(loadTerm(termName, vocabularyIri)),
        updateTerm: (term: Term) => dispatch(updateTerm(term)),
        publishNotification: (notification: AppNotification) => dispatch(publishNotification(notification))
    };
})(injectIntl(withI18n(withRouter(TermDetail))));
