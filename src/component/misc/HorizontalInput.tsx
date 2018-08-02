import * as React from 'react';
import {Col, ControlLabel, FormControl, FormGroup} from 'react-bootstrap';
import AbstractInput, {AbstractInputProps} from "./AbstractInput";

export interface HorizontalInputProps extends AbstractInputProps {
    type?: string,
    labelWidth: number
    inputWidth: number
    onKeyPress?: (e: React.KeyboardEvent<FormControl>) => void
}

export default class HorizontalInput extends AbstractInput<HorizontalInputProps> {

    private input: FormControl;

    public render() {
        const {labelWidth, inputWidth, ...rest} = this.props;
        return <FormGroup bsSize='small' validationState={this.props.validation}>
            <Col sm={labelWidth} componentClass={ControlLabel}>
                {this.renderLabel()}
            </Col>
            <Col sm={inputWidth}>
                <FormControl type={this.props.type ? this.props.type : 'text'} ref={(c: FormControl) => this.input = c}
                             componentClass='input' {...rest}/>
                {this.props.validation && <FormControl.Feedback/>}
                {this.renderHelp()}
            </Col>
        </FormGroup>;
    }
}
