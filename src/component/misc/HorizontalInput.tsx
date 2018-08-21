import * as React from 'react';
import {Col, FormFeedback, FormGroup, Input, Label} from 'reactstrap';
import AbstractInput, {AbstractInputProps} from "./AbstractInput";

export interface HorizontalInputProps extends AbstractInputProps {
    labelWidth: number
    inputWidth: number
    onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export default class HorizontalInput extends AbstractInput<HorizontalInputProps> {

    private input: any;

    public render() {
        const {labelWidth, inputWidth, ...rest} = this.props;
        return <FormGroup bsSize='small' validationState={this.props.validation}>
            <Label sm={labelWidth}>
                {this.props.label}
            </Label>
            <Col sm={inputWidth}>
                <Input type={this.props.type ? this.props.type : 'text'} ref={(c: any) => this.input = c}
                             {...rest}/>
                {this.props.validation && <FormFeedback/>}
                {this.renderHelp()}
            </Col>
        </FormGroup>;
    }
}
