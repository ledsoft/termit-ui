import * as React from 'react';
import {FormControl, FormGroup} from 'react-bootstrap';
import AbstractInput, {AbstractInputProps} from "./AbstractInput";

export interface TextAreaProps extends AbstractInputProps {
    onKeyPress?: (e: object) => void
}

export default class TextArea extends AbstractInput<TextAreaProps> {

    private input: FormControl;

    public render() {
        return <FormGroup bsSize='small' validationState={this.props.validation}>
            {this.renderLabel()}
            <FormControl componentClass='textarea' style={{height: 'auto'}}
                         ref={(c: FormControl) => this.input = c} {...this.props}/>
            {this.props.validation && <FormControl.Feedback/>}
            {this.renderHelp()}
        </FormGroup>;
    }
}