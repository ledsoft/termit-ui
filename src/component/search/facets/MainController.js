export default (endpointUrl, resultOptions, facets, facetOptions, fireQueryRequested, fireQueryFinished, fireQueryFailed) => {
    return function MainController($scope, FacetHandler, FacetResultHandler, facetUrlStateHandlerService) {
        const vm = this;

        var updateId = 0;

        // page is the current page of results.
        vm.page = [];
        vm.pageNo = 0;

        // Listen for the facet events
        // This event is triggered when a facet's selection has changed.
        $scope.$on('sf-facet-constraints', updateResults);
        // This is the initial configuration event
        var initListener = $scope.$on('sf-initial-constraints', function (event, cons) {
            updateResults(event, cons);
            // Only listen once, then unregister
            initListener();
        });

        vm.facets = facets;

        // Initialize the facet handler
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
        const options = facetOptions;
        options.scope = $scope;
        // Get initial facet values from URL parameters (refresh/bookmark) using facetUrlStateHandlerService.
        options.initialState = facetUrlStateHandlerService.getFacetValuesFromUrlParams();
        vm.handler = new FacetHandler(options);

        // Get results based on facet selections (each time the selections change).
        function updateResults(event, facetSelections) {
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
            fireQueryRequested();

            // Update the URL parameters based on facet selections
            facetUrlStateHandlerService.updateUrlParams(facetSelections);

            return new FacetResultHandler(endpointUrl, resultOptions)
                .getResults(facetSelections)
                .then((pager) =>
                    // We'll also query for the total number of results, and load the
                    // first page of results.
                    pager.getTotalCount()
                        .then((count) => {
                            pager.totalCount = count;
                            return pager;
                        })
                )
                .then((pager) => {
                    if (uid === updateId) {
                        vm.pager = pager;
                        vm.totalCount = pager.totalCount;
                        vm.pageNo = 1;
                        fireQueryRequested();
                        // Get the page.
                        // (The pager uses 0-indexed pages, whereas Angular-UI pagination uses 1-indexed pages).
                        return vm.pager.getPage(vm.pageNo - 1).then((page) => {
                            // Check if it's ok to change the page
                            if (!vm.lock || (uid === updateId)) {
                                vm.page = page;
                                fireQueryFinished(page);
                            }
                            vm.lock = false;
                        }).catch((error) => {
                            fireQueryFailed(error);
                        });
                    }
                });
        }
    }
}
