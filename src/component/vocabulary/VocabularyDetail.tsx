import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Col, Row} from 'reactstrap';
import {RouteComponentProps} from "react-router";
import GlossaryTerms from "../term/GlossaryTerms";

export class VocabularyDetail extends React.Component<HasI18n & RouteComponentProps<any>> {

    public render() {
        const normalizedName = this.props.match.params.name;
        return <div>
            <h2 className='page-header'>{this.props.formatMessage('vocabulary.detail.title', {name: normalizedName})}</h2>
            <Row>
                <Col md={4}>
                    <GlossaryTerms/>
                </Col>
                <Col md={8}>
                    TODO - vocabulary detail / term detail
                </Col>
            </Row>
        </div>;
    }
}

export default injectIntl(withI18n(VocabularyDetail));