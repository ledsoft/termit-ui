import * as React from 'react';
import {FormControl, FormGroup} from 'react-bootstrap';
import AbstractInput, {AbstractInputProps} from "./AbstractInput";

export default class Select extends AbstractInput<AbstractInputProps> {

    private input: FormControl;

    public render() {
        return <FormGroup bsSize='small' validationState={this.props.validation}>
            {this.renderLabel()}
            <FormControl componentClass='select' ref={(c: FormControl) => this.input = c} {...this.props}>
                {this.props.children}
            </FormControl>
            {this.props.validation && <FormControl.Feedback title={this.props.validationMessage}/>}
            {this.renderHelp()}
        </FormGroup>;
    }
}
