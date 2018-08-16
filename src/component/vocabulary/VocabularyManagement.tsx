import * as React from 'react';
import {injectIntl} from 'react-intl';
import {Col} from 'react-bootstrap';
import withI18n, {HasI18n} from "../hoc/withI18n";
import Vocabularies from "./Vocabularies";
import {Route, Switch} from "react-router";
import Routes from '../../util/Routes';
import CreateVocabulary from "./CreateVocabulary";
import VocabularySummary from "./VocabularySummary";

class VocabularyManagement extends React.Component<HasI18n> {
    constructor(props: HasI18n) {
        super(props);
    }

    public render() {
        const i18n = this.props.i18n;
        return <div>
            <h2 className='page-header'>{i18n('vocabulary.management')}</h2>
            <div className='row'>
                <Col className='col-md-4'>
                    <Vocabularies/>
                </Col>
                <Col className='col-md-8'>
                    <Switch>
                        <Route path={Routes.createVocabulary.path} component={CreateVocabulary}/>
                        <Route path={Routes.vocabularySummary.path} component={VocabularySummary} exact={true}/>
                    </Switch>
                </Col>
            </div>
        </div>;
    }
}

export default injectIntl(withI18n(VocabularyManagement));