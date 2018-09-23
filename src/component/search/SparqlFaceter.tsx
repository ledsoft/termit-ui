import * as React from "react";
import * as angular from "angular";
import controllerCreator from './MainController';
import {HasI18n, default as withI18n} from "../hoc/withI18n";
import query from './sparql.rq';
import "./semantic-faceted-search/semantic-faceted-search";

function getSparqlQuery(lang : string) {
    return query.replace(/\?lang/g, "'" + lang + "'");
}

import {injectIntl} from "react-intl";

interface Props extends HasI18n {
    lang:string,
    endpointUrl:string,
}

interface State  {
    rootScope : any,
}

class SparqlFaceter extends React.Component<Props, State> {

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
            .controller('MainController', controllerCreator(
                this.props.lang,
                this.props.i18n,
                this.props.endpointUrl,
                getSparqlQuery(this.props.lang)));
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

    public componentWillUpdate() {
        this.runAngular();
    }

    public componentDidMount() {
        this.runAngular();
        angular.bootstrap(this.container, ['facetApp']);
        const injector = angular.injector(['ng', 'facetApp']);
        if (injector) {
            const rootScope = injector.get('$rootScope');
            // if (this.container) {
            //     injector.get('$compile')(this.container)(rootScope);
            // }
            // rootScope.$apply();

            this.setState({
                rootScope
            });
        }

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
              <th>`+this.props.i18n('search.pojem')+`</th>
              <th>`+this.props.i18n('search.informace')+`</th>
              <th>`+this.props.i18n('search.slovnik')+`</th>
            </tr>
          </thead>
          <tbody>   
            <tr ng-repeat="pojem in vm.page">              
              <td style="width:20%">
                <p ng-if="pojem">{{ getLabel(pojem) }}<a ng-href="{{ pojem.id }}">↱</a></p>             
              </td>
              <td style="width:50%">

                <p ng-if="pojem.nadtyp"><span style="font-weight: bold">`+this.props.i18n('search.je-specializaci')+`</span> <span ng-repeat="nadtyp in (isArray(pojem.nadtyp) ? pojem.nadtyp : [pojem.nadtyp])">{{ getLabel(nadtyp)}}<a ng-href="{{ nadtyp.id }}">↱</a><span ng-if="!$last">,&nbsp;</span></span></p>

                <p ng-if="pojem.typ">`+this.props.i18n('search.je-instanci-typu')+` <span ng-repeat="typ in (isArray(pojem.typ) ? pojem.typ : [pojem.typ])">{{ getLabel(typ)}}<a ng-href="{{ typ.id }}">↱</a><span ng-if="!$last">,&nbsp;</span></span>
                </p>

                <p ng-if="pojem.definice" style="font-style:italic">
                ☛ {{pojem.definice}}
                </p>

                </p>
                <p ng-if="pojem.typvlastnosti">
                `+this.props.i18n('search.ma-vlastnosti-typu')+`
                 	<ul ng-if="pojem.typvlastnosti">
              			<li ng-repeat="typvlastnosti in vm.makeArray(pojem.typvlastnosti)">
            			    <a ng-href="{{ typvlastnosti.id }}">{{ getLabel(typvlastnosti) }}</a>
              			</li>
            			</ul>
                </p>

            		<p ng-if="pojem.typvztahu">
                `+this.props.i18n('search.ma-vztahy-typu')+`
                 	<ul ng-if="pojem.typvztahu">
              			<li ng-repeat="typvztahu in vm.makeArray(pojem.typvztahu)">
            			    <a ng-href="{{ typvztahu.id }}">{{ getLabel(typvztahu) }}</a>
              			</li>
              		</ul>
                </p>
              </td>
              <td>
                 <a ng-href="{{ pojem.glosar.link }}">{{ getLabel(pojem.glosar) }}</a>
                 <a ng-href="{{ pojem.glosar.id }}">↱</a>
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

export default injectIntl(withI18n(SparqlFaceter));