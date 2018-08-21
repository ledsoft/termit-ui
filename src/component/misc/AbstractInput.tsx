import * as React from 'react';
import {Label, FormText} from "reactstrap";
import {InputType} from "../../../node_modules/@types/reactstrap/lib/Input";

export interface AbstractInputProps {
    name?: string,
    label?: string,
    placeholder?: string,
    title?: string,
    value?: string,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
    help?: string,
    validation?: 'success' | 'warning' | 'error',
    autoFocus?: boolean
    type?: InputType,
}

export default class AbstractInput<T extends AbstractInputProps> extends React.Component<T> {

    protected renderLabel() {
        return this.props.label ? <Label>{this.props.label}</Label> : null;
    }

    protected renderHelp() {
        return this.props.help ? <FormText>{this.props.help}</FormText> : null;
    }
}
