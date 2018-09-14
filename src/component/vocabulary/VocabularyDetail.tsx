import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Col, Row} from 'reactstrap';
import {Route, RouteComponentProps, Switch} from "react-router";
import GlossaryTerms from "../term/GlossaryTerms";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {ThunkDispatch} from "redux-thunk";
import {Action} from "redux";
import {loadVocabulary} from "../../action/ComplexActions";
import Vocabulary from "../../model/Vocabulary";
import './VocabularyDetail.scss';
import OutgoingLink from "../misc/OutgoingLink";
import VocabularyDetailTabPanel from "./VocabularyDetailTabPanel";
import Routes from "../../util/Routes";
import CreateVocabularyTerm from "../term/forms/CreateVocabularyTerm";
// @ts-ignore
import data from './../../util/__mocks__/generated-data.json' // TODO remove
import FetchOptionsFunction from "../../model/Functions";

interface VocabularyDetailProps extends HasI18n, RouteComponentProps<any> {
    vocabulary: Vocabulary,
    loadVocabulary: (normalizedName: string) => void
}

export class VocabularyDetail extends React.Component<VocabularyDetailProps> {

    public componentDidMount(): void {
        const normalizedName = this.props.match.params.name;
        this.props.loadVocabulary(normalizedName);
    }

    private fetchOptions({searchString, optionID, limit, offset}: FetchOptionsFunction): Promise<any[]> {
        return new Promise((resolve) => {
            // TODO fetch options from the server
            setTimeout(resolve, 1000, [])
        });
    }

    public render() {
        const name = this.props.vocabulary.name;
        const author = this.props.vocabulary.author && this.props.vocabulary.author.fullName;
        const created = new Date(this.props.vocabulary.created as number).toLocaleString();
        const vocabularyDetailTabPanel = () => <VocabularyDetailTabPanel
            vocabulary={this.props.vocabulary}
        />;
        // @ts-ignore
        const createVocabularyTerm = () => <CreateVocabularyTerm
            valueKey={"value"} // TODO get this value from env or backend
            labelKey={"label"} // TODO get this value from env or backend
            childrenKey={"children"} // TODO get this value from env or backend
            options={data} // TODO fetch default data from backend
            fetchOptions={this.fetchOptions}
        />;

        return <div>
            <h2 className='page-header'>
                <OutgoingLink
                    label={name}
                    iri={this.props.vocabulary.iri as string}
                />
            </h2>
            <h6>{this.props.formatMessage('vocabulary.detail.subtitle', {author, created})}</h6>
            <Row className='detail-row'>
                <Col md={4}>
                    <GlossaryTerms
                        valueKey={"value"} // TODO get this value from env or backend
                        labelKey={"label"} // TODO get this value from env or backend
                        childrenKey={"children"} // TODO get this value from env or backend
                        options={data} // TODO fetch default data from backend
                        fetchOptions={this.fetchOptions}
                    />
                </Col>
                <Col md={8}>
                    <Switch>
                        <Route path={Routes.vocabularyDetail.path} component={vocabularyDetailTabPanel}/>
                        <Route path={Routes.createVocabularyTerm.path} component={createVocabularyTerm}/>
                    </Switch>
                </Col>
            </Row>
        </div>;
    }
}

export default connect((state: TermItState) => {
    return {
        vocabulary: state.vocabulary
    };
}, (dispatch: ThunkDispatch<object, undefined, Action>) => {
    return {
        loadVocabulary: (normalizedName: string) => dispatch(loadVocabulary(normalizedName))
    };
})(injectIntl(withI18n(VocabularyDetail)));