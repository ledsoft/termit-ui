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
        const {labelWidth, inputWidth, invalidMessage, help, ...rest} = this.props;
        return <FormGroup row={true}>
            <Label sm={labelWidth}>
                {this.props.label}
            </Label>
            <Col sm={inputWidth}>
                <Input type={this.props.type ? this.props.type : "text"} ref={(c: any) => this.input = c}
                       {...rest}/>
                <FormFeedback>{invalidMessage}</FormFeedback>
                {this.renderHelp()}
            </Col>
        </FormGroup>;
    }
}
