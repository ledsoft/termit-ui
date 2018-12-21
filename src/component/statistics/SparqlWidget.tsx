import * as React from "react";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {QueryResultIF} from "../../model/QueryResult";
import {executeQuery} from "../../action/AsyncActions";
import * as _ from "lodash";
import {ThunkDispatch} from "../../util/Types";
import FullscreenablePanelWithActions from "../misc/FullscreenablePanelWithActions";

interface Props {
    title: string;
    sparqlQuery: string;
    componentFunction: (qr: QueryResultIF) => JSX.Element;
}

interface InternalProps {
    queryResults: any;
}

interface InternalActions {
    executeQuery: (queryString: string) => any;
}

export class SparqlWidget extends React.Component<Props & InternalProps & InternalActions> {

    public componentDidMount() {
        this.change();
    }

    public componentDidUpdate(prevProps: Props & InternalProps & InternalActions) {
        if (!_.isEqual(this.props.queryResults[this.props.sparqlQuery]
            , prevProps.queryResults[this.props.sparqlQuery]
        )) {
            this.change();
        }
    }

    private change() {
        this.props.executeQuery(this.props.sparqlQuery);
    }

    public render() {
        return <FullscreenablePanelWithActions
                title={this.props.title}
                actions={[]}
                component={this.props.componentFunction(this.props.queryResults[this.props.sparqlQuery])}/>;
    }
};

export default connect((state: TermItState): InternalProps => {
    return {
        queryResults: state.queryResults
    };
}, (dispatch: ThunkDispatch): InternalActions => {
    return {
        executeQuery: (queryString: string) => dispatch(executeQuery(queryString))
    };
})(SparqlWidget);