import * as React from 'react';
import {FormFeedback, FormGroup, Input} from 'reactstrap';
import AbstractInput, {AbstractInputProps} from "./AbstractInput";

export default class Select extends AbstractInput<AbstractInputProps> {

    private input: any;

    public render() {
        return <FormGroup bsSize='small'>
            {this.renderLabel()}
            <Input type='select' ref={(c: any) => this.input = c} {...this.props}>
                {this.props.children}
            </Input>
            {this.props.invalid && this.props.invalidMessage &&
            <FormFeedback>{this.props.invalidMessage}</FormFeedback>}
            {this.renderHelp()}
        </FormGroup>;
    }
}
