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

// TODO The vocabulary will be required (or replaced by a tree of terms directly)
interface GlossaryTermsProps extends HasI18n{
    vocabulary?: Vocabulary
    selectedTerms: any
    selectVocabularyTerm: (selectedTerms: any) => void
    labelKey: string,
    valueKey: string,
    childrenKey: string,
    options: any[],
    fetchOptions: ({searchString, optionID, limit, offset}: FetchOptionsFunction) => Promise<any[]> // TODO term object instead of any[]
}

export class GlossaryTerms extends React.Component<GlossaryTermsProps & RouteComponentProps<any> > {


    constructor(props: GlossaryTermsProps & RouteComponentProps<any> ) {
        super(props);
        this._onSelect = this._onSelect.bind(this);
        this._valueRenderer = this._valueRenderer.bind(this);
        this._onCreateClick = this._onCreateClick.bind(this);
    }

    private _onSelect(options: any) {
        this.props.selectVocabularyTerm(options)
    }

    private _valueRenderer(option: any) {
        return option.label
    }

    private _onCreateClick() {
        const normalizedName = this.props.match.params.name;
        Routing.transitionTo(Routes.createVocabularyTerm, {params: new Map([['name', normalizedName]])});
    }

    public render() {
        const i18n = this.props.i18n;
        const actions = [];
        const component = <IntelligentTreeSelect
            name={"glossary-terms-search"}
            onChange={this._onSelect}
            value={this.props.selectedTerms}
            fetchOptions={this.props.fetchOptions}
            valueKey={this.props.valueKey}
            labelKey={this.props.labelKey}
            childrenKey={this.props.childrenKey}
            simpleTreeData={true}
            isMenuOpen={true}
            multi={false}
            options={this.props.options}
            showSettings={false}
            valueRenderer={this._valueRenderer}
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
        selectedTerms: state.terms,
    };
}, (dispatch: ThunkDispatch<object, undefined, Action>) => {
    return {
        selectVocabularyTerm: (selectedTerm: any) => dispatch(selectVocabularyTerm(selectedTerm))
    };
})(injectIntl(withI18n(GlossaryTerms))));