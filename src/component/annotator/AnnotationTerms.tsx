import * as React from "react";
import {injectIntl} from "react-intl";
import {Button, FormGroup, Label} from "reactstrap";
import withI18n, {HasI18n} from "../hoc/withI18n";
import Vocabulary from "../../model/Vocabulary";
// @ts-ignore
import {IntelligentTreeSelect} from "intelligent-tree-select";
import "intelligent-tree-select/lib/styles.css";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {selectVocabularyTerm} from "../../action/SyncActions";
import {RouteComponentProps, withRouter} from "react-router";
import FetchOptionsFunction from "../../model/Functions";
import Term, {TermData} from "../../model/Term";
import {loadTerms} from "../../action/AsyncActions";
import {ThunkDispatch} from "../../util/Types";
import Vocabulary2 from "../../util/VocabularyUtils";
import VocabularyUtils, {IRI} from "../../util/VocabularyUtils";
import {GoPlus} from "react-icons/go";
import Routes from "../../util/Routes";
import Routing from "../../util/Routing";
import Utils from "../../util/Utils";
import {filterTermsOutsideVocabularyImportChain} from "../term/Terms";

interface GlossaryTermsProps extends HasI18n, RouteComponentProps<any> {
    vocabulary?: Vocabulary;
    counter: number;
    selectVocabularyTerm: (selectedTerms: Term | null) => void;
    fetchTerms: (fetchOptions: FetchOptionsFunction, vocabularyIri: IRI) => Promise<Term[]>;
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

    private fetchOptions = ({searchString, optionID, limit, offset}: FetchOptionsFunction) => {
        return this.props.fetchTerms({
            searchString,
            optionID,
            limit,
            offset
        }, Vocabulary2.create(this.props.vocabulary!.iri)).then(terms => {
            const matchingVocabularies = Utils.sanitizeArray(this.props.vocabulary!.allImportedVocabularies).concat(this.props.vocabulary!.iri);
            return filterTermsOutsideVocabularyImportChain(terms, matchingVocabularies);
        });
    };

    private handleCreateClick = () => {
        // const normalizedName = this.props.match.params.name;
        // const namespace = Utils.extractQueryParam(this.props.location.search, "namespace");
        const voc = VocabularyUtils.create(this.props.vocabulary!.iri);
        const namespace = voc.namespace;
        const normalizedName = voc.fragment;
        Routing.transitionTo(Routes.createVocabularyTerm, {
            params: new Map([["name", normalizedName]]),
            query: namespace ? new Map([["namespace", namespace]]) : undefined
        });
    };

    private handleChange = (term: TermData | null) => {
        if (term === null) {
            this.props.selectVocabularyTerm(term);
            // this.props.onChange(null);
            this.props.onChange(null);
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
            this.props.onChange(clone);
        }
    };

    public render() {
        const i18n = this.props.i18n;
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
            valueRenderer={Utils.labelValueRenderer}
        />;

        return <FormGroup>
            <div>
                <Label className="attribute-label">{i18n("type.term") + ":"}</Label>
                <Button key="annotator.createTerm" color="primary"
                        title={i18n("glossary.createTerm.tooltip")}
                        size="sm" onClick={this.handleCreateClick}><GoPlus/></Button>
            </div>
            {component}
        </FormGroup>;
    }
}

export default connect((state: TermItState) => {
    return {
        vocabulary: state.vocabulary,
        // selectedTerm: state.selectedTerm,
        counter: state.createdTermsCounter
    };
}, (dispatch: ThunkDispatch) => {
    return {
        selectVocabularyTerm: (selectedTerm: Term | null) => dispatch(selectVocabularyTerm(selectedTerm)),
        fetchTerms: (fetchOptions: FetchOptionsFunction, vocabularyIri: IRI) => dispatch(loadTerms(fetchOptions, vocabularyIri)),
    };
})(injectIntl(withI18n(withRouter(AnnotationTerms))));
