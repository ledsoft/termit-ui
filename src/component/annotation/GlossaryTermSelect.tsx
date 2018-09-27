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
import {selectVocabularyTerm} from "../../action/SyncActions";
import Routing from "../../util/Routing";
import Routes from "../../util/Routes";
import {RouteComponentProps, withRouter} from "react-router";
import PanelWithActions from "../misc/PanelWithActions";
import FetchOptionsFunction from "../../model/Functions";
import VocabularyTerm from "../../model/VocabularyTerm";
import {fetchVocabularyTerms} from "../../action/ComplexActions";
import {ThunkDispatch} from '../../util/Types';

interface GlossaryTermSelectProps extends HasI18n, RouteComponentProps<any> {
    vocabulary?: Vocabulary;
    selectedTerm: VocabularyTerm | null;
    selectVocabularyTerm: (selectedTerms: VocabularyTerm | null) => void;
    fetchTerms: (fetchOptions: FetchOptionsFunction, normalizedName: string) => void;
}

export class GlossaryTermSelect extends React.Component<GlossaryTermSelectProps> {


    constructor(props: GlossaryTermSelectProps) {
        super(props);
        this._valueRenderer = this._valueRenderer.bind(this);
        this._onCreateClick = this._onCreateClick.bind(this);
        this.fetchOptions = this.fetchOptions.bind(this);
    }

    public componentWillUnmount() {
        this.props.selectVocabularyTerm(null)
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
            name={"glossary-" + this.props.match.params.name}
            onChange={this.props.selectVocabularyTerm}
            value={this.props.selectedTerm}
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

        actions.push(<Button key='glossary.createTerm'
                             color='primary'
                             title={i18n('glossary.createTerm.tooltip')}
                             size='sm'
                             onClick={this._onCreateClick}>{'+'}</Button>);

        return (<PanelWithActions
            title={i18n('glossary.title')}
            component={component}
            actions={actions}
        />);

    }
}

export default withRouter(connect((state: TermItState) => {
    return {
        selectedTerm: state.selectedTerm,
    };
}, (dispatch: ThunkDispatch) => {
    return {
        selectVocabularyTerm: (selectedTerm: VocabularyTerm | null) => dispatch(selectVocabularyTerm(selectedTerm)),
        fetchTerms: (fetchOptions: FetchOptionsFunction, normalizedName: string) => dispatch(fetchVocabularyTerms(fetchOptions, normalizedName)),
    };
})(injectIntl(withI18n(GlossaryTermSelect))));