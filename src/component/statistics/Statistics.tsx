import * as React from "react";
import AssetCount from "./assetcount/AssetCount";
import Vocabulary from "../../util/VocabularyUtils";
import {HasI18n, default as withI18n} from "../hoc/withI18n";
import {injectIntl} from "react-intl";
import {Responsive, WidthProvider} from 'react-grid-layout';
import TermTypeFrequency from "./termtypefrequency/TermTypeFrequency";
const ResponsiveReactGridLayout = WidthProvider(Responsive);

const Statistics = (props: HasI18n) => {
    const sm = [
        {i: 'topright', x: 0, y: 0, w: 3, h: 2, isDraggable:false},
        {i: 'topcenter', x: 0, y: 4, w: 3, h: 2, isDraggable:false},
        {i: 'topleft', x: 0, y: 6, w: 3, h: 2, isDraggable:false},
        {i: 'centerleft', x: 0, y: 8, w: 3, h: 4, isDraggable:false},
    ];

    const lg = [
        {i: 'topright', x: 0, y: 0, w: 4, h: 2, isDraggable:false},
        {i: 'topcenter', x: 4, y: 0, w: 4, h: 2, isDraggable:false},
        {i: 'topleft', x: 8, y: 0, w: 4, h: 2, isDraggable:false},
        {i: 'centerleft', x: 0, y: 1, w: 6, h: 4, isDraggable:false},
    ];

    const layouts = {lg, md: lg, sm:lg, xs: sm, xxs: sm};
    const cols = {lg: 12, md: 12, sm: 3, xs: 3, xxs: 3};
    return (<div>
        <ResponsiveReactGridLayout
            draggableCancel="input,textarea"
            className="layout"
            layouts={layouts}
            cols={cols}
        rowHeight={100}>
            <div key="topright"><AssetCount
                title={props.i18n('statistics.vocabulary.count')}
                typeIri={Vocabulary.VOCABULARY}/>
            </div>
            <div key="topcenter"><AssetCount
                title={props.i18n('statistics.term.count')}
                typeIri={Vocabulary.TERM}/>
            </div>
            <div key="topleft"><AssetCount
                title={props.i18n('statistics.user.count')}
                typeIri={Vocabulary.USER}/>
            </div>
            <div key="centerleft"><TermTypeFrequency
                title={props.i18n('statistics.types.frequency')}
                notFilled={props.i18n('statistics.notFilled')}
                lang={props.locale}/>
            </div>
        </ResponsiveReactGridLayout>
    </div>);
};

export default injectIntl(withI18n(Statistics));