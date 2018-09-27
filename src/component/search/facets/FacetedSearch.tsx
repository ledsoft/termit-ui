import * as React from "react";
import * as angular from "angular";
import {injectIntl} from "react-intl";
import {default as withI18n, HasI18n} from "../../hoc/withI18n";
import TermItState from "../../../model/TermItState";
import {connect} from "react-redux";
import {selectVocabularyTerm} from "../../../action/SyncActions";
import Constants from "../../../util/Constants";
import "./semantic-faceted-search/semantic-faceted-search";

import loadingLg from './images/loading-lg.gif';
import controllerCreator from './MainController';
import query from './sparql.rq';
import {ThunkDispatch} from "../../../util/Types";

interface Props extends HasI18n {
    lang: string,
    endpointUrl: string,
}

interface State {
    rootScope: any,
}

interface State2 {
    component: JSX.Element | null
}

/**
 * This component only helps to reinitialize Angular by throwing away the whole react component and mounting it back.
 */
class SearchWrapper extends React.Component<Props, State2> {
    constructor(props: Props) {
        super(props);
        this.state = {
            component: null
        };
    }

    public componentDidMount() {
        this.change(true);
    }

    public componentDidUpdate(prevProps: Props) {
        this.change(prevProps.lang !== this.props.lang);
    }

    private change(changed: boolean) {
        if (changed) {
            this.setState({
                component: null
            });
        } else if (this.state.component == null) {
            this.setState({
                component: <Search lang={this.props.lang}
                                   endpointUrl={this.props.endpointUrl}
                                   i18n={this.props.i18n}
                                   formatMessage={this.props.formatMessage}/>
            });
        }
    }

    public render() {
        return this.state.component;
    }
}


export class Search extends React.Component<Props, State> {

    private container: any;

    constructor(props: Props) {
        super(props);
        this.state = {
            rootScope: null,
        };
    }

    private getSparqlQuery(lang: string) {
        return query.replace(/\?lang/g, "'" + lang + "'");
    }

    private runAngular() {
        const controller = controllerCreator(
            this.props.lang,
            this.props.i18n,
            this.props.endpointUrl,
            this.getSparqlQuery(this.props.lang),
            this.getFacets(),
            this.getFacetOptions());
        // https://docs.angularjs.org/guide/di#inline-array-annotation
        controller.$inject = ['$scope', 'FacetHandler', 'FacetResultHandler', 'facetUrlStateHandlerService'];
        angular.module('facetApp', ['seco.facetedSearch'])
            .config(['$provide', ($provide: any) => {
                $provide.decorator('$browser', ['$delegate', ($delegate: any) => {
                    $delegate.onUrlChange = () => {
                        ;
                    };
                    $delegate.url = () => {
                        return ""
                    };
                    return $delegate;
                }]);
            }])
            .controller('MainController', controller);
    }

    private destroyAngular() {
        if (this.state.rootScope) {
            this.state.rootScope.$destroy();
        }
    }

    public componentWillUpdate() {
        this.runAngular();
    }

    private getFacets() {
        // Facet definitions
        // 'facetId' is a "friendly" identifier for the facet,
        //  and should be unique within the set of facets.
        // 'predicate' is the property that defines the facet (can also be
        //  a property path, for example).
        // 'name' is the title of the facet to show to the user.
        // If 'enabled' is not true, the facet will be disabled by default.
        return {
            // Text search facet for names
            glosar: {
                enabled: true,
                facetId: 'glosar',
                predicate: '(^skos:narrower)*/<http://www.w3.org/2004/02/skos/core#inScheme>/^<http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/ma-glosar>',
                name: this.props.i18n('search.slovnik'),
            },

            pojem: {
                enabled: true,
                facetId: 'pojem',
                name: this.props.i18n('search.pojem'),
                predicate: '<http://www.w3.org/2000/01/rdf-schema#label>',
            },
            typ: {
                enabled: true,
                facetId: 'typ',
                name: this.props.i18n('search.typ'),
                predicate: 'a',
            },
        };
    }

    private getFacetOptions() {
        return {
            rdfClass: '<http://www.w3.org/2004/02/skos/core#Concept>',
            endpointUrl: this.props.endpointUrl,
            preferredLang: this.props.lang
        }
    }

    public componentDidMount() {
        this.runAngular();
        angular.bootstrap(this.container, ['facetApp']);
        const injector = angular.injector(['ng', 'facetApp']);
        this.setState({
            rootScope: injector.get('$rootScope')
        });
    }

    public componentWillUnmount() {
        this.destroyAngular();
    }

    public render() {
        const html = `
  <div class="container-fluid" ng-controller="MainController as vm">
   <div class="row">
      <div class="col-md-12">
        <div ng-if="vm.error">
          <uib-alert type="danger">{{ vm.error }}</uib-alert>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-3">
        <!-- Facets are defined here using the configurations defined in the controller -->
        <seco-text-facet data-options="vm.facets.pojem"></seco-text-facet>
        <seco-basic-facet data-options="vm.facets.glosar"></seco-basic-facet>
        <seco-basic-facet data-options="vm.facets.typ"></seco-basic-facet>
      </div>
      <!-- Results view -->
      <div class="col-md-9">
        <img src="` + loadingLg + `" ng-show="vm.isLoadingResults" />
        <table class="table">
          <thead class="thead-light">
            <tr>
              <th>` + this.props.i18n('search.pojem') + `</th>
              <th>` + this.props.i18n('search.informace') + `</th>
              <th>` + this.props.i18n('search.slovnik') + `</th>
            </tr>
          </thead>
          <tbody>   
            <tr ng-repeat="pojem in vm.page">              
              <td style="width:20%">
                <p ng-if="pojem">{{ getLabel(pojem) }}<a ng-href="{{ pojem.id }}">↱</a></p>             
              </td>
              <td style="width:50%">

                <p ng-if="pojem.nadtyp"><span style="font-weight: bold">` + this.props.i18n('search.je-specializaci') + `</span> <span ng-repeat="nadtyp in (isArray(pojem.nadtyp) ? pojem.nadtyp : [pojem.nadtyp])">{{ getLabel(nadtyp)}}<a ng-href="{{ nadtyp.id }}">↱</a><span ng-if="!$last">,&nbsp;</span></span></p>

                <p ng-if="pojem.typ">` + this.props.i18n('search.je-instanci-typu') + ` <span ng-repeat="typ in (isArray(pojem.typ) ? pojem.typ : [pojem.typ])">{{ getLabel(typ)}}<a ng-href="{{ typ.id }}">↱</a><span ng-if="!$last">,&nbsp;</span></span>
                </p>

                <p ng-if="pojem.definice" style="font-style:italic">
                ☛ {{pojem.definice}}
                </p>

                </p>
                <p ng-if="pojem.typvlastnosti">
                ` + this.props.i18n('search.ma-vlastnosti-typu') + `
                 	<ul ng-if="pojem.typvlastnosti">
              			<li ng-repeat="typvlastnosti in vm.makeArray(pojem.typvlastnosti)">
            			    <a ng-href="{{ typvlastnosti.id }}">{{ getLabel(typvlastnosti) }}</a>
              			</li>
            			</ul>
                </p>

            		<p ng-if="pojem.typvztahu">
                ` + this.props.i18n('search.ma-vztahy-typu') + `
                 	<ul ng-if="pojem.typvztahu">
              			<li ng-repeat="typvztahu in vm.makeArray(pojem.typvztahu)">
            			    <a ng-href="{{ typvztahu.id }}">{{ getLabel(typvztahu) }}</a>
              			</li>
              		</ul>
                </p>
              </td>
              <td>
                 <a ng-href="{{ pojem.slovnik.link }}">{{ getLabel(pojem.slovnik) }}</a>
                 <a ng-href="{{ pojem.slovnik.id }}">↱</a>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- Pagination -->
        <uib-pagination
          class="pagination-sm"
          max-size="10"
          boundary-links="true"
          rotate="false"
          total-items="vm.totalCount"
          ng-model="vm.pageNo"
          ng-disabled="vm.isLoadingResults"
          ng-change="vm.getPage()">
        </uib-pagination>
      </div>
    </div>
</div>`;
        return (
            <div ref={c => this.container = c}
                 dangerouslySetInnerHTML={{__html: html}}/>
        );
    }
}

export default connect((state: TermItState) => {
    return {
        lang: state.intl.locale,
        endpointUrl: Constants.endpoint_url
    };
}, (dispatch: ThunkDispatch) => {
    return {
        selectVocabularyTerm: (selectedTerm: any) => dispatch(selectVocabularyTerm(selectedTerm))
    };
})(injectIntl(withI18n(SearchWrapper)));