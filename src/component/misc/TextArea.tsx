import * as React from 'react';
import {FormFeedback, FormGroup, Input} from 'reactstrap';
import AbstractInput, {AbstractInputProps} from "./AbstractInput";

export interface TextAreaProps extends AbstractInputProps {
    onKeyPress?: (e: object) => void
}

export default class TextArea extends AbstractInput<TextAreaProps> {

    private input: Input;

    public render() {
        return <FormGroup bsSize='small'>
            {this.renderLabel()}
            <Input type='textarea' style={{height: 'auto'}}
                   ref={(c: Input) => this.input = c} {...this.inputProps()}/>
            {this.props.invalid && this.props.invalidMessage &&
            <FormFeedback>{this.props.invalidMessage}</FormFeedback>}
            {this.renderHelp()}
        </FormGroup>;
    }
}