import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {RouteComponentProps, withRouter} from "react-router";
import {connect} from "react-redux";
import {ThunkDispatch} from "../../util/Types";
import {loadVocabularyTerm} from "../../action/AsyncActions";
import TermMetadata from "./TermMetadata";
import Term from "../../model/Term";
import TermItState from "../../model/TermItState";
import {Card, CardBody, CardHeader} from "reactstrap";
import Vocabulary from "../../model/Vocabulary";

interface TermDetailProps extends HasI18n, RouteComponentProps<any> {
    term: Term | null;
    vocabulary: Vocabulary | null;
    loadTerm: (termName: string, vocabularyName: string, namespace?: string) => void;
}

export class TermDetail extends React.Component<TermDetailProps> {

    public componentDidMount(): void {
        this.loadTerm();
    }

    private loadTerm(): void {
        const vocabularyName: string = this.props.match.params.name;
        const termName: string = this.props.match.params.termName;
        this.props.loadTerm(termName, vocabularyName);
    }

    public componentDidUpdate(prevProps: TermDetailProps) {
        const currTermName = this.props.match.params.termName;
        const prevTermName = prevProps.match.params.termName;
        if (currTermName !== prevTermName) {
            this.loadTerm();
        }
    }

    public render() {
        if (!this.props.term || !this.props.vocabulary) {
            return null;
        }
        return <Card><CardHeader tag='h5' color='info' className='d-flex align-items-center'>
            <div className='flex-grow-1'>{this.props.term!.label}</div>
        </CardHeader>
            <CardBody>
                <TermMetadata term={this.props.term!} vocabulary={this.props.vocabulary!}/>
            </CardBody>

        </Card>
    }
}

export default connect((state: TermItState) => {
    return {
        term: state.selectedTerm,
        vocabulary: state.vocabulary
    };
}, (dispatch: ThunkDispatch) => {
    return {
        loadTerm: (termName: string, vocabularyName: string, namespace?: string) => dispatch(loadVocabularyTerm(termName, vocabularyName, namespace))
    };
})(injectIntl(withI18n(withRouter(TermDetail))));
