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
import Term, {TermData} from "../../model/Term";
import {fetchVocabularyTerms} from "../../action/AsyncActions";
import {ThunkDispatch} from '../../util/Types';
import {GoPlus} from "react-icons/go";


interface GlossaryTermsProps extends HasI18n, RouteComponentProps<any> {
    vocabulary?: Vocabulary;
    counter: number;
    selectedTerms: Term | null;
    selectVocabularyTerm: (selectedTerms: Term | null) => void;
    fetchTerms: (fetchOptions: FetchOptionsFunction, normalizedName: string) => Promise<Term[]>;
}

export class Terms extends React.Component<GlossaryTermsProps> {


    constructor(props: GlossaryTermsProps) {
        super(props);
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

    private static _valueRenderer(option: Term) {
        return option.label
    }

    private fetchOptions({searchString, optionID, limit, offset}: FetchOptionsFunction) {
        return this.props.fetchTerms({searchString, optionID, limit, offset}, this.props.match.params.name);
    }

    private _onCreateClick() {
        const normalizedName = this.props.match.params.name;
        Routing.transitionTo(Routes.createVocabularyTerm, {params: new Map([['name', normalizedName]])});
    }

    private _onChange(term: TermData | null) {
        if (term === null) {
            this.props.selectVocabularyTerm(term);
        } else {
            // The tree component adds depth and expanded attributes to the options when rendering,
            // We need to get rid of them before working with the term
            // We are creating a defensive copy of the term so that the rest of the application and the tree component have their own versions
            const cloneData = Object.assign({}, term);
            // @ts-ignore
            delete cloneData.expanded;
            // @ts-ignore
            delete cloneData.depth;
            const clone = new Term(cloneData);
            this.props.selectVocabularyTerm(clone);
            Routing.transitionTo(Routes.vocabularyTermDetail,
                {
                    params: new Map([['name', this.props.match.params.name], ['termName', VocabularyUtils.getFragment(clone.iri)]])
                });
        }
    }

    public render() {
        const i18n = this.props.i18n;
        const actions = [];
        const component = <IntelligentTreeSelect
            className={"p-0"}
            onChange={this._onChange}
            value={this.props.selectedTerms}
            fetchOptions={this.fetchOptions}
            valueKey={"iri"}
            labelKey={"label"}
            childrenKey={"plainSubTerms"}
            simpleTreeData={true}
            isMenuOpen={true}
            multi={false}
            showSettings={false}
            valueRenderer={Terms._valueRenderer}
        />;

        actions.push(
            <Button key='glossary.createTerm'
                    color='primary'
                    title={i18n('glossary.createTerm.tooltip')}
                    size='sm'
                    onClick={this._onCreateClick}><GoPlus/></Button>);

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