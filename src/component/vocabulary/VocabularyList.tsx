import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {loadVocabularies} from "../../action/AsyncActions";
import Vocabulary from "../../model/Vocabulary";
import {ThunkDispatch} from "../../util/Types";
// @ts-ignore
import {IntelligentTreeSelect} from "intelligent-tree-select";
import "intelligent-tree-select/lib/styles.css";
import Utils from "../../util/Utils";
import Routing from "../../util/Routing";
import Routes from "../../util/Routes";

interface VocabularyListProps extends HasI18n {
    loadVocabularies: () => void;
    vocabularies: { [id: string]: Vocabulary };
    selectedVocabulary: Vocabulary;
}

export const VocabularyList: React.FC<VocabularyListProps> = props => {
    React.useEffect(() => {
        props.loadVocabularies();
    }, []);

    const onSelect = (voc: Vocabulary) => {
        if (voc === null) {
            Routing.transitionTo(Routes.vocabularies);
        } else {
            Routing.transitionToAsset(voc);
        }
    };

    const options = Object.keys(props.vocabularies).map((v) => {
        const voc = props.vocabularies[v];
        return {
            iri: voc.iri,
            label: voc.label,
            comment: voc.comment ? voc.comment : voc.label,
            types: Utils.sanitizeArray(voc.types).slice(),
            children: []
        }
    });
    if (options.length === 0) {
        return <div className="italics">{props.i18n("vocabulary.management.empty")}</div>;
    }
    const height = Utils.calculateAssetListHeight();
    return <div id="vocabulary-list">
        <IntelligentTreeSelect className="p-0"
                               onChange={onSelect}
                               value={props.selectedVocabulary ? props.selectedVocabulary.iri : null}
                               options={options}
                               valueKey="iri"
                               labelKey="label"
                               isMenuOpen={true}
                               multi={false}
                               showSettings={false}
                               displayInfoOnHover={true}
                               scrollMenuIntoView={false}
                               renderAsTree={false}
                               maxHeight={height}
                               valueRenderer={Utils.labelValueRenderer}
                               tooltipKey="comment"
        />
    </div>;
};

export default connect((state: TermItState) => {
    return {
        vocabularies: state.vocabularies,
        selectedVocabulary: state.vocabulary
    };
}, (dispatch: ThunkDispatch) => {
    return {
        loadVocabularies: () => dispatch(loadVocabularies())
    };
})(injectIntl(withI18n(VocabularyList)));
