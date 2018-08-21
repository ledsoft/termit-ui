import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Card, CardTitle, CardBody, CardHeader} from 'reactstrap';
import {RouteComponentProps} from "react-router";

export class VocabularySummary extends React.Component<HasI18n & RouteComponentProps<any>> {

    public render() {
        const normalizedName = this.props.match.params.name;
        return <Card bsStyle='info'>
            <CardHeader>
                <CardTitle>{this.props.formatMessage('vocabulary.summary.title', {name: normalizedName})}</CardTitle>
            </CardHeader>
            <CardBody>
                TODO
            </CardBody>
        </Card>
    }
}

export default injectIntl(withI18n(VocabularySummary));