import * as React from "react";
import * as angular from "angular";
import * as seco from "./semantic-faceted-search/semantic-faceted-search";
// import * as query from 'raw-loader!./sparql.rq';
import serviceX from './Service';
import controllerCreator from './MainController';
import {HasI18n} from "../hoc/withI18n";


// const langX = 'cs';

interface Props extends HasI18n {
    lang:string
}

interface State  {
    rootScope : any,
}

class SparqlFaceter extends React.Component<HasI18n, State> {

    private container : any;

    constructor(props : Props) {
        super(props);
        this.state = {
            rootScope: null
        };
    }

    private runAngular() {
        angular.module('facetApp', ['seco.facetedSearch'])
            .config(['$provide', ($provide : any) => {
                $provide.decorator('$browser', ['$delegate', ($delegate : any) => {
                    $delegate.onUrlChange = () => {
                        ;
                    };
                    $delegate.url = () => {
                        return ""
                    };
                    return $delegate;
                }]);
            }])
            .controller('MainController', controllerCreator(this.props.lang,
                this.props.i18n))
            .service('service', serviceX);
        angular.bootstrap(this.container, ['facetApp']);
        const injector = angular.injector(['ng', 'facetApp']);
        const rootScope = injector.get('$rootScope');
        // if (this.container) {
        //     injector.get('$compile')(this.container)(rootScope);
        // }
        // rootScope.$apply();

        this.setState({
            rootScope
        });
    }

    private destroyAngular() {
        if (this.state.rootScope) {
            this.state.rootScope.$destroy();
        }
    }

    // public componentDidUpdate(prevProps : Props, prevState : State, snapshot) {
    //     if (prevProps.lang !== this.props.lang) {
    //         this.destroyAngular();
    //         this.runAngular();
    //     }
    // }

    public componentDidMount() {

        this.runAngular();
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
        return (<div ref={c => this.container = c} dangerouslySetInnerHTML={{__html: html}}/>);
    }
}

export default SparqlFaceter;