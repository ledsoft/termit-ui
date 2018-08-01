import * as React from 'react';
import {ControlLabel, FormControl, FormGroup, HelpBlock} from 'react-bootstrap';

interface SelectProps {
    type?: string,
    label?: string,
    value?: any,
    onChange: (e: object) => void,
    help?: string,
    validation?: 'success' | 'warning' | 'error',
    validationMessage?: string
}

export default class Select extends React.Component<SelectProps> {

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

    private renderLabel() {
        return this.props.label ? <ControlLabel>{this.props.label}</ControlLabel> : null;
    }

    private renderHelp() {
        return this.props.help ? <HelpBlock>{this.props.help}</HelpBlock> : null;
    }
}
