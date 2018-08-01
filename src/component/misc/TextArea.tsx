import * as React from 'react';
import {ControlLabel, FormControl, FormGroup, HelpBlock} from 'react-bootstrap';

interface TextAreaProps {
    type?: string,
    label?: string,
    value?: any,
    onChange: (e: object) => void,
    help?: string,
    validation?: 'success' | 'warning' | 'error',
    validationMessage?: string
}

export default class TextArea extends React.Component<TextAreaProps> {

    private input: FormControl;

    public render() {
        return <FormGroup bsSize='small' validationState={this.props.validation}>
            {this.renderLabel()}
            <FormControl componentClass='textarea' style={{height: 'auto'}}
                         ref={(c: FormControl) => this.input = c} {...this.props}/>
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