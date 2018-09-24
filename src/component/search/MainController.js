
export default (lang, ai18n, endpointUrl, query) => {
    return function MainController($scope, FacetHandler, FacetResultHandler, facetUrlStateHandlerService) {
        const vm = this;

        var updateId = 0;

        vm.lang = lang;

        // page is the current page of results.
        vm.page = [];
        vm.pageNo = 0;
        vm.getPage = getPage;
        vm.makeArray = makeArray;

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


        // Facet definitions
        // 'facetId' is a "friendly" identifier for the facet,
        //  and should be unique within the set of facets.
        // 'predicate' is the property that defines the facet (can also be
        //  a property path, for example).
        // 'name' is the title of the facet to show to the user.
        // If 'enabled' is not true, the facet will be disabled by default.
        vm.facets = {
            // Text search facet for names
            glosar: {
                enabled: true,
                facetId: 'glosar',
//                predicate:'<http://www.w3.org/2004/02/skos/core#inScheme>/<http://www.w3.org/2000/01/rdf-schema#label>',
                name: ai18n('search.slovnik'),
                predicate: '<http://www.w3.org/2004/02/skos/core#inScheme>/^<http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/ma-glosar>',
            },

            pojem: {
                enabled: true,
                facetId: 'pojem',
                name: ai18n('search.pojem'),
                // SGoV <http://www.w3.org/2004/02/skos/core#prefLabel>|
                predicate: '<http://www.w3.org/2000/01/rdf-schema#label>',
            },
            typ: {
                enabled: true,
                facetId: 'typ',
                name: ai18n('search.typ'),
                predicate: 'a',
            },
        };

        // Initialize the facet handler
        vm.handler = new FacetHandler(getFacetOptions(vm.lang));

        // Disable the facets while reusults are being retrieved.
        function disableFacets() {
            return vm.isLoadingResults;
        }

        // Get the facet options.
        // Setup the FacetHandler options.
        function getFacetOptions() {
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
            const options = {};
            options.rdfClass = '<http://www.w3.org/2004/02/skos/core#Concept>';
            options.endpointUrl = endpointUrl;
            options.preferredLang = lang;
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
            // This function receives the facet selections from the controller
            // and gets the results from DBpedia.
            // Returns a promise.
            const serviceGetResults = (endpointUrlX, facetSelectionsX) => {
                // If there are variables used in the constraint option (see above),
                // you can also give getResults another parameter that is the sort
                // order of the results (as a valid SPARQL ORDER BY sequence, e.g. "?id").
                // The results are sorted by URI (?id) by default.
                var prefixes =
                    ' PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>' +
                    ' PREFIX skos: <http://www.w3.org/2004/02/skos/core#>' +
                    ' PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#type>'+
                    ' PREFIX zs: <https://slovník.gov.cz/základní/pojem/>' +
                    ' PREFIX a-popis-dat: <http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/>';

                const resultOptions = {
                    pagesPerQuery: 1, // optional (default is 1)
                    paging: true, // optional (default is true), if true, enable paging of the results
                    prefixes: prefixes, // required if the queryTemplate uses prefixes
                    queryTemplate: query, // required
                    resultsPerPage: 500, // optional (default is 10)
                };

                var resultHandler = new FacetResultHandler(endpointUrlX, resultOptions);


                return resultHandler.getResults(facetSelectionsX).then(function (pager) {
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

            return serviceGetResults(endpointUrl, facetSelections, vm.lang)
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
    }
}
