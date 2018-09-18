import * as React from "react";
import AssetCount from "./AssetCount";
import Vocabulary from "../../util/Vocabulary";
import {HasI18n, default as withI18n} from "../hoc/withI18n";
import {injectIntl} from "react-intl";

const Statistics = (props: HasI18n) => {
    return (<div>
        <AssetCount
            title={props.i18n('statistics.vocabulary.count')}
            typeIri={Vocabulary.VOCABULARY}/>
    </div>);
};

export default injectIntl(withI18n(Statistics));