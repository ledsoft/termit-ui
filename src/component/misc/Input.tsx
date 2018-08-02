import * as React from 'react';
import {FormControl, FormGroup} from 'react-bootstrap';
import AbstractInput, {AbstractInputProps} from "./AbstractInput";

export interface InputProps extends AbstractInputProps {
    type?: string,
    onKeyPress?: (e: React.KeyboardEvent<FormControl>) => void
}

export default class Input extends AbstractInput<InputProps> {

    private input: FormControl;

    public render() {
        return <FormGroup bsSize='small' validationState={this.props.validation}>
            {this.renderLabel()}
            <FormControl type={this.props.type ? this.props.type : 'text'} ref={(c: FormControl) => this.input = c}
                         componentClass='input' {...this.props}/>
            {this.props.validation && <FormControl.Feedback/>}
            {this.renderHelp()}
        </FormGroup>;
    }
}
