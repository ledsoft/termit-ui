import * as React from "react";
import {injectIntl} from "react-intl";
import {default as withI18n, HasI18n} from "../../hoc/withI18n";
import TermItState from "../../../model/TermItState";
import {connect} from "react-redux";
import {Row, Table} from "reactstrap";
import VocabularyLink from "../../vocabulary/VocabularyLink";
import Vocabulary from "../../../model/Vocabulary";

interface Props extends HasI18n {
    data: object
}

export class FacetedSearchResult extends React.Component<Props> {

    private getLabel(o: any) {
        return o.nazev ? o.nazev : o.id;
    }

    public render() {
        const rows: Row[] =
            ((this.props.data as any).data || []).map((pojem: any) =>
                <tr key={pojem.id}>
                    <td style={{width: '20%'}}>
                        <p>{this.getLabel(pojem)}<a href={pojem.id}>↱</a></p>
                    </td>
                    <td style={{width: '50%'}}>
                        {pojem.nadtyp ?
                            <p><span style={{fontWeight: 'bold'}}>{this.props.i18n('search.je-specializaci')}</span>
                                {(Array.isArray(pojem.nadtyp) ? pojem.nadtyp : [pojem.nadtyp]).map(
                                    (nt: any) =>
                                        <span key={pojem.id+''+nt.id}> {this.getLabel(nt)}
                                            <a href={nt.id}>↱</a>
                                        </span>
                                )}
                            </p> : <span/>}

                        {/*<p ng-if="pojem.typ">{this.props.i18n('search.je-instanci-typu')}*/}
                        {/*<span ng-repeat="typ in (isArray(pojem.typ) ? pojem.typ : [pojem.typ])">{ getLabel(typ)}*/}
                        {/*<a ng-href="{ typ.id }">↱</a><span ng-if="!$last">,&nbsp;</span></span>*/}
                        {/*</p>*/}

                        {pojem.definice ? <p style={{fontStyle: 'italic'}}>
                            ☛ {pojem.definice}
                        </p> : <span/>}

                        {/*</p>*/}
                        {/*<p ng-if="pojem.typvlastnosti">*/}
                        {/*{this.props.i18n('search.ma-vlastnosti-typu')}*/}
                        {/*<ul ng-if="pojem.typvlastnosti">*/}
                        {/*<li ng-repeat="typvlastnosti in vm.makeArray(pojem.typvlastnosti)">*/}
                        {/*<a ng-href="{{ typvlastnosti.id }}">{ getLabel(typvlastnosti) }</a>*/}
                        {/*</li>*/}
                        {/*</ul>*/}
                        {/*</p>*/}

                        {/*<p ng-if="pojem.typvztahu">*/}
                        {/*{this.props.i18n('search.ma-vztahy-typu')}*/}
                        {/*<ul ng-if="pojem.typvztahu">*/}
                        {/*<li ng-repeat="typvztahu in vm.makeArray(pojem.typvztahu)">*/}
                        {/*<a ng-href="{{ typvztahu.id }}">{ getLabel(typvztahu) }</a>*/}
                        {/*</li>*/}
                        {/*</ul>*/}
                        {/*</p>*/}
                    </td>
                    <td><VocabularyLink
                        vocabulary={new Vocabulary({iri: pojem.slovnik.id, label:this.getLabel(pojem.slovnik)})}/></td>
                </tr>);

        return (
            <Table style={{width:'100%'}}>
                <thead>
                <tr>
                    <th>{this.props.i18n('search.pojem')}</th>
                    <th>{this.props.i18n('search.informace')}</th>
                    <th>{this.props.i18n('search.slovnik')}</th>
                </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </Table>);
    }
}

export default connect((state: TermItState) => {
    return {
        data: state.facetedSearchResult
    };
})(injectIntl(withI18n(FacetedSearchResult)));