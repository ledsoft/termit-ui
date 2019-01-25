import * as React from "react";
import AssetCount from "./assetcount/AssetCount";
import Vocabulary from "../../util/VocabularyUtils";
import {default as withI18n, HasI18n} from "../hoc/withI18n";
import templateAssetCount from "./assetcount/AssetCount.rq";
import templateTermTypeFrequency from "./termtypefrequency/TermTypeFrequency.rq";
import {injectIntl} from "react-intl";
import {Responsive, WidthProvider} from "react-grid-layout";
import TermTypeFrequency from "./termtypefrequency/TermTypeFrequency";
import FullscreenablePanelWithActions from "../misc/FullscreenablePanelWithActions";
import PanelWithActions from "../misc/PanelWithActions";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const Statistics = (props: HasI18n) => {
    const sm = [
        {i: "topright", x: 0, y: 0, w: 3, h: 2, isDraggable: false},
        {i: "topcenter", x: 0, y: 4, w: 3, h: 2, isDraggable: false},
        {i: "topleft", x: 0, y: 6, w: 3, h: 2, isDraggable: false},
        {i: "centerleft", x: 0, y: 8, w: 3, h: 4, isDraggable: false},
    ];

    const lg = [
        {i: "topright", x: 0, y: 0, w: 4, h: 2, isDraggable: false},
        {i: "topcenter", x: 4, y: 0, w: 4, h: 2, isDraggable: false},
        {i: "topleft", x: 8, y: 0, w: 4, h: 2, isDraggable: false},
        {i: "centerleft", x: 0, y: 1, w: 12, h: 4, isDraggable: false},
    ];

    const layouts = {lg, md: lg, sm: lg, xs: sm, xxs: sm};
    const cols = {lg: 12, md: 12, sm: 3, xs: 3, xxs: 3};

    const query = (iri : string) => templateAssetCount.split("?assetType").join("<"+iri+">")

    return (<div>
        <ResponsiveReactGridLayout
            draggableCancel="input,textarea"
            className="layout"
            layouts={layouts}
            cols={cols}
            rowHeight={80}>
            <div key="topright">
                <PanelWithActions title={props.i18n("statistics.vocabulary.count")}>
                    <AssetCount sparqlQuery={query(Vocabulary.VOCABULARY)}/>
                </PanelWithActions>
            </div>
            <div key="topcenter">
                <PanelWithActions
                    title={props.i18n("statistics.term.count")}>
                    <AssetCount sparqlQuery={query(Vocabulary.TERM)}/>
                </PanelWithActions>
            </div>
            <div key="topleft">
                <PanelWithActions
                    title={props.i18n("statistics.user.count")}>
                    <AssetCount sparqlQuery={query(Vocabulary.USER)}/>
                </PanelWithActions>
            </div>
            <div key="centerleft">
                <FullscreenablePanelWithActions actions={[]}
                                                title={props.i18n("statistics.term.count")}>
                    <TermTypeFrequency sparqlQuery={templateTermTypeFrequency}
                                       notFilled={props.i18n("statistics.notFilled")}
                                       lang={props.locale}/>
                </FullscreenablePanelWithActions>
            </div>
        </ResponsiveReactGridLayout>
    </div>);
};

export default injectIntl(withI18n(Statistics));