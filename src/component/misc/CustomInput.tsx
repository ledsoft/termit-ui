import * as React from 'react';
import {Input, FormGroup} from 'reactstrap';
import AbstractInput, {AbstractInputProps} from "./AbstractInput";
import {FormFeedback} from "reactstrap";

export interface InputProps extends AbstractInputProps {
    onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export default class CustomInput extends AbstractInput<InputProps> {

    private input: any ;

    public render() {
        return <FormGroup validationState={this.props.validation}>
            {this.renderLabel()}
            <Input type={this.props.type ? this.props.type : 'text'} ref={(c: any ) => this.input = c} bsSize='sm'
                   {...this.props}/>
            {this.props.validation && <FormFeedback/>}
            {this.renderHelp()}
        </FormGroup>;
    }
}
