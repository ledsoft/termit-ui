import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../../hoc/withI18n";
import SearchResult from "../../../model/SearchResult";
import {Popover, PopoverBody} from "reactstrap";

interface SearchResultsOverlayProps extends HasI18n {
    searchResults: SearchResult[];
    targetId: string;
    onClose: () => void;
    onClick: (r: SearchResult) => void;
}

const SearchResultsOverlay: React.SFC<SearchResultsOverlayProps> = (props: SearchResultsOverlayProps) => {
    return <Popover isOpen={true} toggle={props.onClose} target={props.targetId} placement='bottom-start'
                    hideArrow={true} className='search-results-overlay'>
        <PopoverBody>
            <ul>
                {props.searchResults.map(r => <li key={r.iri}>
                    <span className='btn-link search-result-link' key={r.iri}
                          onClick={props.onClick.bind(r)}>{r.label}</span>
                </li>)}
            </ul>
        </PopoverBody>
    </Popover>;
};

export default injectIntl(withI18n(SearchResultsOverlay));