import * as React from 'react';
import {ControlLabel, FormControl, HelpBlock} from "react-bootstrap";
import {FormEvent} from "react";

export interface AbstractInputProps {
    name?: string,
    label?: string,
    placeholder?: string,
    title?: string,
    value?: string,
    onChange?: (e: FormEvent<FormControl>) => void,
    help?: string,
    validation?: 'success' | 'warning' | 'error',
    validationMessage?: string,
    autoFocus?: boolean
}

export default class AbstractInput<T extends AbstractInputProps> extends React.Component<T> {

    protected renderLabel() {
        return this.props.label ? <ControlLabel>{this.props.label}</ControlLabel> : null;
    }

    protected renderHelp() {
        return this.props.help ? <HelpBlock>{this.props.help}</HelpBlock> : null;
    }
}
