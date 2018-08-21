import * as React from 'react';
import {FormFeedback, FormGroup, Input} from 'reactstrap';
import AbstractInput, {AbstractInputProps} from "./AbstractInput";

export default class Select extends AbstractInput<AbstractInputProps> {

    private input: any;

    public render() {
        return <FormGroup bsSize='small' validationState={this.props.validation}>
            {this.renderLabel()}
            <Input type='select' ref={(c: any) => this.input = c} {...this.props}>
                {this.props.children}
            </Input>
            {this.props.validation && <FormFeedback/>}
            {this.renderHelp()}
        </FormGroup>;
    }
}
