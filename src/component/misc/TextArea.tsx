import * as React from "react";
import {FormFeedback, FormGroup, Input} from "reactstrap";
import AbstractInput, {AbstractInputProps} from "./AbstractInput";

export interface TextAreaProps extends AbstractInputProps {
    onKeyPress?: (e: object) => void;
    rows?: number;
}

export default class TextArea extends AbstractInput<TextAreaProps> {

    protected input: Input<{}>;

    public render() {
        return <FormGroup>
            {this.renderLabel()}
            <Input type="textarea" style={{height: "auto"}}
                   ref={(c: Input<{}>) => this.input = c} {...this.inputProps()}/>
            <FormFeedback>{this.props.invalidMessage}</FormFeedback>
            {this.renderHelp()}
        </FormGroup>;
    }
}
