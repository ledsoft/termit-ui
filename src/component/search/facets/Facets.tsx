import * as React from "react";
import * as angular from "angular";
import {injectIntl} from "react-intl";
import {default as withI18n, HasI18n} from "../../hoc/withI18n";
import TermItState from "../../../model/TermItState";
import {connect} from "react-redux";
import {
    fireFacetedSearchFailed,
    fireFacetedSearchFinished,
    fireFacetedSearchRequested
} from "../../../action/SyncActions";
import Constants from "../../../util/Constants";
import "./semantic-faceted-search/semantic-faceted-search";

// import loadingLg from "./images/loading-lg.gif";
import controllerCreator from "./MainController";
import query from "./sparql.rq";
import {ThunkDispatch} from "../../../util/Types";
import withRemounting from "../../hoc/withRemounting";

interface Props extends HasI18n {
    lang: string,
    endpointUrl: string,
    fireFacetedSearchRequested: ()=>void
    fireFacetedSearchFinished: (data : object)=>void
    fireFacetedSearchFailed: (error : any)=>void
}

interface State {
    rootScope: any,
    data :any
}

export class Facets extends React.Component<Props, State> {

    private container: any;

    constructor(props: Props) {
        super(props);
        this.state = {
            rootScope: null,
            data : null
        };
    }

    private getSparqlQuery(lang: string) {
        return query.replace(/\?lang/g, "'" + lang + "'");
    }

    private fireQueryRequested() {
        this.props.fireFacetedSearchRequested();
    }

    private fireQueryFinished(data: any) {
        this.props.fireFacetedSearchFinished({data});
    }

    private fireQueryFailed(error:any) {
        this.props.fireFacetedSearchFailed(error);
    }

    private runAngular() {

        // If there are variables used in the constraint option (see above),
        // you can also give getResults another parameter that is the sort
        // order of the results (as a valid SPARQL ORDER BY sequence, e.g. "?id").
        // The results are sorted by URI (?id) by default.

        const controller = controllerCreator(
            this.props.endpointUrl,
            this.getResultOptions(),
            this.getFacets(),
            this.getFacetOptions(),
            this.fireQueryRequested.bind(this),
            this.fireQueryFinished.bind(this),
            this.fireQueryFailed.bind(this));
        // https://docs.angularjs.org/guide/di#inline-array-annotation
        controller.$inject = ["$scope", "FacetHandler", "FacetResultHandler", "facetUrlStateHandlerService"];
        angular.module("facetApp", ["seco.facetedSearch"])
            .config(["$provide", ($provide: any) => {
                $provide.decorator("$browser", ["$delegate", ($delegate: any) => {
                    $delegate.onUrlChange = () => {
                        ;
                    };
                    $delegate.url = () => {
                        return ""
                    };
                    return $delegate;
                }]);
            }])
            .controller("MainController", controller);
    }

    private destroyAngular() {
        if (this.state.rootScope) {
            this.state.rootScope.$destroy();
        }
    }

    public componentDidUpdate() {
        this.runAngular();
    }

    private getResultOptions() {
        return {
            pagesPerQuery: 1, // optional (default is 1)
            paging: true, // optional (default is true), if true, enable paging of the results
            prefixes:  // required if the queryTemplate uses prefixes
                " PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>" +
                " PREFIX skos: <http://www.w3.org/2004/02/skos/core#>" +
                " PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#type>" +
                " PREFIX zs: <https://onto.fel.cvut.cz/ontologies/ufo/>" +
                " PREFIX a-popis-dat: <http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/>",
            queryTemplate: this.getSparqlQuery(this.props.lang), // required
            resultsPerPage: 500, // optional (default is 10)
        };
    }

    private getFacets() {
        // Facet definitions
        // "facetId" is a "friendly" identifier for the facet,
        //  and should be unique within the set of facets.
        // "predicate" is the property that defines the facet (can also be
        //  a property path, for example).
        // "name" is the title of the facet to show to the user.
        // If "enabled" is not true, the facet will be disabled by default.
        return {
            // Text search facet for names
            slovnik: {
                enabled: true,
                facetId: "glosar",
                predicate: "(^skos:narrower)*/<http://www.w3.org/2004/02/skos/core#inScheme>/^<http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/má-glosář>",
                name: this.props.i18n("search.slovnik"),
            },

            pojem: {
                enabled: true,
                facetId: "pojem",
                name: this.props.i18n("search.pojem"),
                predicate: "<http://www.w3.org/2000/01/rdf-schema#label>",
            },
            typ: {
                enabled: true,
                facetId: "typ",
                name: this.props.i18n("search.typ"),
                predicate: "a",
            },
        };
    }

    private getFacetOptions() {
        return {
            rdfClass: "<http://www.w3.org/2004/02/skos/core#Concept>",
            endpointUrl: this.props.endpointUrl,
            preferredLang: this.props.lang
        }
    }

    public componentDidMount() {
        this.runAngular();
        angular.bootstrap(this.container, ["facetApp"]);
        const injector = angular.injector(["ng", "facetApp"]);
        this.setState({
            rootScope: injector.get("$rootScope")
        });
    }

    public componentWillUnmount() {
        this.destroyAngular();
    }

    public render() {
        const html = `
   <div ng-controller="MainController as vm">
    <div class="row">
      <div style="width:100%;">
        <seco-text-facet data-options="vm.facets.pojem"></seco-text-facet>
        <seco-basic-facet data-options="vm.facets.slovnik"></seco-basic-facet>
        <seco-basic-facet data-options="vm.facets.typ"></seco-basic-facet>
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
        endpointUrl: Constants.SERVER_URL+Constants.API_PREFIX+"/query"
    };
}, (dispatch: ThunkDispatch) => {
    return {
        fireFacetedSearchRequested: () => dispatch(fireFacetedSearchRequested()),
        fireFacetedSearchFinished: (data: any) => dispatch(fireFacetedSearchFinished(data)),
        fireFacetedSearchFailed: (error : any) => dispatch(fireFacetedSearchFailed(error))
    };
})(injectIntl(withI18n(withRemounting(Facets))));
