import * as React from "react";
import {Route, RouteComponentProps, Switch} from "react-router";
import Routes from "../../util/Routes";
import VocabularyDetail from "./VocabularyDetail";
import VocabularyManagement from "./VocabularyManagement";
import DynamicBreadcrumbRoute from "../breadcrumb/DynamicBreadcrumbRoute";

const VocabularyManagementRoute: React.SFC<RouteComponentProps<any>> = () => {
    return <Switch>
        <DynamicBreadcrumbRoute asset="vocabulary" path={Routes.vocabularyDetail.path} component={VocabularyDetail}
                                includeSearch={true}/>
        <Route component={VocabularyManagement}/>
    </Switch>;
};

export default VocabularyManagementRoute;