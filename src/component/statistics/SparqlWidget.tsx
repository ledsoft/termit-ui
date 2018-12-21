import * as React from "react";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {executeQuery} from "../../action/AsyncActions";
import * as _ from "lodash";
import {ThunkDispatch} from "../../util/Types";

export interface PublicProps extends OutputProps, InputProps {}

interface OutputProps {
    queryResults: any,
}

interface InputProps {
    sparqlQuery: string
}

interface InternalActions {
    executeQuery: (queryString: string) => any;
}

export default function SparqlWidget<P extends PublicProps>(Component: React.ComponentType<OutputProps & P>): React.ComponentClass<Pick<P,Exclude<keyof P, keyof (OutputProps & InternalActions)>>>  {

    class Wrapper extends React.Component<PublicProps & InternalActions & P> {

        public componentDidMount() {
            this.change();
        }

        public componentDidUpdate(prevProps: PublicProps & InternalActions & P) {
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
            return <Component {...this.props} queryResults={this.props.queryResults[this.props.sparqlQuery]}/>;
        }
    }

    return connect((state: TermItState) => {
        return {
            queryResults: state.queryResults
        };
    }, (dispatch: ThunkDispatch): InternalActions => {
        return {
            executeQuery: (queryString: string) => dispatch(executeQuery(queryString))
        };
    })(Wrapper);
}
