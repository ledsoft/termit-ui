import * as React from "react";
import {injectIntl} from "react-intl";
import {Button} from "reactstrap";
import withI18n, {HasI18n} from "../hoc/withI18n";
import Vocabulary from "../../model/Vocabulary";
// @ts-ignore
import {IntelligentTreeSelect} from "intelligent-tree-select";
import "intelligent-tree-select/lib/styles.css";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {selectVocabularyTerm} from "../../action/SyncActions";
import Routing from "../../util/Routing";
import Routes from "../../util/Routes";
import {RouteComponentProps, withRouter} from "react-router";
import PanelWithActions from "../misc/PanelWithActions";
import FetchOptionsFunction from "../../model/Functions";
import Term from "../../model/Term";
import {loadTerms} from "../../action/AsyncActions";
import {ThunkDispatch} from "../../util/Types";
import {IRI} from "../../util/VocabularyUtils";

interface TermSelectProps extends HasI18n, RouteComponentProps<any> {
    vocabulary?: Vocabulary;
    selectedTerm: Term | null;
    selectVocabularyTerm: (selectedTerms: Term | null) => void;
    fetchTerms: (fetchOptions: FetchOptionsFunction, vocabularyIri: IRI) => void;
}

export class TermSelect extends React.Component<TermSelectProps> {


    constructor(props: TermSelectProps) {
        super(props);
        this._valueRenderer = this._valueRenderer.bind(this);
        this._onCreateClick = this._onCreateClick.bind(this);
        this.fetchOptions = this.fetchOptions.bind(this);
    }

    public componentWillUnmount() {
        this.props.selectVocabularyTerm(null)
    }

    private _valueRenderer(option: Term) {
        return option.label
    }

    private fetchOptions({searchString, optionID, limit, offset}: FetchOptionsFunction) {
        // TODO This should consider also vocabulary IRI namespace
        return this.props.fetchTerms({searchString, optionID, limit, offset}, {fragment: this.props.match.params.name});
    }

    private _onCreateClick() {
        const normalizedName = this.props.match.params.name;
        Routing.transitionTo(Routes.createVocabularyTerm, {params: new Map([["name", normalizedName]])});
    }

    public render() {
        const i18n = this.props.i18n;
        const actions = [];
        const component = <IntelligentTreeSelect
            onChange={this.props.selectVocabularyTerm}
            value={this.props.selectedTerm}
            fetchOptions={this.fetchOptions}
            valueKey={"iri"}
            labelKey={"label"}
            childrenKey="plainSubTerms"
            simpleTreeData={true}
            isMenuOpen={true}
            multi={false}
            showSettings={false}
            valueRenderer={this._valueRenderer}
        />;

        actions.push(<Button key="glossary.createTerm"
                             color="primary"
                             title={i18n("glossary.createTerm.tooltip")}
                             size="sm"
                             onClick={this._onCreateClick}>{"+"}</Button>);

        return (<PanelWithActions
            title={i18n("glossary.title")}
            actions={actions}
        >{component}</PanelWithActions>);

    }
}

export default withRouter(connect((state: TermItState) => {
    return {
        selectedTerm: state.selectedTerm,
    };
}, (dispatch: ThunkDispatch) => {
    return {
        selectVocabularyTerm: (selectedTerm: Term | null) => dispatch(selectVocabularyTerm(selectedTerm)),
        fetchTerms: (fetchOptions: FetchOptionsFunction, vocabularyIri: IRI) => dispatch(loadTerms(fetchOptions, vocabularyIri)),
    };
})(injectIntl(withI18n(TermSelect))));