import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Badge, Button, Input, InputGroup, InputGroupAddon, Label} from "reactstrap";
import {GoPlus, GoX} from "react-icons/go";

interface TermSourcesEditProps extends HasI18n {
    sources: string[];
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
        if (e.key === 'Enter') {
            this.onAdd();
        }
    };

    private onAdd = () => {
        if (this.state.inputValue.length === 0) {
            return;
        }
        const newSources = this.props.sources.slice();
        newSources.push(this.state.inputValue);
        this.props.onChange(newSources);
        this.setState({inputValue: ''});
    };

    private onRemove = (source: string) => {
        const newSources = this.props.sources.slice();
        newSources.splice(newSources.indexOf(source), 1);
        this.props.onChange(newSources);
    };

    public render() {
        const i18n = this.props.i18n;
        return <div>
            <Label className='attribute-label'>{i18n('term.metadata.source')}</Label>
            {this.renderSources()}
            <InputGroup className="form-group">
                <Input bsSize='sm' value={this.state.inputValue} onChange={this.onChange} onKeyPress={this.onKeyPress}
                       placeholder={i18n('term.metadata.source.add.placeholder')}/>
                <InputGroupAddon addonType='append'>
                    <Button color='primary' size='sm' onClick={this.onAdd} className='term-edit-source-add-button'
                            title={i18n('term.metadata.source.add.placeholder')}><GoPlus/> {i18n('term.metadata.source.add.placeholder.text')}</Button>
                </InputGroupAddon>
            </InputGroup>
        </div>;
    }

    private renderSources() {
        const sources = this.props.sources;
        if (sources.length === 0) {
            return null;
        }
        return <ul className='term-items'>
            {sources.map(s => <li key={s}>
                {s}
                <Badge color='danger' title={this.props.i18n('term.metadata.source.remove.title')}
                       className='term-edit-source-remove align-middle'
                       onClick={this.onRemove.bind(null, s)}><GoX/> {this.props.i18n('term.metadata.source.remove.text')}</Badge>
            </li>)}
        </ul>;
    }
}

export default injectIntl(withI18n(TermSourcesEdit));