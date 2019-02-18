import * as React from "react";
import {injectIntl} from "react-intl";
import {Button, Card, CardBody, CardHeader} from "reactstrap";
import withI18n, {HasI18n} from "../hoc/withI18n";
import Vocabulary from "../../model/Vocabulary";
import VocabularyUtils, {IRI} from "../../util/VocabularyUtils";
// @ts-ignore
import {IntelligentTreeSelect} from "intelligent-tree-select";
import "intelligent-tree-select/lib/styles.css";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {consumeNotification, selectVocabularyTerm} from "../../action/SyncActions";
import Routing from "../../util/Routing";
import Routes from "../../util/Routes";
import {RouteComponentProps, withRouter} from "react-router";
import FetchOptionsFunction from "../../model/Functions";
import Term, {TermData} from "../../model/Term";
import {loadTerms} from "../../action/AsyncActions";
import {ThunkDispatch} from "../../util/Types";
import {GoPlus} from "react-icons/go";
import Utils from "../../util/Utils";
import AppNotification from "../../model/AppNotification";
import AsyncActionStatus from "../../action/AsyncActionStatus";
import ActionType from "../../action/ActionType";
import NotificationType from "../../model/NotificationType";


interface GlossaryTermsProps extends HasI18n, RouteComponentProps<any> {
    vocabulary?: Vocabulary;
    counter: number;
    selectedTerms: Term | null;
    notifications: AppNotification[];
    selectVocabularyTerm: (selectedTerms: Term | null) => void;
    fetchTerms: (fetchOptions: FetchOptionsFunction, vocabularyIri: IRI) => Promise<Term[]>;
    consumeNotification: (notification: AppNotification) => void;
}

export class Terms extends React.Component<GlossaryTermsProps> {

    private treeComponent: React.RefObject<IntelligentTreeSelect>;

    constructor(props: GlossaryTermsProps) {
        super(props);
        this.onCreateClick = this.onCreateClick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.fetchOptions = this.fetchOptions.bind(this);
        this.treeComponent = React.createRef();
    }

    public componentDidUpdate(prevProps: GlossaryTermsProps) {
        if (prevProps.counter < this.props.counter) {
            this.forceUpdate()
        }
        const termCreated = this.props.notifications.find(n => (n.source.type === ActionType.CREATE_VOCABULARY_TERM
            && n.source.status === AsyncActionStatus.SUCCESS) || n.source.type === NotificationType.TERM_CHILDREN_UPDATED);
        if (termCreated && this.treeComponent.current) {
            this.treeComponent.current.resetOptions();
            this.props.consumeNotification(termCreated);
        }
    }

    public componentWillUnmount() {
        this.props.selectVocabularyTerm(null)
    }

    private static _valueRenderer(option: Term) {
        return option.label
    }

    private fetchOptions({searchString, optionID, limit, offset}: FetchOptionsFunction) {
        const namespace = Utils.extractQueryParam(this.props.location.search, "namespace");
        return this.props.fetchTerms({searchString, optionID, limit, offset}, {
            fragment: this.props.match.params.name,
            namespace
        });
    }

    public onCreateClick() {
        const normalizedName = this.props.match.params.name;
        const namespace = Utils.extractQueryParam(this.props.location.search, "namespace");
        Routing.transitionTo(Routes.createVocabularyTerm, {
            params: new Map([["name", normalizedName]]),
            query: namespace ? new Map([["namespace", namespace]]) : undefined
        });
    }

    public onChange(term: TermData | null) {
        if (term === null) {
            this.props.selectVocabularyTerm(term);
        } else {
            // The tree component adds depth and expanded attributes to the options when rendering,
            // We need to get rid of them before working with the term
            // We are creating a defensive copy of the term so that the rest of the application and the tree component
            // have their own versions
            const cloneData = Object.assign({}, term);
            // @ts-ignore
            delete cloneData.expanded;
            // @ts-ignore
            delete cloneData.depth;
            const clone = new Term(cloneData);
            this.props.selectVocabularyTerm(clone);
            const namespace = Utils.extractQueryParam(this.props.location.search, "namespace");
            Routing.transitionTo(Routes.vocabularyTermDetail,
                {
                    params: new Map([["name", this.props.match.params.name], ["termName", VocabularyUtils.getFragment(clone.iri)]]),
                    query: namespace ? new Map([["namespace", namespace]]) : undefined
                });
        }
    }

    public render() {
        const i18n = this.props.i18n;

        return <Card id="glossary">
            <CardHeader tag="h4" color="info" className="d-flex align-items-center">
                <div className="flex-grow-1">{i18n("glossary.title")}</div>
                <div className="float-sm-right">
                    <Button key="glossary.createTerm"
                            color="primary"
                            title={i18n("glossary.createTerm.tooltip")}
                            size="sm"
                            onClick={this.onCreateClick}><GoPlus/>&nbsp;{i18n("asset.create.button.text")}</Button>
                </div>
            </CardHeader>
            <CardBody className="p-0">
                <IntelligentTreeSelect className={"p-0"}
                                       ref={this.treeComponent}
                                       onChange={this.onChange}
                                       value={this.props.selectedTerms ? this.props.selectedTerms.iri : null}
                                       fetchOptions={this.fetchOptions}
                                       valueKey={"iri"}
                                       labelKey={"label"}
                                       childrenKey={"plainSubTerms"}
                                       simpleTreeData={true}
                                       isMenuOpen={true}
                                       multi={false}
                                       showSettings={false}
                                       valueRenderer={Terms._valueRenderer}
                />
            </CardBody>
        </Card>;

    }
}

export default withRouter(connect((state: TermItState) => {
    return {
        selectedTerms: state.selectedTerm,
        counter: state.createdTermsCounter,
        notifications: state.notifications
    };
}, (dispatch: ThunkDispatch) => {
    return {
        selectVocabularyTerm: (selectedTerm: Term | null) => dispatch(selectVocabularyTerm(selectedTerm)),
        fetchTerms: (fetchOptions: FetchOptionsFunction, vocabularyIri: IRI) => dispatch(loadTerms(fetchOptions, vocabularyIri)),
        consumeNotification: (notification: AppNotification) => dispatch(consumeNotification(notification))
    };
})(injectIntl(withI18n(Terms))));