import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../../hoc/withI18n";
import SearchResult from "../../../model/SearchResult";
import {Button, Label, Table} from "reactstrap";
import VocabularyUtils from "../../../util/VocabularyUtils";
import VocabularyBadge from "../../badge/VocabularyBadge";
import TermBadge from "../../badge/TermBadge";
import Routing from "../../../util/Routing";
import Routes from "../../../util/Routes";
import FTSSnippetText from "./FTSSnippetText";

const MULTIPLE_FIELDS_MATCH_FACTOR = 1.33;

interface SearchResultsProps extends HasI18n {
    results: SearchResult[];
}

function scoreSort(a: SearchResult, b: SearchResult) {
    if (a.score && b.score) {
        return b.score - a.score;
    } else {
        return a.score ? a.score : b.score ? b.score : 0;
    }
}

export class SearchResults extends React.Component<SearchResultsProps> {

    private onItemClick = (item: SearchResult) => {
        const iri = VocabularyUtils.create(item.iri);
        if (item.hasType(VocabularyUtils.VOCABULARY)) {
            Routing.transitionTo(Routes.vocabularySummary, {
                params: new Map([["name", iri.fragment]]),
                query: new Map([["namespace", iri.namespace!]])
            });
        } else {
            const vocabularyIri = VocabularyUtils.create(item.vocabulary!);
            Routing.transitionTo(Routes.vocabularyTermDetail, {
                params: new Map([["name", vocabularyIri.fragment], ["termName", iri.fragment]]),
                query: new Map([["namespace", vocabularyIri.namespace!]])
            });
        }
    };

    public render() {
        const i18n = this.props.i18n;
        if (this.props.results.length === 0) {
            return <Label className="italics">{i18n("main.search.no-results")}</Label>;
        }
        return <Table>
            <thead>
            <tr>
                <th className="col-xs-1">{i18n("search.typ")}</th>
                <th className="col-xs-3">{i18n("search.results.table.label")}</th>
                <th className="col-xs-4">{i18n("search.results.table.match")}</th>
                <th className="col-xs-3">{i18n("search.results.table.field")}</th>
                <th className="col-xs-1 text-center">{i18n("search.results.table.score")}</th>
            </tr>
            </thead>
            <tbody>
            {this.renderResults()}
            </tbody>
        </Table>;
    }

    private renderResults() {
        const items = SearchResults.mergeDuplicates(this.props.results);
        const maxScore = SearchResults.calculateMaxScore(items);
        return items.map(r => {
            return <tr key={r.iri}>
                <td className="align-middle search-result-type">{SearchResults.renderTypeBadge(r)}</td>
                <td className="align-middle search-result-label"><Button color="link"
                                                                         title={this.props.i18n("search.results.table.label.tooltip")}
                                                                         className="search-result-assetlink"
                                                                         onClick={this.onItemClick.bind(null, r)}>{r.label}</Button>
                </td>
                <td className="align-middle search-result-match"><FTSSnippetText text={r.snippetText}/></td>
                <td className="align-middle search-result-field">{r.snippetField}</td>
                <td className="align-middle text-center search-result-score">
                    {SearchResults.renderScore(r.score, maxScore)}
                </td>
            </tr>;
        });
    }

    private static mergeDuplicates(results: SearchResult[]) {
        const map = new Map<string, SearchResult>();
        results.forEach(r => {
            if (!map.has(r.iri)) {
                map.set(r.iri, r);
            } else {
                const existing = map.get(r.iri)!;
                let score = existing.score ? existing.score! + r.score! : undefined;
                let snippetText = existing.snippetText;
                let snippetField = existing.snippetField;
                if (existing.snippetField !== r.snippetField) {
                    snippetField += "; " + r.snippetField;
                    snippetText += "; " + r.snippetText;
                    score = score ? score * MULTIPLE_FIELDS_MATCH_FACTOR : score;
                }
                const copy = new SearchResult({
                    iri: r.iri,
                    label: r.label,
                    snippetText,
                    snippetField,
                    vocabulary: existing!.vocabulary ? {iri: existing!.vocabulary!} : undefined,
                    score,
                    types: r.types
                });
                map.set(r.iri, copy);
            }
        });
        const arr = Array.from(map.values());
        arr.sort(scoreSort);
        return arr;
    }

    private static calculateMaxScore(results: SearchResult[]) {
        return results.reduce((accumulator, item) => item.score && item.score > accumulator ? item.score : accumulator, 0.0);
    }

    private static renderScore(score: number | undefined, maxScore: number) {
        if (!score) {
            return null;
        }
        const width = (score / maxScore) * 100;
        return <div className="search-result-score-container" title={score.toString()}>
            <div className="search-result-score-bar" style={{width: width + "px"}}/>
        </div>;
    }

    private static renderTypeBadge(item: SearchResult) {
        return item.hasType(VocabularyUtils.VOCABULARY) ? <VocabularyBadge/> : <TermBadge/>;
    }
}

export default injectIntl(withI18n(SearchResults));