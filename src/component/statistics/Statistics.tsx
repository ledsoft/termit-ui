import * as React from "react";
import AssetCount from "./AssetCount";
import Vocabulary from "../../util/Vocabulary";
import {HasI18n, default as withI18n} from "../hoc/withI18n";
import {injectIntl} from "react-intl";
import {Responsive, WidthProvider} from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

const Statistics = (props: HasI18n) => {
    const sm = [
        {i: 'topright', x: 0, y: 0, w: 3, h: 2, isDraggable:false},
        {i: 'topcenter', x: 0, y: 4, w: 3, h: 2, isDraggable:false},
        {i: 'topleft', x: 0, y: 6, w: 3, h: 2, isDraggable:false},
    ];

    const lg = [
        {i: 'topright', x: 0, y: 0, w: 3, h: 2, isDraggable:false},
        {i: 'topcenter', x: 3, y: 0, w: 3, h: 2, isDraggable:false},
        {i: 'topleft', x: 6, y: 0, w: 3, h: 2, isDraggable:false},
    ];

    const layouts = {lg, md: lg, sm:lg, xs: sm, xxs: sm};
    const cols = {lg: 9, md: 9, sm: 3, xs: 3, xxs: 3};
    return (<div>
        <ResponsiveReactGridLayout
            draggableCancel="input,textarea"
            className="layout"
            layouts={layouts}
            cols={cols}
            rowHeight={210}>
            <div key="topright"><AssetCount
                title={props.i18n('statistics.vocabulary.count')}
                typeIri={Vocabulary.VOCABULARY}/>
            </div>
            <div key="topcenter"><AssetCount
                title={props.i18n('statistics.term.count')}
                typeIri={Vocabulary.TERM}/>
            </div>
        </ResponsiveReactGridLayout>
    </div>);
};

export default injectIntl(withI18n(Statistics));