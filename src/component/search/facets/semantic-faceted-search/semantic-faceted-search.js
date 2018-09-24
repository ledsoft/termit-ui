import _ from "lodash";
import * as sparql from "angular-paging-sparql-service";
import * as uibootstrap from "angular-bootstrap";
import * as angularSpinner from "angular-spinner";
import * as checklistModel from "checklist-model";
import "./bootstrap-part/css/bootstrap.css";
// import * as Chart from "chart.js";

(function() {
    'use strict';

    angular.module('seco.facetedSearch', [
        'sparql', 'ui.bootstrap', 'angularSpinner', 'checklist-model'//, 'chart.js'
    ])
    .constant('_', _) // eslint-disable-line no-undef
    .constant('PREFIXES',
        ' PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> ' +
        ' PREFIX skos: <http://www.w3.org/2004/02/skos/core#> ' +
        ' PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> '
    )
    .constant('EVENT_REQUEST_CONSTRAINTS', 'sf-request-constraints')
    .constant('EVENT_INITIAL_CONSTRAINTS', 'sf-initial-constraints')
    .constant('EVENT_FACET_CHANGED', 'sf-facet-changed')
    .constant('EVENT_FACET_CONSTRAINTS', 'sf-facet-constraints')
    .constant('NO_SELECTION_STRING', '-- No Selection --');
})();


(function() {

    'use strict';

    /* eslint-disable angular/no-service-method */
    facetUrlStateHandlerService.$inject = ['$location', '_'];
    angular.module('seco.facetedSearch')

    .service('facetUrlStateHandlerService', facetUrlStateHandlerService);

    function facetUrlStateHandlerService($location,__) {

        this.updateUrlParams = updateUrlParams;
        this.getFacetValuesFromUrlParams = getFacetValuesFromUrlParams;


        function updateUrlParams(facets) {
            facets = facets.facets || facets;
            var params = {};
            __(facets).forOwn(function(val, id) {
                if (val && val.value && !(__.isObject(val.value) && __.isEmpty(val.value))) {
                    params[id] = { value: val.value, constraint: val.constraint };
                }
            });
            if (__.isEmpty(params)) {
                params = null;
            } else {
                params = angular.toJson(params);
            }
            $location.search('facets', params);
        }


        function getFacetValuesFromUrlParams() {
            var res = {};

            var params = ($location.search() || {}).facets;
            if (!params) {
                return res;
            }
            try {
                params = angular.fromJson(params);
            }
            catch(e) {
                $location.search('facets', null);
                return res;
            }
            __.forOwn(params, function(val, id) {
                res[id] = val;
            });
            return res;
        }
    }
})();

(function() {
    'use strict';


    FacetResultHandler.$inject = ['_', 'DEFAULT_PAGES_PER_QUERY', 'DEFAULT_RESULTS_PER_PAGE', 'PREFIXES', 'AdvancedSparqlService', 'objectMapperService', 'QueryBuilderService'];
    angular.module('seco.facetedSearch')
    .constant('DEFAULT_PAGES_PER_QUERY', 1)
    .constant('DEFAULT_RESULTS_PER_PAGE', 10)


    .factory('FacetResultHandler', FacetResultHandler);


    function FacetResultHandler(__, DEFAULT_PAGES_PER_QUERY, DEFAULT_RESULTS_PER_PAGE,
            PREFIXES, AdvancedSparqlService, objectMapperService, QueryBuilderService) {

        return ResultHandler;


        function ResultHandler(endpointConfig, resultOptions) {
            // Default options
            var options = {
                mapper: objectMapperService,
                pagesPerQuery: DEFAULT_PAGES_PER_QUERY,
                paging: true,
                prefixes: PREFIXES,
                resultsPerPage: DEFAULT_RESULTS_PER_PAGE
            };
            options = angular.extend(options, resultOptions);

             this.getResults = getResults;

              var qryBuilder = new QueryBuilderService(options.prefixes);

            var endpoint = new AdvancedSparqlService(endpointConfig, options.mapper);


            function getResults(facetSelections, orderBy) {
                var constraints = facetSelections.constraint.join(' ');
                var qry = qryBuilder.buildQuery(options.queryTemplate, constraints, orderBy);

                if (options.paging) {
                    return endpoint.getObjects(qry.query, options.resultsPerPage, qry.resultSetQuery,
                        options.pagesPerQuery);
                } else {
                    return endpoint.getObjects(qry.query);
                }
            }
        }
    }
})();

(function() {
    'use strict';

    facetEndpoint.$inject = ['AdvancedSparqlService', 'facetMapperService'];
    angular.module('seco.facetedSearch')
    .service('facetEndpoint', facetEndpoint);


    function facetEndpoint(AdvancedSparqlService, facetMapperService) {

        this.getEndpoint = getEndpoint;

        function getEndpoint(config) {
            var endpointConfig = {
                endpointUrl: config.endpointUrl,
                headers: config.headers,
                usePost: config.usePost
            };
            return new AdvancedSparqlService(endpointConfig, config.mapper || facetMapperService);
        }
    }
})();

(function() {
    'use strict';


    facetMapperService.$inject = ['_', 'objectMapperService'];
    angular.module('seco.facetedSearch')

    .factory('facetMapperService', facetMapperService);


    function facetMapperService(__, objectMapperService) {
        FacetMapper.prototype.makeObject = makeObject;

        var proto = Object.getPrototypeOf(objectMapperService);
        FacetMapper.prototype = angular.extend({}, proto, FacetMapper.prototype);

        return new FacetMapper();

        function FacetMapper() {
            this.objectClass = Object;
        }

        function makeObject(obj) {
            var o = new this.objectClass();

            o.value = parseValue(obj.value);
            o.text = __.get(obj, 'facet_text.value');
            o.count = obj.cnt ? parseInt(obj.cnt.value,10) : undefined;

            return o;
        }

        function parseValue(value) {
            if (!value) {
                return undefined;
            }
            if (value.type === 'uri') {
                return '<' + value.value + '>';
            }
            if (__.includes(value.type, 'literal') && value.datatype === 'http://www.w3.org/2001/XMLSchema#integer') {
                return value.value;
            }
            if (__.includes(value.type, 'literal') && value.datatype) {
                return '"' + value.value + '"^^<' + value.datatype + '>';
            }
            return '"' + value.value + '"' + (value['xml:lang'] ? '@' + value['xml:lang'] : '');
        }

    }
})();

(function() {
    'use strict';


    FacetHandler.$inject = ['_', 'EVENT_FACET_CONSTRAINTS', 'EVENT_FACET_CHANGED', 'EVENT_REQUEST_CONSTRAINTS', 'EVENT_INITIAL_CONSTRAINTS'];
    angular.module('seco.facetedSearch')
    .factory('FacetHandler', FacetHandler);

    function FacetHandler(__, EVENT_FACET_CONSTRAINTS, EVENT_FACET_CHANGED, EVENT_REQUEST_CONSTRAINTS,
            EVENT_INITIAL_CONSTRAINTS) {

        return FacetHandlerX;


        function FacetHandlerX(config) {
            var self = this;

            init();

            function init() {
                self.state = { facets: {} };

                var defaultConfig = {
                    preferredLang: 'en'
                };

                self.config = angular.extend({}, defaultConfig, config);

                self.changeListener = self.config.scope.$on(EVENT_FACET_CHANGED, update);
                self.initListener = self.config.scope.$on(EVENT_REQUEST_CONSTRAINTS, broadCastInitial);

                self.removeListeners = removeListeners;

                self.state.facets = self.config.initialState || {};
                self.state.default = getInitialConstraints(self.config);
                broadCastInitial();
            }

            // Update state, and broadcast it to listening facets.
            function update(event, constraint) {
                event.stopPropagation();
                if (!__.isEqual(self.state.facets[constraint.id], constraint)) {
                    self.state.facets[constraint.id] = constraint;
                    broadCastConstraints(EVENT_FACET_CONSTRAINTS);
                }
            }

            function broadCastInitial(event) {
                if (event) {
                    event.stopPropagation();
                }
                var data = {
                    config: self.config
                };
                broadCastConstraints(EVENT_INITIAL_CONSTRAINTS, data);
            }

            function broadCastConstraints(eventType, data) {
                data = data || {};

                var constraint = getConstraint();
                constraint.push(self.state.default);

                data.facets = self.state.facets;
                data.constraint = constraint;

                self.config.scope.$broadcast(eventType, data);
            }

            function getConstraint() {
                return __(self.state.facets).values().sortBy('priority').map('constraint').compact().value();
            }

            // Combine the possible RDF class and constraint definitions in the config.
            function getInitialConstraints(configX) {
                var state = configX.rdfClass ? ' ?id a ' + configX.rdfClass + ' . ' : '';
                state = state + (configX.constraint || '');
                return state;
            }


            function removeListeners() {
                self.initListener();
                self.changeListener();
            }
        }
    }
})();

(function() {
    'use strict';


    angular.module('seco.facetedSearch')
    .directive('secoFacetWrapper', facetWrapper);

    function facetWrapper() {
        return {
            restrict: 'E',
            templateUrl: 'src/facets/facets.facet-wrapper.directive.html',
            transclude: true
        };
    }
})();

(function() {
    'use strict';

    angular.module('seco.facetedSearch')
    .filter('textWithSelection', ['_', function(__) {
        return function(values, text, selection) {
            if (!text) {
                return values;
            }
            var selectedValues;
            if (__.isArray(selection)) {
                selectedValues = __.map(selection, 'value');
            } else {
                selectedValues = selection ? [selection.value] : [];
            }

            var hasNoSelection = __.some(selectedValues, angular.isUndefined);
            if (!hasNoSelection) {
                selectedValues.push(undefined);
            }

            return __.filter(values, function(val) {
                return __.includes(val.text.toLowerCase(), text.toLowerCase()) ||
                    __.includes(selectedValues, val.value);
            });
        };
    }]);
})();

(function() {
    'use strict';

    AbstractFacetController.$inject = ['$scope', '$log', '_', 'EVENT_FACET_CONSTRAINTS', 'EVENT_FACET_CHANGED', 'EVENT_REQUEST_CONSTRAINTS', 'EVENT_INITIAL_CONSTRAINTS', 'FacetChartService', 'FacetImpl'];
    angular.module('seco.facetedSearch')
    .controller('AbstractFacetController', AbstractFacetController);

    function AbstractFacetController($scope, $log, __, EVENT_FACET_CONSTRAINTS,
            EVENT_FACET_CHANGED, EVENT_REQUEST_CONSTRAINTS, EVENT_INITIAL_CONSTRAINTS,
            FacetChartService, FacetImpl) {

        var vm = this;

        vm.isLoading = isLoading;
        vm.isChartVisible = isChartVisible;
        vm.hasChartButton = hasChartButton;

        vm.changed = changed;

        vm.toggleFacetEnabled = toggleFacetEnabled;
        vm.disableFacet = disableFacet;
        vm.enableFacet = enableFacet;
        vm.toggleChart = toggleChart;

        vm.getFacetSize = getFacetSize;

        vm.initOptions = initOptions;
        vm.init = init;
        vm.listener = function() {; };
        vm.listen = listen;
        vm.update = update;
        vm.emitChange = emitChange;
        vm.handleUpdateSuccess = handleUpdateSuccess;
        vm.handleError = handleError;
        vm.handleChartClick = handleChartClick;
        vm.updateChartData = updateChartData;

        vm.getSpinnerKey = getSpinnerKey;

        // Wait until the options attribute has been set.
        var watcher = $scope.$watch('options', function(val) {
            if (val) {
                vm.init();
                watcher();
            }
        });

        function init() {
            var initListener = $scope.$on(EVENT_INITIAL_CONSTRAINTS, function(event, cons) {
                vm.initOptions(cons);
                // Unregister initListener
                initListener();
            });
            $scope.$emit(EVENT_REQUEST_CONSTRAINTS);
        }

        function initOptions(cons) {
            cons = cons || {};
            var opts = __.cloneDeep($scope.options);
            opts = angular.extend({}, cons.config, opts);
            opts.initial = cons.facets;
            vm.facet = vm.facet || new FacetImpl(opts);
            if (vm.facet.isEnabled()) {
                vm.previousVal = __.cloneDeep(vm.facet.getSelectedValue());
                vm.listen();
                vm.update(cons);
            }
            if (opts.chart) {
                vm.chart = vm.chart || new FacetChartService({ facet: vm.facet, scope: $scope });
            }
        }

        var spinnerKey;
        function getSpinnerKey() {
            if (!spinnerKey) {
                spinnerKey = __.uniqueId('spinner');
            }
            return spinnerKey;
        }

        function listen() {
            vm.listener = $scope.$on(EVENT_FACET_CONSTRAINTS, function(event, cons) {
                vm.update(cons);
            });
        }

        function update(constraints) {
            vm.isLoadingFacet = true;
            return vm.facet.update(constraints).then(vm.handleUpdateSuccess, handleError);
        }

        function isLoading() {
            return vm.isLoadingFacet || !vm.facet || vm.facet.isLoading();
        }

        function emitChange(forced) {
            var val = vm.facet.getSelectedValue();
            if (!forced && __.isEqual(vm.previousVal, val)) {
                vm.isLoadingFacet = false;
                return;
            }
            vm.previousVal = __.cloneDeep(val);
            var args = {
                constraint: vm.facet.getConstraint(),
                id: vm.facet.facetId,
                priority: vm.facet.getPriority(),
                value: val
            };
            $scope.$emit(EVENT_FACET_CHANGED, args);
        }

        function changed() {
            vm.isLoadingFacet = true;
            vm.emitChange();
        }

        function toggleFacetEnabled() {
            vm.facet.isEnabled() ? vm.disableFacet() : vm.enableFacet();
        }

        function enableFacet() {
            vm.listen();
            vm.isLoadingFacet = true;
            vm.facet.enable();
            vm.init();
        }

        function disableFacet() {
            if (vm.listener) {
                vm.listener();
            }
            vm.facet.disable();
            var forced = vm.facet.getSelectedValue() ? true : false;
            vm.emitChange(forced);
        }

        function handleUpdateSuccess() {
            vm.updateChartData();
            vm.error = undefined;
            vm.isLoadingFacet = false;
        }

        function toggleChart() {
            vm._showChart = !vm._showChart;
        }

        function isChartVisible() {
            return vm._showChart;
        }

        function hasChartButton() {
            return vm.facet.isEnabled() && !!vm.chart;
        }

        function updateChartData() {
            if (vm.chart) {
                return vm.chart.updateChartData();
            }
        }

        function handleChartClick(chartElement) {
            vm.chart.handleChartClick(chartElement);
            return vm.changed();
        }

        function handleError(error) {
            if (!vm.facet.hasError()) {
                $log.info(error);
                // The facet has recovered from the error.
                // This happens when an update has been cancelled
                // due to changes in facet selections.
                return;
            }
            $log.error(error.statusText || error);
            vm.isLoadingFacet = false;
            vm.error = 'Error' + (error.status ? ' (' + error.status + ')' : '');
        }

        function getFacetSize(facetStates) {
            if (facetStates) {
                return Math.min(facetStates.length + 2, 10).toString();
            }
            return '10';
        }
    }
})();

(function() {
    'use strict';

    FacetChartService.$inject = ['_'];
    angular.module('seco.facetedSearch')
    .factory('FacetChartService', FacetChartService);

    function FacetChartService(__) {

        return FacetChartServiceX;

        function FacetChartServiceX(config) {
            var self = this;

            self.scope = config.scope;
            self.facet = config.facet;

            self.handleChartClick = handleChartClick;
            self.updateChartData = updateChartData;
            self.clearChartData = clearChartData;

            self.scope.$on('chart-create', function(evt, chart) {
                // Highlight the selected value on init
                updateChartHighlight(chart, self.facet.getSelectedValue());
            });

            function clearChartData() {
                self.chartData = {
                    data: [],
                    labels: [],
                    values: []
                };
            }

            function updateChartData() {
                self.clearChartData();
                if (self.facet.getState) {
                    self.facet.getState().forEach(function(val) {
                        // Don't add "no selection"
                        if (angular.isDefined(val.value)) {
                            self.chartData.values.push(val.value);
                            self.chartData.data.push(val.count);
                            self.chartData.labels.push(val.text);
                        }
                    });
                }
            }

            function clearChartSliceHighlight(chartElement, updateChart) {
                __.set(chartElement.custom, 'backgroundColor', null);
                __.set(chartElement.custom, 'borderWidth', null);
                if (updateChart) {
                    chartElement._chart.update();
                }
            }

            function highlightChartElement(chartElement, updateChart) {
                __.set(chartElement, 'custom.backgroundColor', 'grey');
                chartElement.custom.borderWidth = 10;
                if (updateChart) {
                    chartElement._chart.update();
                }
            }

            function updateChartHighlight(chart, values) {
                var chartElements = chart.getDatasetMeta(0).data;
                // Clear previous selection
                chartElements.forEach(function(elem) {
                    clearChartSliceHighlight(elem);
                });

                values = __.compact(__.castArray(values));
                values.forEach(function(value) {
                    var index = __.indexOf(self.chartData.values, value);
                    var chartElement = __.find(chartElements, ['_index', index]);
                    highlightChartElement(chartElement);
                });

                chart.update();
            }

            function updateChartSelection(chartElement) {
                var selectedValue = self.chartData.values[chartElement._index];

                if (__.get(chartElement, 'custom.backgroundColor')) {
                    // Slice was already selected, so clear the selection
                    clearChartSliceHighlight(chartElement, true);
                    self.facet.deselectValue(selectedValue);
                    return self.facet.getSelectedValue();
                }

                self.facet.setSelectedValue(selectedValue);

                updateChartHighlight(chartElement._chart, self.facet.getSelectedValue());

                return self.facet.getSelectedValue();
            }

            function handleChartClick(chartElement) {
                return updateChartSelection(chartElement[0]);
            }
        }
    }
})();


(function() {
    'use strict';

    BasicFacet.$inject = ['$q', '_', 'facetEndpoint', 'NO_SELECTION_STRING', 'PREFIXES'];
    angular.module('seco.facetedSearch')
    .factory('BasicFacet', BasicFacet);

    function BasicFacet($q, __, facetEndpoint, NO_SELECTION_STRING, PREFIXES) {

        BasicFacetConstructor.prototype.update = update;
        BasicFacetConstructor.prototype.getState = getState;
        BasicFacetConstructor.prototype.fetchState = fetchState;
        BasicFacetConstructor.prototype.fetchFacetTextFromServices = fetchFacetTextFromServices;
        BasicFacetConstructor.prototype.finalizeFacetValues = finalizeFacetValues;
        BasicFacetConstructor.prototype.getConstraint = getConstraint;
        BasicFacetConstructor.prototype.getTriplePattern = getTriplePattern;
        BasicFacetConstructor.prototype.getSpecifier = getSpecifier;
        BasicFacetConstructor.prototype.getPriority = getPriority;
        BasicFacetConstructor.prototype.buildQueryTemplate = buildQueryTemplate;
        BasicFacetConstructor.prototype.buildQuery = buildQuery;
        BasicFacetConstructor.prototype.buildSelections = buildSelections;
        BasicFacetConstructor.prototype.buildLabelPart = buildLabelPart;
        BasicFacetConstructor.prototype.removeOwnConstraint = removeOwnConstraint;
        BasicFacetConstructor.prototype.getOtherSelections = getOtherSelections;
        BasicFacetConstructor.prototype.getDeselectUnionTemplate = getDeselectUnionTemplate;
        BasicFacetConstructor.prototype.disable = disable;
        BasicFacetConstructor.prototype.enable = enable;
        BasicFacetConstructor.prototype.isLoading = isLoading;
        BasicFacetConstructor.prototype.isEnabled = isEnabled;
        BasicFacetConstructor.prototype.hasError = hasError;
        BasicFacetConstructor.prototype.getSelectedValue = getSelectedValue;
        BasicFacetConstructor.prototype.setSelectedValue = setSelectedValue;
        BasicFacetConstructor.prototype.deselectValue = deselectValue;

        return BasicFacetConstructor;

        function BasicFacetConstructor(options) {

            // this.previousConstraints;
            this.state = {};

            var labelPart =
            ' OPTIONAL {' +
            '  ?labelValue skos:prefLabel ?lbl . ' +
            '  FILTER(langMatches(lang(?lbl), "<PREF_LANG>")) .' +
            ' }' +
            ' OPTIONAL {' +
            '  ?labelValue rdfs:label ?lbl . ' +
            '  FILTER(langMatches(lang(?lbl), "<PREF_LANG>")) .' +
            ' }';

            var serviceQueryTemplate = PREFIXES +
            ' SELECT DISTINCT ?facet_text ?value {' +
            '  VALUES ?value { <VALUES> } ' +
            '  ?value skos:prefLabel|rdfs:label [] . ' +
            '  BIND(?value AS ?labelValue) ' +
            '  <LABEL_PART>' +
            '  BIND(?lbl AS ?facet_text)' +
            '  FILTER(?facet_text != "")' +
            ' }';

            var queryTemplate = PREFIXES +
            ' SELECT DISTINCT ?cnt ?facet_text ?value WHERE {' +
            ' { ' +
            '  { ' +
            '   SELECT DISTINCT (count(DISTINCT ?id) as ?cnt) { ' +
            '    <OTHER_SELECTIONS> ' +
            '   } ' +
            '  } ' +
            '  BIND("<NO_SELECTION_STRING>" AS ?facet_text) ' +
            ' } UNION ' +
            '  {' +
            '   SELECT DISTINCT ?cnt ?value ?facet_text { ' +
            '    {' +
            '     SELECT DISTINCT (count(DISTINCT ?id) as ?cnt) ?value {' +
            '      <SELECTIONS> ' +
            '     } GROUP BY ?value ' +
            '    } ' +
            '    FILTER(BOUND(?value))' +
            '    BIND(COALESCE(?value, <http://ldf.fi/NONEXISTENT_URI>) AS ?labelValue) ' +
            '    <LABEL_PART> ' +
            '    BIND(COALESCE(?lbl, IF(!ISURI(?value), ?value, "")) AS ?facet_text)' +
            '   } ' +
            '  }' +
            ' } ';

            var defaultConfig = {
                labelPart: labelPart,
                noSelectionString: NO_SELECTION_STRING,
                preferredLang: 'fi',
                queryTemplate: queryTemplate,
                serviceQueryTemplate: serviceQueryTemplate,
                usePost: true
            };

            this.config = angular.extend({}, defaultConfig, options);

            this.name = this.config.name;
            this.facetId = this.config.facetId;
            this.predicate = this.config.predicate;
            this.specifier = this.config.specifier;
            if (this.config.enabled) {
                this.enable();
            } else {
                this.disable();
            }

            this.endpoint = facetEndpoint.getEndpoint(this.config);

            // Initial value
            var constVal = __.get(options, 'initial.' + this.facetId);

            if (constVal && constVal.value) {
                this._isEnabled = true;
                this.selectedValue = { value: constVal.value };
            }

            this.labelPart = this.buildLabelPart();
            this.queryTemplate = this.buildQueryTemplate(this.config.queryTemplate);
            this.serviceQueryTemplate = this.buildQueryTemplate(this.config.serviceQueryTemplate);
        }

        function update(constraints) {
            var self = this;
            if (!self.isEnabled()) {
                return $q.when();
            }

            var otherCons = this.getOtherSelections(constraints.constraint);
            if (self.otherCons === otherCons) {
                return $q.when(self.state);
            }
            self.otherCons = otherCons;

            self._isBusy = true;

            return self.fetchState(constraints).then(function(state) {
                if (!__.isEqual(otherCons, self.otherCons)) {
                    return $q.reject('Facet state changed');
                }
                self.state = state;
                self._isBusy = false;

                return state;
            });
        }

        function getState() {
            return this.state;
        }

        // Build a query with the facet selection and use it to get the facet state.
        function fetchState(constraints) {
            var self = this;

            var query = self.buildQuery(constraints.constraint);

            return self.endpoint.getObjectsNoGrouping(query).then(function(results) {
                if (self.config.services) {
                    return self.fetchFacetTextFromServices(results);
                }
                self._error = false;
                return results;
            }).then(function(res) {
                res = self.finalizeFacetValues(res);
                self._error = false;
                return res;
            }).catch(function(error) {
                self._isBusy = false;
                self._error = true;
                return $q.reject(error);
            });
        }

        function finalizeFacetValues(results) {
            results.forEach(function(r) {
                if (!r.text) {
                    r.text = r.value.replace(/^.+\/(.+?)>$/, '$1');
                }
            });
            return [__.head(results)].concat(__.sortBy(__.tail(results), 'text'));
        }

        function fetchFacetTextFromServices(results) {
            var self = this;
            var emptyLabels = __.filter(results, function(r) { return !r.text; });
            var values = __.map(emptyLabels, function(r) { return r.value; });
            var promises = __.map(self.config.services, function(s) {
                var endpointConfig = {
                    endpointUrl: s.replace(/[<>]/g, ''),
                    headers: self.config.headers,
                    usePost: self.config.usePost
                };
                var endpoint = facetEndpoint.getEndpoint(endpointConfig);
                var qry = self.serviceQueryTemplate
                    .replace(/<VALUES>/g, values.join(' '));
                return endpoint.getObjectsNoGrouping(qry);
            });
            return $q.all(promises).then(function(res) {
                var all = __.flatten(res);
                all.forEach(function(objWithText) {
                    __.find(results, ['value', objWithText.value]).text = objWithText.text;
                });
                return results;
            });
        }

        function hasError() {
            return this._error;
        }

        function getTriplePattern() {
            return '?id ' + this.predicate + ' ?value . ';
        }

        function getSpecifier() {
            return this.specifier ? this.specifier : '';
        }

        function getPriority() {
            return this.config.priority;
        }

        function getConstraint() {
            if (!this.getSelectedValue()) {
                return;
            }
            if (this.getSelectedValue()) {
                return ' ?id ' + this.predicate + ' ' + this.getSelectedValue() + ' . ';
            }
        }

        function getDeselectUnionTemplate() {
            return this.deselectUnionTemplate;
        }

        // Build the facet query
        function buildQuery(constraints) {
            constraints = constraints || [];
            var otherConstraints = this.removeOwnConstraint(constraints);
            var query = this.queryTemplate
                .replace(/<OTHER_SELECTIONS>/g, otherConstraints.join(' '))
                .replace(/<SELECTIONS>/g, this.buildSelections(otherConstraints));

            return query;
        }

        function buildSelections(constraints) {
            constraints = constraints.join(' ') +
                ' ' + this.getTriplePattern() +
                ' ' + this.getSpecifier();
            return constraints;
        }

        function removeOwnConstraint(constraints) {
            var ownConstraint = this.getConstraint();
            return __.reject(constraints, function(v) { return v === ownConstraint; });
        }

        function getOtherSelections(constraints) {
            return this.removeOwnConstraint(constraints).join(' ');
        }

        function buildLabelPart() {
            var self = this;
            var res = '';
            var langs = __.castArray(self.config.preferredLang).concat(['']);
            langs.forEach(function(lang) {
                res += self.config.labelPart.replace(/<PREF_LANG>/g, lang);
            });
            return res;
        }

        // Replace placeholders in the query template using the configuration.
        function buildQueryTemplate(template) {
            var templateSubs = [
                {
                    placeHolder: /<LABEL_PART>/g,
                    value: this.labelPart
                },
                {
                    placeHolder: /<NO_SELECTION_STRING>/g,
                    value: this.config.noSelectionString
                },
                {
                    placeHolder: /\s+/g,
                    value: ' '
                }
            ];

            templateSubs.forEach(function(s) {
                template = template.replace(s.placeHolder, s.value);
            });
            return template;
        }

        function getSelectedValue() {
            var val;
            if (this.selectedValue) {
                val = this.selectedValue.value;
            }
            return val;
        }

        function setSelectedValue(value) {
            this.selectedValue = __.find(this.getState(), ['value', value]);
        }

        function deselectValue() {
            this.setSelectedValue(undefined);
        }

        function isEnabled() {
            return this._isEnabled;
        }

        function enable() {
            this._isEnabled = true;
        }

        function disable() {
            this.selectedValue = undefined;
            this._isEnabled = false;
        }

        function isLoading() {
            return this._isBusy;
        }
    }
})();

(function() {
    'use strict';

    BasicFacetController.$inject = ['$scope', '$controller', 'BasicFacet'];
    angular.module('seco.facetedSearch')
    .controller('BasicFacetController', BasicFacetController);

    function BasicFacetController($scope, $controller, BasicFacet) {
        var args = { $scope: $scope, FacetImpl: BasicFacet };
        return $controller('AbstractFacetController', args);
    }
})();

(function() {
    'use strict';

    angular.module('seco.facetedSearch')
    .directive('secoBasicFacet', basicFacet);

    function basicFacet() {
        return {
            controller: 'BasicFacetController',
            controllerAs: 'vm',
            restrict: 'E',
            scope: {
                options: '='
            },
            templateUrl: 'src/facets/basic/facets.basic-facet.directive.html'
        };
    }
})();

(function() {
    'use strict';

    TextFacet.$inject = ['$q', '_'];
    angular.module('seco.facetedSearch')
    .factory('TextFacet', TextFacet);

    function TextFacet($q, __) {

        TextFacetConstructor.prototype.getConstraint = getConstraint;
        TextFacetConstructor.prototype.getPriority = getPriority;
        TextFacetConstructor.prototype.getPreferredLang = getPreferredLang;
        TextFacetConstructor.prototype.disable = disable;
        TextFacetConstructor.prototype.enable = enable;
        TextFacetConstructor.prototype.update = update;
        TextFacetConstructor.prototype.isLoading = isLoading;
        TextFacetConstructor.prototype.clear = clear;
        TextFacetConstructor.prototype.isEnabled = isEnabled;
        TextFacetConstructor.prototype.getSelectedValue = getSelectedValue;

        return TextFacetConstructor;

        function TextFacetConstructor(options) {

            /* Implementation */

            var defaultConfig = {
                preferredLang: 'fi'
            };

            this.config = angular.extend({}, defaultConfig, options);

            this.name = this.config.name;
            this.facetId = this.config.facetId;
            this.predicate = this.config.predicate;
            if (this.config.enabled) {
                this.enable();
            } else {
                this.disable();
            }

            // Initial value
            var initial = __.get(options, 'initial.' + this.facetId);
            if (initial && initial.value) {
                this._isEnabled = true;
                this.selectedValue = initial.value;
            }
        }

        function getConstraint() {
            var value = this.getSelectedValue();
            if (!value) {
                return;
            }
            var result = this.useJenaText ? ' ?id text:query "' + value + '*" . ' : '';
            var textVar = '?' + this.facetId;
            result = result + ' ?id ' + this.predicate + ' ' + textVar + ' . ';
            var words = value.replace(/[?,._*'\\/-]/g, ' ');

            words.split(' ').forEach(function(word) {
                result = result + ' FILTER(CONTAINS(LCASE(' + textVar + '), "' +
                        word.toLowerCase() + '")) ';
            });

            return result;
        }

        function getPreferredLang() {
            return this.config.preferredLang;
        }

        function getSelectedValue() {
            return this.selectedValue;
        }

        function getPriority() {
            return this.config.priority;
        }

        function clear() {
            this.selectedValue = undefined;
        }

        function isEnabled() {
            return this._isEnabled;
        }

        function enable() {
            this._isEnabled = true;
        }

        function disable() {
            this.selectedValue = undefined;
            this._isEnabled = false;
        }

        function update() {
            return $q.when();
        }

        function isLoading() {
            return false;
        }
    }
})();

(function() {
    'use strict';

    TextFacetController.$inject = ['$scope', '$controller', 'TextFacet'];
    angular.module('seco.facetedSearch')
    .controller('TextFacetController', TextFacetController);

    function TextFacetController($scope, $controller, TextFacet) {
        var args = { $scope: $scope, FacetImpl: TextFacet };
        var vm = $controller('AbstractFacetController', args);

        vm.listen = function() { ; };
        vm.listener = function() { ; };

        vm.changed = changed;
        vm.clear = clear;
        vm.enableFacet = enableFacet;
        vm.isLoadingFacet = false;

        return vm;

        function changed() {
            vm.emitChange();
        }

        function clear() {
            vm.facet.clear();
            vm.emitChange();
        }

        function enableFacet() {
            vm.facet.enable();
        }
    }
})();

(function() {
    'use strict';

    angular.module('seco.facetedSearch')
    .directive('secoTextFacet', textFacet);

    function textFacet() {
        return {
            controller: 'TextFacetController',
            controllerAs: 'vm',
            restrict: 'E',
            scope: {
                options: '='
            },
            templateUrl: 'src/facets/text/facets.text-facet.directive.html'
        };
    }
})();

(function() {
    'use strict';

    JenaTextFacet.$inject = ['_', 'TextFacet', 'textQueryPredicate'];
    angular.module('seco.facetedSearch')
    .value('textQueryPredicate', '<http://jena.apache.org/text#query>')
    .factory('JenaTextFacet', JenaTextFacet);

    function JenaTextFacet(__, TextFacet, textQueryPredicate) {

        JenaTextFacetX.prototype = Object.create(TextFacet.prototype);
        JenaTextFacetX.prototype.getConstraint = getConstraint;
        JenaTextFacetX.prototype.sanitize = sanitize;

        return JenaTextFacetX;

        function JenaTextFacetX(options) {
            TextFacet.call(this, options);
            this.config.priority = this.config.priority || 0;
        }

        function getConstraint() {
            var value = this.getSelectedValue();
            if (!value) {
                return undefined;
            }

            value = this.sanitize(value);

            var args = [];
            if (this.config.predicate) {
                args.push(this.config.predicate);
            }

            args.push('"' + value + '"');

            if (this.config.limit) {
                args.push(this.config.limit);
            }

            var obj = '(' + args.join(' ') + ')';

            var result = '(?id ?score) ' + textQueryPredicate + ' ' + obj + ' .';

            if (this.config.graph) {
                result = 'GRAPH ' + this.config.graph + ' { ' + result + ' }';
            }

            return result || undefined;
        }

        function sanitize(query) {
            query = query
                .replace(/[\\()]/g, '') // backslashes, and parentheses
                .replace(/~{2,}/g, '~') // double ~
                .replace(/^~/g, '') // ~ as first token
                .replace(/(\b~*(AND|OR|NOT)\s*~*)+$/g, '') // AND, OR, NOT last
                .replace(/^((AND|OR|NOT)\b\s*~*)+/g, ''); // AND, OR, NOT first

            var quoteRepl;
            if ((query.match(/"/g) || []).length % 2) {
                // Unbalanced quotes, remove them
                quoteRepl = '';
            } else {
                // Balanced quotes, escape them
                quoteRepl = '\\"';
            }
            query = query.replace(/"/g, quoteRepl).trim();

            return query;
        }
    }
})();

(function() {
    'use strict';

    JenaTextFacetController.$inject = ['$controller', '$scope', 'JenaTextFacet'];
    angular.module('seco.facetedSearch')
    .controller('JenaTextFacetController', JenaTextFacetController);

    function JenaTextFacetController($controller, $scope, JenaTextFacet) {
        var args = { $scope: $scope, TextFacet: JenaTextFacet };
        return $controller('TextFacetController', args);
    }
})();

(function() {
    'use strict';

    angular.module('seco.facetedSearch')
    .directive('secoJenaTextFacet', jenaTextFacet);

    function jenaTextFacet() {
        return {
            controller: 'JenaTextFacetController',
            controllerAs: 'vm',
            restrict: 'E',
            scope: {
                options: '='
            },
            templateUrl: 'src/facets/text/facets.text-facet.directive.html'
        };
    }
})();

(function() {
    'use strict';

    timespanMapperService.$inject = ['_', 'objectMapperService'];
    angular.module('seco.facetedSearch')

    .factory('timespanMapperService', timespanMapperService);

    /* ngInject */
    function timespanMapperService(__, objectMapperService) {
        TimespanMapper.prototype.makeObject = makeObject;
        TimespanMapper.prototype.parseValue = parseValue;

        var proto = Object.getPrototypeOf(objectMapperService);
        TimespanMapper.prototype = angular.extend({}, proto, TimespanMapper.prototype);

        return new TimespanMapper();

        function TimespanMapper() {
            this.objectClass = Object;
        }

        function makeObject(obj) {
            var o = new this.objectClass();

            o.min = parseValue(__.get(obj, 'min.value'));
            o.max = parseValue(__.get(obj, 'max.value'));

            return o;
        }

        function parseValue(value) {
            if (!value) {
                return undefined;
            }
            var dx = __(value.substring(0, 10).split('-')).map(function(dxx) { return parseInt(dxx, 10); }).value();
            return new Date(dx[0], d[1]-1, d[2]);
        }
    }
})();


(function() {
    'use strict';

    TimespanFacet.$inject = ['$q', '_', 'facetEndpoint', 'timespanMapperService', 'BasicFacet', 'PREFIXES'];
    angular.module('seco.facetedSearch')
    .factory('TimespanFacet', TimespanFacet);

    /* ngInject */
    function TimespanFacet($q, __, facetEndpoint, timespanMapperService, BasicFacet,
            PREFIXES) {
        TimespanFacetConstructor.prototype = Object.create(BasicFacet.prototype);

        TimespanFacetConstructor.prototype.getSelectedValue = getSelectedValue;
        TimespanFacetConstructor.prototype.getConstraint = getConstraint;
        TimespanFacetConstructor.prototype.buildQueryTemplate = buildQueryTemplate;
        TimespanFacetConstructor.prototype.buildQuery = buildQuery;
        TimespanFacetConstructor.prototype.fetchState = fetchState;
        TimespanFacetConstructor.prototype.update = update;
        TimespanFacetConstructor.prototype.disable = disable;
        TimespanFacetConstructor.prototype.enable = enable;
        TimespanFacetConstructor.prototype.getOtherSelections = getOtherSelections;
        TimespanFacetConstructor.prototype.initState = initState;
        TimespanFacetConstructor.prototype.getMinDate = getMinDate;
        TimespanFacetConstructor.prototype.getMaxDate = getMaxDate;
        TimespanFacetConstructor.prototype.getSelectedStartDate = getSelectedStartDate;
        TimespanFacetConstructor.prototype.getSelectedEndDate = getSelectedEndDate;
        TimespanFacetConstructor.prototype.updateState = updateState;

        return TimespanFacetConstructor;

        function TimespanFacetConstructor(options) {
            var simpleTemplate = PREFIXES +
            ' SELECT (min(xsd:date(?value)) AS ?min) (max(xsd:date(?value)) AS ?max) { ' +
            '   <SELECTIONS> ' +
            '   ?id <START_PROPERTY> ?value . ' +
            ' } ';

            var separateTemplate = PREFIXES +
            ' SELECT ?min ?max { ' +
            '   { ' +
            '     SELECT (min(xsd:date(?start)) AS ?min) { ' +
            '       <SELECTIONS> ' +
            '       ?id <START_PROPERTY> ?start . ' +
            '     } ' +
            '   } ' +
            '   { ' +
            '     SELECT (max(xsd:date(?end)) AS ?max) { ' +
            '       <SELECTIONS> ' +
            '       ?id <END_PROPERTY> ?end . ' +
            '     } ' +
            '   } ' +
            ' } ';

            var defaultConfig = {};

            this.config = angular.extend({}, defaultConfig, options);

            this.name = this.config.name;
            this.facetId = this.config.facetId;
            this.startPredicate = this.config.startPredicate;
            this.endPredicate = this.config.endPredicate;

            if (angular.isString(this.config.min)) {
                this.minDate = timespanMapperService.parseValue(this.config.min);
            } else {
                this.minDate = this.config.min;
            }
            if (angular.isString(this.config.max)) {
                this.maxDate = timespanMapperService.parseValue(this.config.max);
            } else {
                this.maxDate = this.config.max;
            }

            this.initState();

            if (this.config.enabled) {
                this.enable();
            } else {
                this.disable();
            }

            this.config.mapper = timespanMapperService;

            this.endpoint = facetEndpoint.getEndpoint(this.config);

            this.queryTemplate = this.buildQueryTemplate(
                this.startPredicate === this.endPredicate ? simpleTemplate : separateTemplate);

            this.varSuffix = this.facetId;

            this.selectedValue = {};

            // Initial value
            var initial = __.get(options, 'initial.' + this.facetId);
            if (initial && initial.value) {
                this._isEnabled = true;
                this.selectedValue = {};
                if (initial.value.start) {
                    this.selectedValue.start = timespanMapperService.parseValue(initial.value.start);
                }
                if (initial.value.end) {
                    this.selectedValue.end = timespanMapperService.parseValue(initial.value.end);
                }
            }
        }

        function initState() {
            if (!this.state) {
                this.state = {};
            }

            this.state.start = {
                initDate: this.getMinDate(),
                maxDate: this.getMaxDate(),
                minDate: this.getMinDate(),
                startingDay: this.config.startingDay || 1
            };

            this.state.end = {
                initDate: this.getMaxDate(),
                maxDate: this.getMaxDate(),
                minDate: this.getMinDate(),
                startingDay: this.config.startingDay || 1
            };
        }

        function update(constraints) {
            var self = this;
            if (!self.isEnabled()) {
                return $q.when();
            }

            var otherCons = this.getOtherSelections(constraints.constraint);
            if (self.otherCons === otherCons) {
                // Only this facet's selection has changed
                self.updateState({ min: self.getMinDate(), max: self.getMaxDate() });
                return $q.when(self.state);
            }
            self.otherCons = otherCons;

            self._isBusy = true;

            return self.fetchState(constraints).then(function(state) {
                if (!__.isEqual(self.otherCons, otherCons)) {
                    return $q.reject('Facet state changed');
                }
                self.state = state;
                self._isBusy = false;

                return state;
            });
        }


        function getMinDate() {
            return __.clone(this.minDate);
        }

        function getMaxDate() {
            return __.clone(this.maxDate);
        }

        function enable() {
            BasicFacet.prototype.enable.call(this);
        }

        function disable() {
            BasicFacet.prototype.disable.call(this);
            this.initState();
        }

        function buildQueryTemplate(template) {
            return template
                .replace(/<START_PROPERTY>/g, this.startPredicate)
                .replace(/<END_PROPERTY>/g, this.endPredicate)
                .replace(/\s+/g, ' ');
        }

        function buildQuery(constraints) {
            constraints = constraints || [];
            var query = this.queryTemplate
                .replace(/<SELECTIONS>/g, this.getOtherSelections(constraints));
            return query;
        }

        function getOtherSelections(constraints) {
            var ownConstraint = this.getConstraint();

            var selections = __.reject(constraints, function(v) { return v === ownConstraint; });
            return selections.join(' ');
        }

        // Build a query with the facet selection and use it to get the facet state.
        function fetchState(constraints) {
            var self = this;

            var query = self.buildQuery(constraints.constraint);

            return self.endpoint.getObjectsNoGrouping(query).then(function(results) {
                var state = __.first(results);

                self.updateState(state);

                self._error = false;

                return self.state;
            }).catch(function(error) {
                self._isBusy = false;
                self._error = true;
                return $q.reject(error);
            });
        }

        function updateState(minMax) {
            var self = this;

            var minDate = self.getMinDate();
            if (!minMax.min || minMax.min < minDate) {
                minMax.min = minDate;
            }

            var maxDate = self.getMaxDate();
            if (!minMax.max || minMax.max > maxDate) {
                minMax.max = maxDate;
            }

            var selectedStart = self.getSelectedStartDate();
            self.state.start.initDate = selectedStart || minMax.min;
            self.state.start.minDate = minMax.min;
            self.state.start.maxDate = minMax.max;

            var selectedEnd = self.getSelectedEndDate();
            self.state.end.initDate = selectedEnd || minMax.max;
            self.state.end.minDate = minMax.min;
            self.state.end.maxDate = minMax.max;

            if (selectedEnd < self.state.start.maxDate) {
                self.state.start.maxDate = selectedEnd;
            }

            if (selectedStart > self.state.end.minDate) {
                self.state.end.minDate = selectedStart;
            }

            return self.state;
        }

        function getSelectedStartDate() {
            return __.clone((this.selectedValue || {}).start);
        }

        function getSelectedEndDate() {
            return __.clone((this.selectedValue || {}).end);
        }

        function getSelectedValue() {
            if (!this.selectedValue) {
                return;
            }
            var selectedValue = {};
            if (this.selectedValue.start) {
                selectedValue.start = getISOStringFromDate(this.selectedValue.start);
            }
            if (this.selectedValue.end) {
                selectedValue.end = getISOStringFromDate(this.selectedValue.end);
            }
            return selectedValue;
        }

        function getConstraint() {
            var result =
            ' <START_FILTER> ' +
            ' <END_FILTER> ';

            var value = this.getSelectedValue() || {};

            var start = value.start;
            var end = value.end;

            if (!(start || end)) {
                return '';
            }

            var startFilter =
            ' ?id <START_PROPERTY> <VAR> . ' +
            ' FILTER(<http://www.w3.org/2001/XMLSchema#date>(<VAR>) >= "<START_VALUE>"^^<http://www.w3.org/2001/XMLSchema#date>) ';

            var endFilter =
            ' ?id <END_PROPERTY> <VAR> . ' +
            ' FILTER(<http://www.w3.org/2001/XMLSchema#date>(<VAR>) <= "<END_VALUE>"^^<http://www.w3.org/2001/XMLSchema#date>) ';

            var startVar = '?start_' + this.varSuffix;
            var endVar = '?end_' + this.varSuffix;

            if (this.startPredicate === this.endPredicate) {
                endVar = startVar;
            }

            startFilter = startFilter.replace(/<VAR>/g, startVar);
            endFilter = endFilter.replace(/<VAR>/g, endVar);

            if (start) {
                result = result
                    .replace('<START_FILTER>',
                        startFilter.replace('<START_PROPERTY>',
                            this.startPredicate))
                    .replace('<START_VALUE>', start);
            } else {
                result = result.replace('<START_FILTER>', '');
            }
            if (end) {
                result = result
                    .replace('<END_FILTER>',
                        endFilter.replace('<END_PROPERTY>',
                            this.endPredicate))
                    .replace('<END_VALUE>', end);
            } else {
                result = result.replace('<END_FILTER>', '');
            }
            return result;
        }

        function getISOStringFromDate(d) {
            var mm = (d.getMonth() + 1).toString();
            var dd = d.getDate().toString();
            mm = mm.length === 2 ? mm : '0' + mm;
            dd = dd.length === 2 ? dd : '0' + dd;

            return [d.getFullYear(), mm, dd].join('-');
        }
    }
})();

(function() {
    'use strict';

    TimespanFacetController.$inject = ['$scope', '$controller', 'TimespanFacet'];
    angular.module('seco.facetedSearch')
    .controller('TimespanFacetController', TimespanFacetController);

    /* ngInject */
    function TimespanFacetController($scope, $controller, TimespanFacet) {
        var args = { $scope: $scope, FacetImpl: TimespanFacet };
        return $controller('AbstractFacetController', args);
    }
})();

(function() {
    'use strict';

    angular.module('seco.facetedSearch')
    .directive('secoTimespanFacet', timespanFacet);

    function timespanFacet() {
        return {
            controller: 'TimespanFacetController',
            controllerAs: 'vm',
            restrict: 'E',
            scope: {
                options: '='
            },
            templateUrl: 'src/facets/timespan/facets.timespan-facet.directive.html'
        };
    }
})();


(function() {
    'use strict';

    CheckboxFacet.$inject = ['$q', '_', 'facetEndpoint', 'BasicFacet', 'PREFIXES'];
    angular.module('seco.facetedSearch')
    .factory('CheckboxFacet', CheckboxFacet);

    function CheckboxFacet($q, __, facetEndpoint, BasicFacet, PREFIXES) {
        CheckboxFacetX.prototype = Object.create(BasicFacet.prototype);

        CheckboxFacetX.prototype.getConstraint = getConstraint;
        CheckboxFacetX.prototype.buildQueryTemplate = buildQueryTemplate;
        CheckboxFacetX.prototype.buildQuery = buildQuery;
        CheckboxFacetX.prototype.fetchState = fetchState;
        CheckboxFacetX.prototype.deselectValue = deselectValue;
        CheckboxFacetX.prototype.setSelectedValue = setSelectedValue;

        return CheckboxFacetX;

        function CheckboxFacetX(options) {

            var queryTemplate = PREFIXES +
            ' SELECT DISTINCT ?value ?facet_text ?cnt WHERE { ' +
            '  <PREDICATE_UNION> ' +
            ' } ';

            var predTemplate =
            ' { ' +
            '  SELECT DISTINCT (COUNT(DISTINCT(?id)) AS ?cnt) ("<ID>" AS ?value)' +
            '     ("<LABEL>" AS ?facet_text) { ' +
            '   <SELECTIONS> ' +
            '   BIND("<ID>" AS ?val) ' +
            '   <PREDICATE> ' +
            '  } GROUP BY ?val ' +
            ' } ';

            var defaultConfig = {
                usePost: true
            };

            this.config = angular.extend({}, defaultConfig, options);

            this.name = this.config.name;
            this.facetId = this.config.facetId;
            this.state = {};

            if (this.config.enabled) {
                this.enable();
            } else {
                this.disable();
            }

            this.endpoint = facetEndpoint.getEndpoint(this.config);

            this.queryTemplate = this.buildQueryTemplate(queryTemplate, predTemplate);

            this.selectedValue = {};

            // Initial value
            var initial = __.get(options, 'initial[' + this.facetId + '].value');
            if (initial) {
                this._isEnabled = true;
                this.selectedValue = { value: initial };
            }
        }

        function buildQueryTemplate(template, predTemplate) {
            var unions = '';
            this.config.choices.forEach(function(pred) {
                var union = predTemplate
                    .replace(/<ID>/g, pred.id)
                    .replace(/<PREDICATE>/g, pred.pattern)
                    .replace(/<LABEL>/g, pred.label);
                if (unions) {
                    union = ' UNION ' + union;
                }
                unions += union;
            });

            return template
                .replace(/<PREDICATE_UNION>/g, unions)
                .replace(/\s+/g, ' ');
        }

        function buildQuery(constraints) {
            constraints = constraints || [];
            var query = this.queryTemplate
                .replace(/<SELECTIONS>/g, this.getOtherSelections(constraints));
            return query;
        }

        // Build a query with the facet selection and use it to get the facet state.
        function fetchState(constraints) {
            var self = this;

            var query = self.buildQuery(constraints.constraint);

            return self.endpoint.getObjectsNoGrouping(query).then(function(results) {
                self._error = false;
                return results;
            }).catch(function(error) {
                self._isBusy = false;
                self._error = true;
                return $q.reject(error);
            });
        }

        function setSelectedValue(value) {
            this.selectedValue.value = __.uniq((this.selectedValue.value || []).concat(value));
        }

        function deselectValue(value) {
            __.pull(this.selectedValue.value, value);
        }

        function getConstraint() {
            var self = this;
            var selections = __.compact(self.getSelectedValue());
            if (!(selections.length)) {
                return;
            }
            var res = '';
            selections.forEach(function(val) {
                var cons = __.get(__.find(self.config.choices, ['id', val.replace(/"/g, '')]), 'pattern');
                if (res) {
                    cons = ' UNION { ' + cons + ' } ';
                } else if (selections.length > 1) {
                    cons = ' { ' + cons + ' } ';
                }
                res += cons;
            });

            return res;
        }
    }
})();

(function() {
    'use strict';

    CheckboxFacetController.$inject = ['$scope', '$controller', 'CheckboxFacet'];
    angular.module('seco.facetedSearch')
    .controller('CheckboxFacetController', CheckboxFacetController);

    function CheckboxFacetController($scope, $controller, CheckboxFacet) {
        var args = { $scope: $scope, FacetImpl: CheckboxFacet };
        return $controller('AbstractFacetController', args);
    }
})();

(function() {
    'use strict';

    angular.module('seco.facetedSearch')
    .directive('secoCheckboxFacet', checkboxFacet);

    function checkboxFacet() {
        return {
            controller: 'CheckboxFacetController',
            controllerAs: 'vm',
            restrict: 'E',
            scope: {
                options: '='
            },
            templateUrl: 'src/facets/checkbox/facets.checkbox-facet.directive.html'
        };
    }
})();

(function() {
    'use strict';

    HierarchyFacet.$inject = ['$q', '_', 'BasicFacet', 'PREFIXES'];
    angular.module('seco.facetedSearch')

    .factory('HierarchyFacet', HierarchyFacet);

    function HierarchyFacet($q, __, BasicFacet, PREFIXES) {

        HierarchyFacetConstructor.prototype = Object.create(BasicFacet.prototype);

        HierarchyFacetConstructor.prototype.getSelectedValue = getSelectedValue;
        HierarchyFacetConstructor.prototype.getConstraint = getConstraint;
        HierarchyFacetConstructor.prototype.buildQueryTemplate = buildQueryTemplate;
        HierarchyFacetConstructor.prototype.buildQuery = buildQuery;
        HierarchyFacetConstructor.prototype.fetchState = fetchState;

        return HierarchyFacetConstructor;

        function HierarchyFacetConstructor(options) {

            var queryTemplate = PREFIXES +
            ' SELECT DISTINCT ?cnt ?facet_text ?value WHERE {' +
            ' { ' +
            '  { ' +
            '   SELECT DISTINCT (count(DISTINCT ?id) as ?cnt) { ' +
            '    <OTHER_SELECTIONS> ' +
            '   } ' +
            '  } ' +
            '  BIND("<NO_SELECTION_STRING>" AS ?facet_text) ' +
            ' } UNION ' +
            '  {' +
            '   SELECT DISTINCT ?cnt ?value ?facet_text {' +
            '    {' +
            '     SELECT DISTINCT (count(DISTINCT ?id) as ?cnt) ?value ?hierarchy ?lvl {' +
            '      { SELECT DISTINCT ?h { [] <ID> ?h . <SPECIFIER> } } ' +
            '      ?h (<HIERARCHY>)* ?value . ' +
            '      <LEVELS> ' +
            '      ?id <ID> ?h .' +
            '      <OTHER_SELECTIONS> ' +
            '     } GROUP BY ?hierarchy ?value ?lvl ORDER BY ?hierarchy ' +
            '    } ' +
            '    FILTER(BOUND(?value))' +
            '    BIND(COALESCE(?value, <http://ldf.fi/NONEXISTENT_URI>) AS ?labelValue) ' +
            '    <LABEL_PART> ' +
            '    BIND(COALESCE(?lbl, STR(?value)) as ?label) ' +
            '    BIND(CONCAT(?lvl, ?label) as ?facet_text)' +
            '   } ' +
            '  } ' +
            ' } ';

            options.queryTemplate = options.queryTemplate || queryTemplate;
            options.depth = angular.isUndefined(options.depth) ? 3 : options.depth;

            BasicFacet.call(this, options);

            // this.selectedValue;

            // Initial value
            var constVal = __.get(options, 'initial.' + this.facetId);
            if (constVal && constVal.value) {
                this._isEnabled = true;
                this.selectedValue = { value: constVal.value };
            }

            var triplePatternTemplate =
                ' ?<V_VAR> (<HIERARCHY>)* <SELECTED_VAL> . <SPECIFIER> ?id <ID> ?<V_VAR> . ';

            this.triplePatternTemplate = this.buildQueryTemplate(triplePatternTemplate);
        }

        function buildQueryTemplate(template) {
            var templateSubs = [
                {
                    placeHolder: /<ID>/g,
                    value: this.predicate
                },
                {
                    placeHolder: /<HIERARCHY>/g,
                    value: this.config.hierarchy
                },
                {
                    placeHolder: /<LABEL_PART>/g,
                    value: this.labelPart
                },
                {
                    placeHolder: /<NO_SELECTION_STRING>/g,
                    value: this.config.noSelectionString
                },
                {
                    placeHolder: /<V_VAR>/g,
                    value: 'seco_v_' + this.facetId
                },
                {
                    placeHolder: /\s+/g,
                    value: ' '
                }
            ];

            templateSubs.forEach(function(s) {
                template = template.replace(s.placeHolder, s.value);
            });
            return template;
        }

        function getConstraint() {
            if (!this.getSelectedValue()) {
                return;
            }
            var res = this.triplePatternTemplate
                .replace(/<SELECTED_VAL>/g, this.getSelectedValue())
                .replace(/<SPECIFIER>/g, this.getSpecifier().replace(/\?value/g, '?seco_v_' + this.facetId));

            return res;
        }

        function getSelectedValue() {
            var val;
            if (this.selectedValue) {
                val = this.selectedValue.value;
            }
            return val;
        }

        function fetchState(constraints) {
            var self = this;

            var query = self.buildQuery(constraints.constraint);

            return self.endpoint.getObjectsNoGrouping(query).then(function(results) {
                self._error = false;
                return results;
            }).catch(function(error) {
                self._isBusy = false;
                self._error = true;
                return $q.reject(error);
            });
        }

        // Build the facet query
        function buildQuery(constraints) {
            constraints = constraints || [];
            var query = this.queryTemplate
                .replace(/<OTHER_SELECTIONS>/g, this.getOtherSelections(constraints))
                .replace(/<LEVELS>/g, buildLevels(this.config.depth, this.config.hierarchy))
                .replace(/<SPECIFIER>/g, this.getSpecifier().replace(/\?value\b/g, '?h'));

            return query;
        }

        function buildLevels(count, hierarchyProperty) {
            var res = '';
            var template = ' OPTIONAL { ?value <PROPERTY> ?u0 . <HIERARCHY> }';
            for (var i = count; i > 0; i--) {
                var hierarchy = __.map(__.range(i - 1), function(n) { return '?u' + n + ' <PROPERTY> ?u' + (n + 1) + ' . '; }).join('') +
                    'BIND(CONCAT(' + __.map(__.rangeRight(i), function(n) { return 'STR(?u' + n + '),'; }).join('') + 'STR(?value)) AS ?_h) ' +
                    'BIND("' + __.repeat('-', i) + ' " AS ?lvl)';
                res = res += template.replace('<HIERARCHY>', hierarchy);
            }
            var end = ' OPTIONAL { BIND("" AS ?lvl) } BIND(COALESCE(?_h, STR(?value)) AS ?hierarchy) ';
            return res.replace(/<PROPERTY>/g, hierarchyProperty) + end;
        }
    }
})();

(function() {
    'use strict';

    HierarchyFacetController.$inject = ['$scope', '$controller', 'HierarchyFacet'];
    angular.module('seco.facetedSearch')
    .controller('HierarchyFacetController', HierarchyFacetController);

    /* ngInject */
    function HierarchyFacetController($scope, $controller, HierarchyFacet) {
        var args = { $scope: $scope, FacetImpl: HierarchyFacet };
        return $controller('AbstractFacetController', args);
    }
})();

(function() {
    'use strict';

    angular.module('seco.facetedSearch')
    .directive('secoHierarchyFacet', hierarchyFacet);

    function hierarchyFacet() {
        return {
            controller: 'HierarchyFacetController',
            controllerAs: 'vm',
            restrict: 'E',
            scope: {
                options: '='
            },
            templateUrl: 'src/facets/basic/facets.basic-facet.directive.html'
        };
    }
})();

angular.module('seco.facetedSearch').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('src/facets/facets.facet-wrapper.directive.html',
    "<div class=\"facet-wrapper\">\n" +
    "  <div class=\"facet\">\n" +
    "    <div class=\"card\">\n" +
    "      <div class=\"card-header\">\n" +
    "          <div class=\"alert alert-danger\" ng-if=\"vm.error\">{{ vm.error|limitTo:100 }}</div>\n" +
    "              <h5 color=\"info\" class=\"facet-name header\">{{ vm.facet.name }}<div class=\"facet-enable-btn-container float-sm-right\">\n" +
    "              <button ng-show=\"vm.hasChartButton()\"\n" +
    "                  class=\"btn btn-default btn-toggle-chart btn-xs pull-right\"\n" +
    "                  ng-click=\"vm.toggleChart()\">\n" +
    "                <span class=\"glyphicon glyphicon-stats\"></span>\n" +
    "              </button>\n" +
    "              <button\n" +
    "                  ng-disabled=\"vm.isLoading()\"\n" +
    "                  ng-click=\"vm.toggleFacetEnabled()\"\n" +
    "                  class=\"btn btn-primary btn-facet-toggle btn-sm\"\n" +
    "                  ng-class=\"vm.facet.isEnabled() ? 'btn-facet-close' : 'btn-facet-open'\">\n" +
    "                <span class=\"glyphicon\" ng-class=\"vm.facet.isEnabled() ? 'glyphicon-chevron-up' : 'glyphicon-chevron-down'\"></span>\n" +
    "              </button>\n" +
      "</h5>\n" +
    "      </div>\n" +
    "      <div class=\"card-body\" ng-if=\"vm.facet.isEnabled()\">\n" +
    "        <div class=\"col-xs-12 text-left\">\n" +
    "          <span spinner-key=\"vm.getSpinnerKey()\" spinner-start-active=\"true\"\n" +
    "                us-spinner=\"{radius:15, width:6, length: 20}\" ng-if=\"vm.isLoading()\"></span>\n" +
    "          <div ng-switch=\"vm.isChartVisible()\">\n" +
    "            <div ng-switch-when=\"true\">\n" +
    "              <canvas class=\"chart chart-pie\"\n" +
    "                chart-click=\"vm.handleChartClick\"\n" +
    "                chart-data=\"vm.chart.chartData.data\"\n" +
    "                chart-labels=\"vm.chart.chartData.labels\"></canvas>\n" +
    "            </div>\n" +
    "            <div ng-switch-default>\n" +
    "              <div class=\"facet-input-container\" ng-transclude></div>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('src/facets/basic/facets.basic-facet.directive.html',
    "<seco-facet-wrapper>\n" +
    "  <input\n" +
    "    ng-disabled=\"vm.isLoading()\"\n" +
    "    type=\"text\"\n" +
    "    class=\"form-control\"\n" +
    "    ng-model=\"textFilter\" />\n" +
    "  <select\n" +
    "    ng-change=\"vm.changed()\"\n" +
    "    ng-disabled=\"vm.isLoading()\"\n" +
    "    ng-attr-size=\"{{ vm.getFacetSize(vm.facet.getState()) }}\"\n" +
    "    id=\"{{ ::vm.facet.name + '_select' }}\"\n" +
    "    class=\"selector form-control\"\n" +
    "    ng-options=\"value as (value.text + ' (' + value.count + ')') for value in vm.facet.getState() | textWithSelection:textFilter:vm.facet.selectedValue track by value.value\"\n" +
    "    ng-model=\"vm.facet.selectedValue\">\n" +
    "  </select>\n" +
    "</seco-facet-wrapper>\n"
  );


  $templateCache.put('src/facets/text/facets.text-facet.directive.html',
    "<seco-facet-wrapper>\n" +
    "  <p class=\"input-group\">\n" +
    "    <input type=\"text\" class=\"form-control\"\n" +
    "      ng-change=\"vm.changed()\"\n" +
    "      ng-disabled=\"vm.isLoading()\"\n" +
    "      ng-model=\"vm.facet.selectedValue\"\n" +
    "      ng-model-options=\"{ debounce: 1000 }\">\n" +
    "    </input>\n" +
    "    <span class=\"input-group-btn\">\n" +
    "      <button type=\"button\" class=\"btn btn-default\"\n" +
    "        ng-disabled=\"vm.isDisabled()\"\n" +
    "        ng-click=\"vm.clear()\">\n" +
    "        <i class=\"glyphicon glyphicon-remove\"></i>\n" +
    "      </button>\n" +
    "    </span>\n" +
    "  </p>\n" +
    "</seco-facet-wrapper>\n"
  );


  $templateCache.put('src/facets/timespan/facets.timespan-facet.directive.html',
    "<seco-facet-wrapper>\n" +
    "  <div class=\"row no-gutter\">\n" +
    "    <div class=\"col-md-6 facet-date-left\">\n" +
    "      <span class=\"input-group\">\n" +
    "        <span class=\"input-group-btn\">\n" +
    "          <button type=\"button\" class=\"btn btn-default\"\n" +
    "            ng-disabled=\"vm.isLoading()\"\n" +
    "            ng-click=\"startDate.opened = !startDate.opened\">\n" +
    "            <i class=\"glyphicon glyphicon-calendar\"></i>\n" +
    "          </button>\n" +
    "        </span>\n" +
    "        <input type=\"text\" class=\"form-control\"\n" +
    "          uib-datepicker-popup=\"\"\n" +
    "          ng-readonly=\"true\"\n" +
    "          ng-change=\"vm.changed()\"\n" +
    "          ng-model=\"vm.facet.selectedValue.start\"\n" +
    "          is-open=\"startDate.opened\"\n" +
    "          show-button-bar=\"false\"\n" +
    "          datepicker-options=\"vm.facet.state.start\"\n" +
    "          close-text=\"Close\" />\n" +
    "      </span>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-6 facet-date-right\">\n" +
    "      <span class=\"input-group\">\n" +
    "        <span class=\"input-group-btn\">\n" +
    "          <button type=\"button\" class=\"btn btn-default\"\n" +
    "            ng-disabled=\"vm.isLoading()\"\n" +
    "            ng-click=\"endDate.opened = !endDate.opened\">\n" +
    "            <i class=\"glyphicon glyphicon-calendar\"></i>\n" +
    "          </button>\n" +
    "        </span>\n" +
    "        <input type=\"text\" class=\"form-control\"\n" +
    "          uib-datepicker-popup=\"\"\n" +
    "          ng-readonly=\"true\"\n" +
    "          ng-change=\"vm.changed()\"\n" +
    "          ng-model=\"vm.facet.selectedValue.end\"\n" +
    "          is-open=\"endDate.opened\"\n" +
    "          show-button-bar=\"false\"\n" +
    "          datepicker-options=\"vm.facet.state.end\"\n" +
    "          close-text=\"Close\" />\n" +
    "      </span>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</seco-facet-wrapper>\n"
  );


  $templateCache.put('src/facets/checkbox/facets.checkbox-facet.directive.html',
    "<seco-facet-wrapper>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-xs-12 text-left\">\n" +
    "      <div class=\"facet-input-container\">\n" +
    "        <div class=\"checkbox\" ng-repeat=\"choice in vm.facet.getState()\">\n" +
    "        <label>\n" +
    "          <input type=\"checkbox\"\n" +
    "            checklist-change=\"vm.changed()\"\n" +
    "            ng-disabled=\"(vm.isLoading() || !choice.count)\"\n" +
    "            class=\"selector checkbox\"\n" +
    "            checklist-model=\"vm.facet.selectedValue.value\"\n" +
    "            checklist-value=\"choice.value\" />\n" +
    "          {{ choice.text }} ({{ choice.count }})\n" +
    "        </label>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</seco-facet-wrapper>\n"
  );
}]);
