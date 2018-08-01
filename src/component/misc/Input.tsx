import * as React from 'react';
import {ControlLabel, FormControl, FormGroup, HelpBlock} from 'react-bootstrap';

interface InputProps {
    label?: string,
    value?: any,
    onChange: (e: object) => void,
    help?: string,
    validation?: 'success' | 'warning' | 'error',
    validationMessage?: string
}

export default class Input extends React.Component<InputProps> {

    private input: FormControl;

    public render() {
        return <FormGroup bsSize='small' validationState={this.props.validation}>
            {this.renderLabel()}
            <FormControl type='text' ref={(c: FormControl) => this.input = c} componentClass='input' {...this.props}/>
            {this.props.validation && <FormControl.Feedback/>}
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
