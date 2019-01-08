import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {FormGroup, Label} from "reactstrap";
// @ts-ignore
import {IntelligentTreeSelect} from "intelligent-tree-select";
import "intelligent-tree-select/lib/styles.css";
import Term from "../../model/Term";
import {connect} from "react-redux";
import {ThunkDispatch} from "../../util/Types";
import {AssetData} from "../../model/Asset";
import FetchOptionsFunction from "../../model/Functions";
import {fetchVocabularyTerms} from "../../action/AsyncActions";
import Vocabulary from "../../model/Vocabulary";
import TermItState from "../../model/TermItState";
import VocabularyUtils from "../../util/VocabularyUtils";
import VocabularySelect from "../vocabulary/VocabularySelect";

interface PropsExternal {
    terms: Term[];
    onChange: (subTerms: AssetData[]) => void;
}

interface PropsConnected {
    vocabularies: Vocabulary[]
}

interface DispatchConnected {
    fetchTerms: (fetchOptions: FetchOptionsFunction, vocabulary: Vocabulary) => Promise<Term[]>;
}

interface Props extends PropsExternal, PropsConnected, DispatchConnected, HasI18n {}

interface State {
    vocabulary: Vocabulary | null;
}

export class ResourceRelatedTermsEdit extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {vocabulary: null};
    }

    private onChange = (val: Term[]) => {
        this.props.onChange(val.map(v => Object.assign({}, {iri: v.iri})));
    };

    private fetchOptions = ({searchString, optionID, limit, offset}: FetchOptionsFunction, vocabulary: Vocabulary) => {
        return this.props.fetchTerms({
            searchString,
            optionID,
            limit,
            offset
        }, vocabulary);
    };

    private valueRenderer = (option: Term) => {
        return option.label;
    };

    private resolveSelectedSubTerms(): string[] {
        return this.props.terms.map(t => t.iri!);
    }

    private onVocabularySet(voc: Vocabulary): void {
        this.setState({vocabulary: voc});
    }

    public render() {
        const selected = this.resolveSelectedSubTerms();
        const onVocabularySet = this.onVocabularySet.bind(this);
        const fetchOptions = ((fo: FetchOptionsFunction) =>
            this.fetchOptions.bind(this)(
                fo,this.state.vocabulary
        ));
        const key = this.state.vocabulary ? this.state.vocabulary.iri : "http://null";
        const a = <IntelligentTreeSelect key={key}
                                         className="resource-tags-edit"
                                         onChange={this.onChange}
                                         value={selected}
                                         fetchOptions={fetchOptions}
                                         valueKey="iri"
                                         labelKey="label"
                                         childrenKey="plainSubTerms"
                                         simpleTreeData={true}
                                         showSettings={false}
                                         fetchLimit={100000}
                                         maxHeight={150}
                                         multi={true}
                                         displayInfoOnHover={true}
                                         expanded={true}
                                         renderAsTree={true}
                                         valueRenderer={this.valueRenderer}/>;
        return <FormGroup>
            <Label className="attribute-label">{this.props.i18n("resource.metadata-edit.terms")}</Label>{" "}
            <VocabularySelect vocabulary={this.state.vocabulary} onVocabularySet={onVocabularySet}/>
            {this.state.vocabulary ? a : ""}
        </FormGroup>;
    }
}

export default connect<PropsConnected, DispatchConnected>((state: TermItState) => {
    return {
        vocabularies: Object.keys(state.vocabularies).map(value => state.vocabularies[value]),
    };
}, ((dispatch: ThunkDispatch) => {
    return {
        fetchTerms: (fetchOptions: FetchOptionsFunction, vocabulary: Vocabulary) =>
            dispatch(fetchVocabularyTerms(fetchOptions, VocabularyUtils.create(vocabulary.iri).fragment)),
    }
}))(injectIntl(withI18n(ResourceRelatedTermsEdit)));
