import * as React from 'react';
import {injectIntl} from 'react-intl';
import {Col} from 'reactstrap';
import withI18n, {HasI18n} from "../hoc/withI18n";
import Vocabularies from "./Vocabularies";
import {Switch} from "react-router";
import Routes from '../../util/Routes';
import CreateVocabulary from "./CreateVocabulary";
import VocabularySummary from "./VocabularySummary";
import BreadcrumbRoute from "../breadcrumb/BreadcrumbRoute";
import DynamicBreadcrumbRoute from "../breadcrumb/DynamicBreadcrumbRoute";
import VocabularyFileDetailRoute from "./VocabularyFileDetailRoute";

function removeLastLocation(path: string): string {
    return path.replace(/\/[^/]*$/, "");
}

class VocabularyManagement extends React.Component<HasI18n> {
    constructor(props: HasI18n) {
        super(props);
    }

    public render() {
        const i18n = this.props.i18n;

        return <Switch>
            <DynamicBreadcrumbRoute asset="vocabulary" path={removeLastLocation(Routes.annotateVocabularyFile.path)}
                                    component={VocabularyFileDetailRoute}/>
            <div>
                <h2 className='page-header'>{i18n('vocabulary.management')}</h2>
                <div className='row'>
                    <Col md={4}>
                        <Vocabularies/>
                    </Col>
                    <Col md={8}>
                        <Switch>
                            <BreadcrumbRoute title={i18n("vocabulary.create.title")} path={Routes.createVocabulary.path}
                                             component={CreateVocabulary}/>
                            <DynamicBreadcrumbRoute asset="vocabulary" path={Routes.vocabularySummary.path}
                                                    includeSearch={true} component={VocabularySummary} exact={true}/>
                        </Switch>
                    </Col>
                </div>
            </div>
        </Switch>;
    }
}

export default injectIntl(withI18n(VocabularyManagement));