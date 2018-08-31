import * as React from 'react';
import {Input, FormGroup} from 'reactstrap';
import AbstractInput, {AbstractInputProps} from "./AbstractInput";
import {FormFeedback} from "reactstrap";

export interface InputProps extends AbstractInputProps {
    onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export default class CustomInput extends AbstractInput<InputProps> {

    private input: any;

    public render() {
        return <FormGroup>
            {this.renderLabel()}
            <Input type={this.props.type ? this.props.type : 'text'} ref={(c: any) => this.input = c}
                   bsSize='sm' {...this.inputProps()}/>
            {this.props.invalid && this.props.invalidMessage &&
            <FormFeedback>{this.props.invalidMessage}</FormFeedback>}
            {this.renderHelp()}
        </FormGroup>;
    }
}
