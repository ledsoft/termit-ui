import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../../hoc/withI18n";
import SearchResult from "../../../model/SearchResult";
import {Popover, PopoverBody} from "reactstrap";
import {SearchResults} from "./SearchResults";
import AssetLinkFactory from "../../factory/AssetLinkFactory";
import AssetFactory from "../../../util/AssetFactory";

interface SearchResultsOverlayProps extends HasI18n {
    show: boolean;
    searchResults: SearchResult[];
    targetId: string;
    onClose: () => void;
    onOpenSearch: () => void;
}

export const MAX_RENDERED_RESULTS = 10;

export const SearchResultsOverlay: React.SFC<SearchResultsOverlayProps> = (props: SearchResultsOverlayProps) => {
    const items = [];
    if (props.searchResults.length === 0) {
        items.push(<li id="search-results-link" key="full-info" className="btn-link search-result-no-results"
                       onClick={props.onOpenSearch}
                       title={props.i18n("main.search.tooltip")}>
            {props.i18n("main.search.no-results")}
        </li>);
    } else {
        let counter = 0;
        let i = 0;
        const visited = new Set();
        while (counter < MAX_RENDERED_RESULTS && i < props.searchResults.length) {
            const item = props.searchResults[i++];
            if (visited.has(item.iri)) {
                continue;
            }
            counter++;
            visited.add(item.iri);
            items.push(<li key={item.iri} className="search-result-link">
                {SearchResults.renderTypeBadge(item)}
                <span onClick={props.onClose}>{AssetLinkFactory.createAssetLink(AssetFactory.createAsset(item))}</span>
            </li>);
        }
        if (i < props.searchResults.length) {
            items.push(<li id="search-results-link" key="full-info" className="btn-link search-result-info"
                           onClick={props.onOpenSearch}>
                {props.formatMessage("main.search.count-info-and-link", {
                    displayed: MAX_RENDERED_RESULTS,
                    count: new Set(props.searchResults.map(r => r.iri)).size
                })}
            </li>);
        }
    }

    return <Popover isOpen={props.show} toggle={props.onClose} target={props.targetId} placement="bottom-start"
                    hideArrow={true} className="search-results-overlay">
        <PopoverBody>
            <ul>
                {items}
            </ul>
        </PopoverBody>
    </Popover>;
};

export default injectIntl(withI18n(SearchResultsOverlay));