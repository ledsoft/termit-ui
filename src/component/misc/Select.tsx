import * as React from 'react';
import {FormFeedback, FormGroup, Input} from 'reactstrap';
import AbstractInput, {AbstractInputProps} from "./AbstractInput";

export default class Select extends AbstractInput<AbstractInputProps> {

    private input: any;

    public render() {
        return <FormGroup bsSize='small'>
            {this.renderLabel()}
            <Input type='select' ref={(c: any) => this.input = c} {...this.inputProps()}>
                {this.props.children}
            </Input>
            <FormFeedback>{this.props.invalidMessage}</FormFeedback>
            {this.renderHelp()}
        </FormGroup>;
    }
}
