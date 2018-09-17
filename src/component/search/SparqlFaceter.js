import * as React from "react";
import * as angular from "angular";
import * as seco from "./semantic-faceted-search/semantic-faceted-search";

// import * as query from 'raw-loader!./sparql.rq';
import queryx from './sparql.json';

// const endpointUrlX = 'http://localhost/termit-repo';
// http://localhost:18188/rdf4j-server/repositories/termit';
const endpointUrlX = 'https://slovník.gov.cz/sparql';
const langX='cs';

function getSparqlQuery(lang) {
    const query = queryx.query;
    return query.replace("?lang","'"+lang+"'");
}

class SparqlFaceter extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            reload:true
        };
    }

    MainController($scope, FacetHandler, service, facetUrlStateHandlerService) {
        var vm = this;

        var updateId = 0;

        vm.lang = langX;

        // page is the current page of results.
        vm.page = [];
        vm.pageNo = 0;
        vm.getPage = getPage;
        vm.makeArray = makeArray;
        vm.setLang = setLang;
        vm.i18n = i18n;

        vm.disableFacets = disableFacets;
        $scope.isArray = angular.isArray;
        // Listen for the facet events
        // This event is triggered when a facet's selection has changed.
        $scope.$on('sf-facet-constraints', updateResults);
        // This is the initial configuration event
        var initListener = $scope.$on('sf-initial-constraints', function (event, cons) {
            updateResults(event, cons);
            // Only listen once, then unregister
            initListener();
        });

        $scope.getLabel = (o) => o.nazev ? o.nazev : o.id;

        // Get the facet configurations from dbpediaService.
        vm.facets = service.getFacets();
        // Initialize the facet handler
        vm.handler = new FacetHandler(getFacetOptions(vm.lang));

        function setLang(lang) {
            vm.lang = lang;
            updateResults(null, vm.facetSelections);
            vm.facets = service.getFacets();
            vm.handler = new FacetHandler(getFacetOptions(vm.lang));
        }

        // Disable the facets while reusults are being retrieved.
        function disableFacets() {
            return vm.isLoadingResults;
        }

        // Setup the FacetHandler options.
        function getFacetOptions() {
            var options = service.getFacetOptions(vm.lang);
            options.scope = $scope;

            // Get initial facet values from URL parameters (refresh/bookmark) using facetUrlStateHandlerService.
            options.initialState = facetUrlStateHandlerService.getFacetValuesFromUrlParams();
            return options;
        }


        // Get results based on facet selections (each time the selections change).
        function updateResults(event, facetSelections) {
            vm.facetSelections = facetSelections;
            // As the facets are not locked while the results are loading,
            // this function may be called again before the results have been
            // retrieved. This creates a race condition where the later call
            // may return before the first one, which leads to an inconsistent
            // state once the first returns. To avoid this we'll have a counter
            // that is incremented each time update is called, and we'll abort
            // the update if the counter has been incremented before it finishes.
            var uid = ++updateId;
            // As the user can also change the page via pagination, and introduce
            // a race condition that way, we'll want to discard any pending
            // page changes if a facet value changes. So set a boolean flag for
            // this purpose.
            vm.lock = true;
            // This variable is used to disable page selection, and display the
            // spinner animation.
            vm.isLoadingResults = true;

            // Update the URL parameters based on facet selections
            facetUrlStateHandlerService.updateUrlParams(facetSelections);

            // The dbpediaService returns a (promise of a) pager object.
            return service.getResults(facetSelections, vm.lang)
                .then(function (pager) {
                    if (uid === updateId) {
                        vm.pager = pager;
                        vm.totalCount = pager.totalCount;
                        vm.pageNo = 1;
                        getPage(uid).then(function () {
                            vm.lock = false;
                            return vm.page;
                        });
                    }
                });
        }

        // Get a page of mapped objects.
        // Angular-UI pagination handles the page number changes.
        function getPage(uid) {
            vm.isLoadingResults = true;
            // Get the page.
            // (The pager uses 0-indexed pages, whereas Angular-UI pagination uses 1-indexed pages).
            return vm.pager.getPage(vm.pageNo - 1).then(function (page) {
                // Check if it's ok to change the page
                if (!vm.lock || (uid === updateId)) {
                    vm.page = page;
                    vm.isLoadingResults = false;
                }
            }).catch(function (error) {
                vm.error = error;
                vm.isLoadingResults = false;
            });
        }

        function makeArray(val) {
            return angular.isArray(val) ? val : [val];
        }

        function i18n(l) {
            const ai18n = {
                'glosar': {
                    'cs': 'Glosář',
                    'en': 'Glossary'
                },
                'informace': {
                    'cs': 'Informace',
                    'en': 'Information'
                },
                'je-instanci-typu': {
                    'cs': 'je instancí typu',
                    'en': 'has type'
                },
                'je-specializaci': {
                    'cs': 'je specializací',
                    'en': 'specializes'
                },
                'ma-vlastnosti-typu': {
                    'cs': 'má vlastnosti typu',
                    'en': 'has intrinsic trope types'
                },
                'ma-vztahy-typu': {
                    'cs': 'má vztahy typu',
                    'en': 'has relation types'
                },
                'pojem': {
                    'cs': 'Pojem',
                    'en': 'Term'
                },
                'prohlizec-semantickeho-slovniku-pojmu': {
                    'cs': 'Prohlížeč sémantického slovníku pojmů',
                    'en': 'Semantic Government Vocabulary Explorer'
                },
            };
            return ai18n[l][vm.lang];
        }
    }

    service(FacetResultHandler) {

        /* Public API */

        // Get the results from DBpedia based on the facet selections.
        this.getResults = getResults;
        // Get the facet definitions.
        this.getFacets = getFacets;
        // Get the facet options.
        this.getFacetOptions = getFacetOptions;

        // Get the facet options.

        // Facet definitions
        // 'facetId' is a "friendly" identifier for the facet,
        //  and should be unique within the set of facets.
        // 'predicate' is the property that defines the facet (can also be
        //  a property path, for example).
        // 'name' is the title of the facet to show to the user.
        // If 'enabled' is not true, the facet will be disabled by default.
        var facets = {
            // Text search facet for names
            glosar: {
                enabled: true,
                facetId: 'glosar',
//                predicate:'<http://www.w3.org/2004/02/skos/core#inScheme>/<http://www.w3.org/2000/01/rdf-schema#label>',
                name: 'Glosář',
                predicate: '<http://www.w3.org/2004/02/skos/core#inScheme>',
            },
            pojem: {
                enabled: true,
                facetId: 'pojem',
                name: 'Pojem',
                predicate: '<http://www.w3.org/2004/02/skos/core#prefLabel>',
            },
            typ: {
                enabled: true,
                facetId: 'typ',
                name: 'Typ',
                predicate: 'a',
            },
        };

        var endpointUrl = endpointUrlX;
        var rdfClass = '<http://www.w3.org/2004/02/skos/core#Concept>';

        // The facet configuration also accept a 'constraint' option.
        // The value should be a valid SPARQL pattern.
        // One could restrict the results further, e.g., to writers in the
        // science fiction genre by using the 'constraint' option:
        //
        // var constraint = '?id <http://dbpedia.org/ontology/genre> <http://dbpedia.org/resource/Science_fiction> .';
        //
        // Note that the variable representing a result in the constraint should be "?id".
        //
        // 'rdfClass' is just a shorthand constraint for '?id a <rdfClass> .'
        // Both rdfClass and constraint are optional, but you should define at least
        // one of them, or you might get bad results when there are no facet selections.
        var facetOptions = {
            endpointUrl: endpointUrl, // required
            // constraint: constraint, // optional, not used in this demo
            preferredLang: null, // required
            rdfClass: rdfClass // optional
        };

        var prefixes =
            ' PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>' +
            ' PREFIX skos: <http://www.w3.org/2004/02/skos/core#>' +
            ' PREFIX zs: <https://slovník.gov.cz/základní/pojem/>' +
            ' PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#type>';

        var resultOptions = {
            pagesPerQuery: 1, // optional (default is 1)
            paging: true, // optional (default is true), if true, enable paging of the results
            prefixes: prefixes, // required if the queryTemplate uses prefixes
            queryTemplate: null, // required
            resultsPerPage: 1, // optional (default is 10)
        };

        // FacetResultHandler is a service that queries the endpoint with
        // the query and maps the results to objects.
        //     var resultHandler = new FacetResultHandler(endpointUrl, resultOptions);

        function getQueryTemplate(lang) {
            // This is the result query, with <RESULT_SET> as a placeholder for
            // the result set subquery that is formed from the facet selections.
            // The variable names used in the query will be the property names of
            // the reusulting mapped objects.
            // Note that ?id is the variable used for the result resource here,
            // as in the constraint option.
            // Variable names with a '__' (double underscore) in them will results in
            // an object. I.e. here ?work__id, ?work__label, and ?work__link will be
            // combined into an object:
            // writer.work = { id: '[work id]', label: '[work label]', link: '[work link]' }
            const x = getSparqlQuery(lang);
            return x;
        }


        // This function receives the facet selections from the controller
        // and gets the results from DBpedia.
        // Returns a promise.
        function getResults(facetSelections, lang) {
            // If there are variables used in the constraint option (see above),
            // you can also give getResults another parameter that is the sort
            // order of the results (as a valid SPARQL ORDER BY sequence, e.g. "?id").
            // The results are sorted by URI (?id) by default.

            resultOptions.queryTemplate = getQueryTemplate(lang);

            var resultHandler = new FacetResultHandler(endpointUrl, resultOptions);


            return resultHandler.getResults(facetSelections).then(function (pager) {
                // We'll also query for the total number of results, and load the
                // first page of results.
                return pager.getTotalCount().then(function (count) {
                    pager.totalCount = count;
                    return pager;
                }).then(function () {
                    return pager;
                });
            });
        }

        // Getter for the facet definitions.
        function getFacets() {
            return facets;
        }

        // Getter for the facet options.
        function getFacetOptions(lang) {
            facetOptions.preferredLang = lang;
            return facetOptions;
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
       this.x(prevProps.lang !== this.props.lang);
    }

x(change) {
    if (this.$rootScope) {
        this.$rootScope.$destroy();
    }

    angular.module('facetApp', ['seco.facetedSearch'])
        .config(['$provide', function ($provide) {
            $provide.decorator('$browser', ['$delegate', function ($delegate) {
                $delegate.onUrlChange = function () {
                    ;
                };
                $delegate.url = function () {
                    return ""
                };
                return $delegate;
            }]);
        }])
        .controller('MainController', this.MainController)
        .service('service', this.service);

    // var injector = angular.injector(['ng', 'facetApp']);
    // var $compile = injector.get('$compile');
    // var $rootScope = injector.get('$rootScope');
    // $compile(this.$el)($rootScope);
    // $rootScope.$apply();
    // this.$rootScope = angular.injector(['ng', 'facetApp']).get('$rootScope');

    if (change) {
        // this.setState({lang : prevProps.lang});
        this.setState({reload : !this.state.reload});
    }
}

    componentDidMount() {
        this.x(true)
        angular.bootstrap(this.container, ['facetApp']);
    }

    render() {
        const html = this.state.reload+`
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
        <img src="images/loading-lg.gif" ng-show="vm.isLoadingResults" />
        <table class="table">
          <thead>
            <tr>
              <th>{{vm.i18n('pojem')}}</th>
              <th>{{vm.i18n('informace')}}</th>
              <th>{{vm.i18n('glosar')}}</th>
            </tr>
          </thead>
          <tbody>
            <tr ng-repeat="pojem in vm.page">              
              <td style="width:20%">
                <p ng-if="pojem">
                  <a ng-href="{{ pojem.id }}">{{ getLabel(pojem) }}</a> 
                </p>             
              </td>
              <td style="width:50%">

                <p ng-if="pojem.nadtyp">
                {{vm.i18n('je-specializaci')}} <span ng-repeat="nadtyp in (isArray(pojem.nadtyp) ? pojem.nadtyp : [pojem.nadtyp])"><a ng-href="{{ nadtyp.id }}">{{ getLabel(nadtyp)}}</a><span ng-if="!$last">,&nbsp;</span></span></p>

                <p ng-if="pojem.typ">
                {{vm.i18n('je-instanci-typu')}} <span ng-repeat="typ in (isArray(pojem.typ) ? pojem.typ : [pojem.typ])"><a ng-href="{{ typ.id }}">{{ getLabel(typ)}}</a><span ng-if="!$last">,&nbsp;</span></span>
                </p>

                <p ng-if="pojem.definice" style="font-style:italic">
                ☛ {{pojem.definice}}
                </p>

                </p>
                <p ng-if="pojem.typvlastnosti">
                  {{vm.i18n('ma-vlastnosti-typu')}}
                 	<ul ng-if="pojem.typvlastnosti">
              			<li ng-repeat="typvlastnosti in vm.makeArray(pojem.typvlastnosti)">
            			    <a ng-href="{{ typvlastnosti.id }}">{{ getLabel(typvlastnosti) }}</a>
              			</li>
            			</ul>
                </p>

            		<p ng-if="pojem.typvztahu">
                  {{vm.i18n('ma-vztahy-typu')}}
                 	<ul ng-if="pojem.typvztahu">
              			<li ng-repeat="typvztahu in vm.makeArray(pojem.typvztahu)">
            			    <a ng-href="{{ typvztahu.id }}">{{ getLabel(typvztahu) }}</a>
              			</li>
              		</ul>
                </p>
              </td>
              <td>
                 <a ng-href="{{ pojem.glosar.id }}">{{ getLabel(pojem.glosar) }}</a>
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
        return (<div ng-app="facetApp" ref={c => this.container = c} dangerouslySetInnerHTML={{__html: html}}/>);
    }
}

export default SparqlFaceter;