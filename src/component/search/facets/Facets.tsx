import * as React from "react";
import * as angular from "angular";
import {injectIntl} from "react-intl";
import {default as withI18n, HasI18n} from "../../hoc/withI18n";
import TermItState from "../../../model/TermItState";
import {connect} from "react-redux";
import {
    fireFacetedSearchFailed,
    fireFacetedSearchFinished,
    fireFacetedSearchRequested,
    selectVocabularyTerm
} from "../../../action/SyncActions";
import Constants from "../../../util/Constants";
import "./semantic-faceted-search/semantic-faceted-search";

// import loadingLg from './images/loading-lg.gif';
import controllerCreator from './MainController';
import query from './sparql.rq';
import {ThunkDispatch} from "../../../util/Types";
import withRemounting from "../../hoc/withRemounting";

interface Props extends HasI18n {
    lang: string,
    endpointUrl: string,
    fireFacetedSearchRequested: ()=>void
    fireFacetedSearchFinished: (data : object)=>void
    fireFacetedSearchFailed: ()=>void
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

    private fireQueryFailed() {
        this.props.fireFacetedSearchFailed();
    }

    private runAngular() {
        const controller = controllerCreator(
            this.props.lang,
            this.props.i18n,
            this.props.endpointUrl,
            this.getSparqlQuery(this.props.lang),
            this.getFacets(),
            this.getFacetOptions(),
            this.fireQueryRequested.bind(this),
            this.fireQueryFinished.bind(this),
            this.fireQueryFailed.bind(this));
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
  <div  ng-controller="MainController as vm">
   <div class="row">
      <!--<div class="col-md-12">-->
        <div ng-if="vm.error">
          <uib-alert type="danger">{{ vm.error }}</uib-alert>
        </div>
      <!--</div>-->
    </div>
    <div class="row">
      <div class="col-md-20">
        <!-- Facets are defined here using the configurations defined in the controller -->
        <seco-text-facet data-options="vm.facets.pojem"></seco-text-facet>
        <seco-basic-facet data-options="vm.facets.glosar"></seco-basic-facet>
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
        endpointUrl: Constants.endpoint_url
    };
}, (dispatch: ThunkDispatch) => {
    return {
        selectVocabularyTerm: (selectedTerm: any) => dispatch(selectVocabularyTerm(selectedTerm)),
        fireFacetedSearchRequested: () => dispatch(fireFacetedSearchRequested()),
        fireFacetedSearchFinished: (data: any) => dispatch(fireFacetedSearchFinished(data)),
        fireFacetedSearchFailed: () => dispatch(fireFacetedSearchFailed())
    };
})(injectIntl(withI18n(withRemounting(Facets))));