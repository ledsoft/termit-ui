import * as React from 'react';
import {injectIntl} from 'react-intl';
import {Button, FormGroup, Label} from 'reactstrap';
import withI18n, {HasI18n} from '../hoc/withI18n';
import Vocabulary from "../../model/Vocabulary";
// @ts-ignore
import {IntelligentTreeSelect} from 'intelligent-tree-select';
import "intelligent-tree-select/lib/styles.css";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {selectVocabularyTerm} from "../../action/SyncActions";
import {RouteComponentProps, withRouter} from "react-router";
import FetchOptionsFunction from "../../model/Functions";
import Term, {TermData} from "../../model/Term";
import {fetchVocabularyTerms} from "../../action/AsyncActions";
import {ThunkDispatch} from '../../util/Types';
import Vocabulary2 from "../../util/VocabularyUtils";
import {GoPlus} from "react-icons/go";

interface GlossaryTermsProps extends HasI18n, RouteComponentProps<any> {
    vocabulary?: Vocabulary;
    counter: number;
    selectVocabularyTerm: (selectedTerms: Term | null) => void;
    fetchTerms: (fetchOptions: FetchOptionsFunction, normalizedName: string) => Promise<Term[]>;
}

interface AnnotationTermsProps extends GlossaryTermsProps {
    onChange: (term: Term | null) => void;
    selectedTerm: Term | null;
}

export class AnnotationTerms extends React.Component<AnnotationTermsProps> {

    constructor(props: AnnotationTermsProps) {
        super(props);
    }

    public componentDidUpdate(prevProps: AnnotationTermsProps) {
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

    private fetchOptions = ({searchString, optionID, limit, offset}: FetchOptionsFunction) => {
        const vocabularyName = Vocabulary2.create(this.props.vocabulary!.iri).fragment
        return this.props.fetchTerms({searchString, optionID, limit, offset}, vocabularyName);
    }

    private handleCreateClick = () =>  {
        // const normalizedName = this.props.match.params.name;
        // const namespace = Utils.extractQueryParam(this.props.location.search, "namespace");
        // Routing.transitionTo(Routes.createVocabularyTerm, {
        //     params: new Map([['name', normalizedName]]),
        //     query: namespace ? new Map([["namespace", namespace]]) : undefined
        // });
    }

    private handleChange = (term: TermData | null) => {
        if (term === null) {
            this.props.selectVocabularyTerm(term);
            // this.props.onChange(null);
            this.props.onChange(null);
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
            this.props.onChange(clone);
            // const namespace = Utils.extractQueryParam(this.props.location.search, "namespace");
            // Routing.transitionTo(Routes.vocabularyTermDetail,
            //     {
            //         params: new Map([['name', this.props.match.params.name], ['termName', VocabularyUtils.getFragment(clone.iri)]]),
            //         query: namespace ? new Map([["namespace", namespace]]) : undefined
            //     });
        }
    }

    public render() {
        const i18n = this.props.i18n;
        const actions = [];
        const component = <IntelligentTreeSelect
            className={"p-0"}
            onChange={this.handleChange}
            value={this.props.selectedTerm}
            fetchOptions={this.fetchOptions}
            valueKey={"iri"}
            labelKey={"label"}
            childrenKey={"plainSubTerms"}
            simpleTreeData={true}
            isMenuOpen={false}
            multi={false}
            showSettings={false}
            valueRenderer={AnnotationTerms._valueRenderer}
        />;

        actions.push(
            <Button key='glossary.createTerm'
                    color='primary'
                    title={i18n('glossary.createTerm.tooltip')}
                    size='sm'
                    onClick={this.handleCreateClick}><GoPlus/></Button>);

        // return (<PanelWithActions
        //     title={i18n('glossary.title')}
        //     className={"p-0"}
        //     component={component}
        //     actions={actions}
        // />);
        return (<FormGroup>
        <div> <Label className='attribute-label'>{'Term:'}</Label> {actions[0]} </div>
        {component}
    </FormGroup>);
    }
}

export default withRouter(connect((state: TermItState) => {
    return {
        vocabulary: state.vocabulary,
        // selectedTerm: state.selectedTerm,
        counter: state.createdTermsCounter
    };
}, (dispatch: ThunkDispatch) => {
    return {
        selectVocabularyTerm: (selectedTerm: Term | null) => dispatch(selectVocabularyTerm(selectedTerm)),
        fetchTerms: (fetchOptions: FetchOptionsFunction, normalizedName: string) => dispatch(fetchVocabularyTerms(fetchOptions, normalizedName)),
    };
})(injectIntl(withI18n(AnnotationTerms))));