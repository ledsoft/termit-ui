import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import Routes from "../../util/Routes";
import PanelWithActions from "../misc/PanelWithActions";
import {GoPlus} from "react-icons/go";
import {Link} from "react-router-dom";
import VocabularyList from "./VocabularyList";

const Vocabularies: React.FC<HasI18n> = props => {
    const i18n = props.i18n;
    const actions = [<Link id="vocabularies-create" key="vocabulary.vocabularies.create"
                           className="btn btn-primary btn-sm"
                           title={i18n("vocabulary.vocabularies.create.tooltip")}
                           to={Routes.createVocabulary.path}><GoPlus/>&nbsp;{i18n("asset.create.button.text")}</Link>];

    return <PanelWithActions title={i18n("vocabulary.management.vocabularies")} actions={actions} id="vocabularies">
        <VocabularyList/>
    </PanelWithActions>;
};

export default injectIntl(withI18n(Vocabularies));
