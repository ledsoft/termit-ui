import * as React from 'react';
import {injectIntl} from 'react-intl';
import {Button} from 'reactstrap';
import withI18n, {HasI18n} from '../hoc/withI18n';
import Vocabulary from "../../model/Vocabulary";
// @ts-ignore
import {IntelligentTreeSelect} from 'intelligent-tree-select';
import "intelligent-tree-select/lib/styles.css";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {ThunkDispatch} from "redux-thunk";
import {Action} from "redux";
import {selectVocabularyTerm} from "../../action/SyncActions";
import Routing from "../../util/Routing";
import Routes from "../../util/Routes";
import {RouteComponentProps, withRouter} from "react-router";
import PanelWithActions from "../misc/PanelWithActions";
import FetchOptionsFunction from "../../model/Functions";
import VocabularyTerm from "../../model/VocabularyTerm";
import {fetchVocabularyTerms, loadTerms} from "../../action/ComplexActions";

interface GlossaryTermsProps extends HasI18n, RouteComponentProps<any>{
    vocabulary?: Vocabulary;
    defaultTerms: VocabularyTerm[];
    selectedTerms: VocabularyTerm | null;
    selectVocabularyTerm: (selectedTerms: VocabularyTerm) => void;
    fetchTerms: (fetchOptions: FetchOptionsFunction, normalizedName: string) => void;
    loadTerms: (normalizedName: string) => void;
}

export class GlossaryTerms extends React.Component<GlossaryTermsProps> {


    constructor(props: GlossaryTermsProps) {
        super(props);
        this._valueRenderer = this._valueRenderer.bind(this);
        this._onCreateClick = this._onCreateClick.bind(this);
        this.fetchOptions = this.fetchOptions.bind(this);
    }

    public componentDidMount(){
        const normalizedName = this.props.match.params.name;
        this.props.loadTerms(normalizedName)
    }

    private _valueRenderer(option: VocabularyTerm) {
        return option.label
    }

    private fetchOptions({searchString, optionID, limit, offset}: FetchOptionsFunction) {
        return this.props.fetchTerms({searchString, optionID, limit, offset}, this.props.match.params.name)
    }

    private _onCreateClick() {
        const normalizedName = this.props.match.params.name;
        Routing.transitionTo(Routes.createVocabularyTerm, {params: new Map([['name', normalizedName]])});
    }

    public render() {
        const i18n = this.props.i18n;
        const actions = [];
        const component = <IntelligentTreeSelect
            onChange={this.props.selectVocabularyTerm}
            value={this.props.selectedTerms}
            fetchOptions={this.fetchOptions}
            valueKey={"iri"}
            labelKey={"label"}
            childrenKey={"subTerms"}
            simpleTreeData={true}
            isMenuOpen={true}
            multi={false}
            showSettings={false}
            valueRenderer={this._valueRenderer}
            options = {this.props.defaultTerms}
        />;

        actions.push(<Button key='glossary.createTerm'
                             color='primary'
                             title={i18n('glossary.createTerm.tooltip')}
                             size='sm'
                             onClick={this._onCreateClick}>{i18n('glossary.createTerm')}</Button>);

        return (<PanelWithActions
            title={i18n('glossary.title')}
            component={component}
            actions={actions}
        />);

    }
}

export default withRouter(connect((state: TermItState) => {
    return {
        selectedTerms: state.selectedTerm,
        defaultTerms: state.defaultTerms,
    };
}, (dispatch: ThunkDispatch<object, undefined, Action>) => {
    return {
        selectVocabularyTerm: (selectedTerm: VocabularyTerm) => dispatch(selectVocabularyTerm(selectedTerm)),
        fetchTerms: (fetchOptions: FetchOptionsFunction, normalizedName: string) => dispatch(fetchVocabularyTerms(fetchOptions, normalizedName)),
        loadTerms: (normalizedName: string) => dispatch(loadTerms(normalizedName)),
    };
})(injectIntl(withI18n(GlossaryTerms))));