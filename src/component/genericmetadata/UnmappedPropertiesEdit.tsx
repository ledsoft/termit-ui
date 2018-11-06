import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Button, Col, Row} from "reactstrap";
import CustomInput from "../misc/CustomInput";
import {GoX} from "react-icons/go";

interface UnmappedPropertiesEditProps extends HasI18n {
    properties: Map<string, string[]>;
}

export class UnmappedPropertiesEdit extends React.Component<UnmappedPropertiesEditProps> {

    public render() {
        return <div>
            {this.renderRows()}
        </div>;
    }

    private renderRows() {
        const i18n = this.props.i18n;
        const properties = this.props.properties;
        const result: JSX.Element[] = [];
        properties.forEach((values, k) => values.forEach(value => result.push(<Row key={k + '-' + value}>
            <Col xs={6}><CustomInput defaultValue={k} label={i18n('unmapped.properties.property')}/></Col>
            <Col xs={5}><CustomInput defaultValue={value} label={i18n('unmapped.properties.value')}/></Col>
            <Col xs={1} className='d-flex align-items-end'><Button size='sm' color='danger'
                                                            className='form-group align-bottom'><GoX/></Button></Col>
        </Row>)));
        return result;
    }
}

export default injectIntl(withI18n(UnmappedPropertiesEdit));