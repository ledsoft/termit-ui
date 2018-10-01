import * as React from 'react';
import {injectIntl} from 'react-intl';
import {Button} from 'reactstrap';
import withI18n, {HasI18n} from '../hoc/withI18n';
import Vocabulary from "../../model/Vocabulary";
import VocabularyUtils from "../../util/VocabularyUtils";
// @ts-ignore
import {IntelligentTreeSelect} from 'intelligent-tree-select';
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
import {fetchVocabularyTerms} from "../../action/ComplexActions";
import {ThunkDispatch} from '../../util/Types';


interface GlossaryTermsProps extends HasI18n, RouteComponentProps<any> {
    vocabulary?: Vocabulary;
    counter: number;
    selectedTerms: Term | null;
    selectVocabularyTerm: (selectedTerms: Term | null) => void;
    fetchTerms: (fetchOptions: FetchOptionsFunction, normalizedName: string) => void;
}

export class Terms extends React.Component<GlossaryTermsProps> {


    constructor(props: GlossaryTermsProps) {
        super(props);
        this._valueRenderer = this._valueRenderer.bind(this);
        this._onCreateClick = this._onCreateClick.bind(this);
        this._onChange = this._onChange.bind(this);
        this.fetchOptions = this.fetchOptions.bind(this);
    }

    public componentDidUpdate(prevProps: GlossaryTermsProps) {
        if (prevProps.counter < this.props.counter) {
            this.forceUpdate()
        }
    }

    public componentWillUnmount() {
        this.props.selectVocabularyTerm(null)
    }

    private _valueRenderer(option: Term) {
        return option.label
    }

    private fetchOptions({searchString, optionID, limit, offset}: FetchOptionsFunction) {
        return this.props.fetchTerms({searchString, optionID, limit, offset}, this.props.match.params.name)
    }

    private _onCreateClick() {
        const normalizedName = this.props.match.params.name;
        Routing.transitionTo(Routes.createVocabularyTerm, {params: new Map([['name', normalizedName]])});
    }

    private _onChange(term: Term | null) {
        this.props.selectVocabularyTerm(term);
        if (term) {
            Routing.transitionTo(Routes.vocabularyTermDetail,
                {params: new Map([['name', this.props.match.params.name], ['termName', VocabularyUtils.getFragment(term.iri)]])});
        }
    }

    public render() {
        const i18n = this.props.i18n;
        const actions = [];
        const component = <IntelligentTreeSelect
            className={"p-0"}
            name={"glossary-" + this.props.match.params.name}
            onChange={this._onChange}
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
        />;

        actions.push(
            <Button key='glossary.createTerm'
                    color='primary'
                    title={i18n('glossary.createTerm.tooltip')}
                    size='sm'
                    onClick={this._onCreateClick}>+</Button>)

        return (<PanelWithActions
            title={i18n('glossary.title')}
            className={"p-0"}
            component={component}
            actions={actions}
        />);

    }
}

export default withRouter(connect((state: TermItState) => {
    return {
        selectedTerms: state.selectedTerm,
        counter: state.createdTermsCounter
    };
}, (dispatch: ThunkDispatch) => {
    return {
        selectVocabularyTerm: (selectedTerm: Term | null) => dispatch(selectVocabularyTerm(selectedTerm)),
        fetchTerms: (fetchOptions: FetchOptionsFunction, normalizedName: string) => dispatch(fetchVocabularyTerms(fetchOptions, normalizedName)),
    };
})(injectIntl(withI18n(Terms))));