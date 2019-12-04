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
import {ThunkDispatch, TreeSelectFetchOptionsParams} from "../../util/Types";
import {GoPlus} from "react-icons/go";
import Utils from "../../util/Utils";
import AppNotification from "../../model/AppNotification";
import AsyncActionStatus from "../../action/AsyncActionStatus";
import ActionType from "../../action/ActionType";
import NotificationType from "../../model/NotificationType";
import {createTermsWithImportsOptionRenderer} from "../misc/treeselect/Renderers";
import IncludeImportedTermsToggle from "./IncludeImportedTermsToggle";
import {commonTermTreeSelectProps, processTermsForTreeSelect} from "./TermTreeSelectHelper";

interface GlossaryTermsProps extends HasI18n, RouteComponentProps<any> {
    vocabulary?: Vocabulary;
    counter: number;
    selectedTerms: Term | null;
    notifications: AppNotification[];
    selectVocabularyTerm: (selectedTerms: Term | null) => void;
    fetchTerms: (fetchOptions: FetchOptionsFunction, vocabularyIri: IRI) => Promise<Term[]>;
    consumeNotification: (notification: AppNotification) => void;
}

interface TermsState {
    // Whether terms from imported vocabularies should be displayed as well
    includeImported: boolean;
}

export class Terms extends React.Component<GlossaryTermsProps, TermsState> {

    private readonly treeComponent: React.RefObject<IntelligentTreeSelect>;

    constructor(props: GlossaryTermsProps) {
        super(props);
        this.treeComponent = React.createRef();
        this.state = {
            includeImported: false
        };
    }

    public componentDidUpdate(prevProps: GlossaryTermsProps) {
        if (prevProps.counter < this.props.counter) {
            this.forceUpdate()
        }
        const termCreated = this.props.notifications.find(n => (n.source.type === ActionType.CREATE_VOCABULARY_TERM
            && n.source.status === AsyncActionStatus.SUCCESS) || n.source.type === NotificationType.TERM_HIERARCHY_UPDATED);
        if (termCreated && this.treeComponent.current) {
            this.treeComponent.current.resetOptions();
            this.props.consumeNotification(termCreated);
        }
    }

    public componentWillUnmount() {
        this.props.selectVocabularyTerm(null);
    }

    public fetchOptions = (fetchOptions: TreeSelectFetchOptionsParams<TermData>) => {
        const namespace = Utils.extractQueryParam(this.props.location.search, "namespace");
        const vocabularyIri = fetchOptions.option ? VocabularyUtils.create(fetchOptions.option.vocabulary!.iri!) : {
            fragment: this.props.match.params.name,
            namespace
        };
        return this.props.fetchTerms({
            ...fetchOptions,
            includeImported: this.state.includeImported
        }, vocabularyIri).then(terms => {
            const matchingVocabularies = Utils.sanitizeArray(this.props.vocabulary!.allImportedVocabularies).concat(this.props.vocabulary!.iri);
            return processTermsForTreeSelect(terms, matchingVocabularies, fetchOptions);
        });
    };

    public onCreateClick = () => {
        const normalizedName = this.props.match.params.name;
        const namespace = Utils.extractQueryParam(this.props.location.search, "namespace");
        Routing.transitionTo(Routes.createVocabularyTerm, {
            params: new Map([["name", normalizedName]]),
            query: namespace ? new Map([["namespace", namespace]]) : undefined
        });
    };

    public onTermSelect = (term: TermData | null) => {
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
            // It is an existing Term, so it is expected it has a vocabulary
            const vocabularyIri = VocabularyUtils.create(clone.vocabulary!.iri!);
            Routing.transitionTo(Routes.vocabularyTermDetail,
                {
                    params: new Map([["name", vocabularyIri.fragment], ["termName", VocabularyUtils.getFragment(clone.iri)]]),
                    query: new Map([["namespace", vocabularyIri.namespace!]])
                });
        }
    };

    private onIncludeImportedToggle = () => {
        this.setState({includeImported: !this.state.includeImported}, () => this.treeComponent.current.resetOptions());
    };

    private renderIncludeImported() {
        return (this.props.vocabulary && this.props.vocabulary.importedVocabularies) ?
            <div className="mb-1 mt-1 ml-1">
                <IncludeImportedTermsToggle id="glossary-include-imported" onToggle={this.onIncludeImportedToggle}
                                            includeImported={this.state.includeImported}/>
            </div> : null;
    }

    public render() {
        if (!this.props.vocabulary) {
            return null;
        }
        const i18n = this.props.i18n;

        return <Card id="glossary">
            <CardHeader tag="h4" color="info" className="d-flex align-items-center">
                <div className="flex-grow-1">{i18n("glossary.title")}</div>
                <div className="float-sm-right">
                    <Button id="terms-create"
                            color="primary"
                            title={i18n("glossary.createTerm.tooltip")}
                            size="sm"
                            onClick={this.onCreateClick}><GoPlus/>&nbsp;{i18n("asset.create.button.text")}</Button>
                </div>
            </CardHeader>
            <CardBody className="p-0">
                {this.renderIncludeImported()}
                <div id="glossary-list">
                    <IntelligentTreeSelect className={"p-0"}
                                           ref={this.treeComponent}
                                           onChange={this.onTermSelect}
                                           value={this.props.selectedTerms ? this.props.selectedTerms.iri : null}
                                           fetchOptions={this.fetchOptions}
                                           isMenuOpen={true}
                                           scrollMenuIntoView={false}
                                           multi={false}
                                           maxHeight={Utils.calculateAssetListHeight()}
                                           optionRenderer={createTermsWithImportsOptionRenderer(this.props.vocabulary.iri)}
                                           {...commonTermTreeSelectProps(i18n)}
                    />
                </div>
            </CardBody>
        </Card>;
    }
}

export default connect((state: TermItState) => {
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
})(injectIntl(withI18n(withRouter(Terms))));
