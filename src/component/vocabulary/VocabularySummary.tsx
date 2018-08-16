import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Panel} from 'react-bootstrap';
import {RouteComponentProps} from "react-router";

export class VocabularySummary extends React.Component<HasI18n & RouteComponentProps<any>> {

    public render() {
        const normalizedName = this.props.match.params.name;
        return <Panel bsStyle='info'>
            <Panel.Heading>
                <Panel.Title>{this.props.formatMessage('vocabulary.summary.title', {name: normalizedName})}</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
                TODO
            </Panel.Body>
        </Panel>
    }
}

export default injectIntl(withI18n(VocabularySummary));