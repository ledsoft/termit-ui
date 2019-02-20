import * as React from "react";
import {injectIntl} from "react-intl";
import {default as withI18n, HasI18n} from "../../hoc/withI18n";
import TermItState from "../../../model/TermItState";
import {connect} from "react-redux";
import {Table} from "reactstrap";
import VocabularyLink from "../../vocabulary/VocabularyLink";
import Vocabulary, {VocabularyData} from "../../../model/Vocabulary";
import Term from "../../../model/Term";
import TermLink from "../../term/TermLink";
import Utils from "../../../util/Utils";

interface Props extends HasI18n {
    data: object
}

export class FacetedSearchResult extends React.Component<Props> {

    private static getLabel(o: any) {
        return o.nazev ? o.nazev : o.id;
    }

    private static asTerm(item: any) {
        return new Term({
            iri: item.id,
            label: FacetedSearchResult.getLabel(item),
            vocabulary: {
                iri: item.slovnik.id,
                label: FacetedSearchResult.getLabel(item.slovnik)
            }
        });
    }

    public render() {
        return <Table>
            <thead>
            <tr>
                <th>{this.props.i18n("search.pojem")}</th>
                <th>{this.props.i18n("search.informace")}</th>
                <th>{this.props.i18n("search.slovnik")}</th>
            </tr>
            </thead>
            <tbody>
            {this.renderRows()}
            </tbody>
        </Table>;
    }

    private renderRows() {
        return ((this.props.data as any).data || []).map((pojem: any) => {
            const t: Term = FacetedSearchResult.asTerm(pojem);
            return <tr key={t.iri} className="m-faceted-search-result-row">
                <td style={{width: "20%"}}>
                    <TermLink term={t}/>
                </td>
                <td style={{width: "50%"}}>
                    {pojem.nadtyp &&
                    <p>
                        <span style={{fontWeight: "bold"}}>{this.props.i18n("search.je-specializaci")}</span>
                        &nbsp;
                        {(Utils.sanitizeArray(pojem.nadtyp)).map(
                            (nt: any) => <TermLink key={t.iri + nt.id}
                                                   term={FacetedSearchResult.asTerm(Object.assign({}, nt, {slovnik: pojem.slovnik}))}/>)}
                    </p>}

                    {pojem.definice && <p style={{fontStyle: "italic"}}>☛ {pojem.definice}</p>}

                </td>
                <td><VocabularyLink vocabulary={new Vocabulary(t.vocabulary! as VocabularyData)}/></td>
            </tr>
        });
    }
}

export default connect((state: TermItState) => {
    return {
        data: state.facetedSearchResult
    };
})(injectIntl(withI18n(FacetedSearchResult)));