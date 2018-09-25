import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../../hoc/withI18n";
import SearchResult from "../../../model/SearchResult";
import {Popover, PopoverBody} from "reactstrap";

interface SearchResultsOverlayProps extends HasI18n {
    show: boolean;
    searchResults: SearchResult[];
    targetId: string;
    onClose: () => void;
    onClick: (r: SearchResult) => void;
    onOpenSearch: () => void;
}

const MAX_RENDERED_RESULTS = 10;

const SearchResultsOverlay: React.SFC<SearchResultsOverlayProps> = (props: SearchResultsOverlayProps) => {
    const items = props.searchResults.slice(0, MAX_RENDERED_RESULTS).map(r => <li key={r.iri}
                                                                                  className='btn-link search-result-link'
                                                                                  onClick={props.onClick.bind(r)}>{r.label}</li>);
    if (props.searchResults.length > MAX_RENDERED_RESULTS) {
        items.push(<li key='full-info' className='btn-link search-result-info' onClick={props.onOpenSearch}>
            {props.formatMessage('main.search.count-info-and-link', {
                displayed: MAX_RENDERED_RESULTS,
                count: props.searchResults.length
            })}
        </li>);
    }
    return <Popover isOpen={props.show} toggle={props.onClose} target={props.targetId} placement='bottom-start'
                    hideArrow={true} className='search-results-overlay'>
        <PopoverBody>
            <ul>
                {items}
            </ul>
        </PopoverBody>
    </Popover>;
};

export default injectIntl(withI18n(SearchResultsOverlay));