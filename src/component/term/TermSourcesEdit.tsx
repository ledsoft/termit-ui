import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Button, Input, InputGroup, InputGroupAddon, Label} from "reactstrap";
import {GoPlus} from "react-icons/go";

interface TermSourcesEditProps extends HasI18n {
    sources: string[] | undefined;
    onChange: (sources: string[]) => void;
}

interface TermSourcesEditState {
    inputValue: string;
}

export class TermSourcesEdit extends React.Component<TermSourcesEditProps, TermSourcesEditState> {
    constructor(props: TermSourcesEditProps) {
        super(props);
        this.state = {
            inputValue: ''
        };
    }

    private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({inputValue: e.currentTarget.value});
    };

    private onKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && this.state.inputValue.length > 0) {
            this.onAdd();
        }
    };

    private onAdd = () => {
        const newSources = this.getSources().slice();
        newSources.push(this.state.inputValue);
        this.props.onChange(newSources);
        this.setState({inputValue: ''});
    };

    private getSources(): string[] {
        return this.props.sources ? (Array.isArray(this.props.sources) ? this.props.sources : [this.props.sources]) : [];
    }

    public render() {
        return <div>
            <Label className='col-form-label-sm'>{this.props.i18n('term.metadata.source')}</Label>
            <ul className='term-items'>
                {this.getSources().map(s => <li key={s}>{s}</li>)}
            </ul>
            <InputGroup>
                <Input bsSize='sm' value={this.state.inputValue} onChange={this.onChange} onKeyPress={this.onKeyPress}
                       placeholder={this.props.i18n('term.metadata.source.add.placeholder')}/>
                <InputGroupAddon addonType='append'>
                    <Button color='success' size='sm' onClick={this.onAdd}><GoPlus/></Button>
                </InputGroupAddon>
            </InputGroup>
        </div>;
    }
}

export default injectIntl(withI18n(TermSourcesEdit));