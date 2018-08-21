import * as React from 'react';
import {Input, FormGroup, FormFeedback} from 'reactstrap';
import AbstractInput, {AbstractInputProps} from "./AbstractInput";

export interface TextAreaProps extends AbstractInputProps {
    onKeyPress?: (e: object) => void
}

export default class TextArea extends AbstractInput<TextAreaProps> {

    private input: Input;

    public render() {
        return <FormGroup bsSize='small' validationState={this.props.validation}>
            {this.renderLabel()}
            <Input type='textarea' style={{height: 'auto'}}
                         ref={(c: Input) => this.input = c} {...this.props}/>
            {this.props.validation && <FormFeedback/>}
            {this.renderHelp()}
        </FormGroup>;
    }
}