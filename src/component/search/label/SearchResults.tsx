import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../../hoc/withI18n";
import SearchResult from "../../../model/SearchResult";
import {Col, Label, Row, Table} from "reactstrap";
import VocabularyUtils from "../../../util/VocabularyUtils";
import VocabularyBadge from "../../badge/VocabularyBadge";
import TermBadge from "../../badge/TermBadge";
import FTSMatch from "./FTSMatch";
import AssetLinkFactory from "../../factory/AssetLinkFactory";
import AssetFactory from "../../../util/AssetFactory";

class SearchResultItem extends SearchResult {
    public totalScore: number;
    public snippets: string[];
    public snippetFields: string[];

    constructor(data: SearchResult) {
        super(data);
        this.totalScore = data.score ? data.score : 0;
        this.snippets = [data.snippetText];
        this.snippetFields = [data.snippetField];
    }
}

interface SearchResultsProps extends HasI18n {
    results: SearchResult[];
}

/**
 * Comparator for sorting search results.
 *
 * Sorts items by total score, descending.
 */
function scoreSort(a: SearchResultItem, b: SearchResultItem) {
    return b.totalScore - a.totalScore;
}

export class SearchResults extends React.Component<SearchResultsProps> {

    public render() {
        const i18n = this.props.i18n;
        if (this.props.results.length === 0) {
            return <Label className="italics">{i18n("main.search.no-results")}</Label>;
        }
        const rows = this.renderResults();
        return <div>
            <div className="italics">{this.props.formatMessage("search.results.countInfo", {
                matches: this.props.results.length,
                assets: rows.length
            })}</div>
            <Table responsive={true} className="search-results">
                <thead>
                <tr>
                    <th className="search-results-asset">{i18n("type.asset")}</th>
                    <th className="search-results-match">{i18n("search.results.table.match")}</th>
                    <th className="search-results-score text-center">{i18n("search.results.table.score")}</th>
                </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </Table>
        </div>;
    }

    private renderResults() {
        const items = SearchResults.mergeDuplicates(this.props.results);
        const maxScore = SearchResults.calculateMaxScore(items);
        return items.map(r => {
            return <tr key={r.iri} className="m-search-result-row">
                <td className="align-middle search-result-label">
                    <Row>
                        <Col md={5} lg={4} xl={2} className="d-flex align-items-center">
                            {SearchResults.renderTypeBadge(r)}
                        </Col>
                        <Col md={7} lg={8} xl={10}>
                            {AssetLinkFactory.createAssetLink(AssetFactory.createAsset(r))}
                        </Col>
                    </Row>
                </td>
                <td className="align-middle search-result-match"><FTSMatch matches={r.snippets}
                                                                           fields={r.snippetFields}/></td>
                <td className="align-middle text-center search-result-score">
                    {SearchResults.renderScore(r.totalScore, maxScore)}
                </td>
            </tr>;
        });
    }

    private static mergeDuplicates(results: SearchResult[]) {
        const map = new Map<string, SearchResultItem>();
        results.forEach(r => {
            if (!map.has(r.iri)) {
                map.set(r.iri, new SearchResultItem(r));
            } else {
                const existing = map.get(r.iri)!;
                existing.totalScore += r.score ? r.score : 0;
                // If the match field is the same there is no need to update other attributes, as the match is already
                // marked in the snippet of the existing item
                if (existing.snippetField !== r.snippetField) {
                    if (r.snippetField === "label") {
                        // Render label match first
                        existing.snippets.unshift(r.snippetText);
                        existing.snippetFields.unshift(r.snippetField);
                    } else {
                        existing.snippets.push(r.snippetText);
                        existing.snippetFields.push(r.snippetField);
                    }
                }
            }
        });
        const arr = Array.from(map.values());
        arr.sort(scoreSort);
        return arr;
    }

    private static calculateMaxScore(results: SearchResultItem[]) {
        return results.reduce((accumulator, item) => item.totalScore > accumulator ? item.totalScore : accumulator, 0.0);
    }

    public static renderTypeBadge(item: SearchResult) {
        return item.hasType(VocabularyUtils.VOCABULARY) ? <VocabularyBadge/> : <TermBadge/>;
    }

    private static renderScore(score: number | undefined, maxScore: number) {
        if (!score) {
            return null;
        }
        const width = (score / maxScore) * 100;
        const roundedScore = Math.round(score * 1000) / 1000;   // Round score to 3 decimal positions
        return <div className="search-result-score-container" title={roundedScore.toString()}>
            <div className="search-result-score-bar" style={{width: width + "px"}}/>
        </div>;
    }
}

export default injectIntl(withI18n(SearchResults));
