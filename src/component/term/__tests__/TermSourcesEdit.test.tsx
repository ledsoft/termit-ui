import * as React from 'react';
import {mountWithIntl} from "../../../__tests__/environment/Environment";
import {TermSourcesEdit} from "../TermSourcesEdit";
import {formatMessage, i18n} from "../../../__tests__/environment/IntlUtil";
import {Button} from "reactstrap";

describe('TermSourcesEdit', () => {

    let onChange: (sources: string[]) => void;

    beforeEach(() => {
        onChange = jest.fn();
    });

    it('adds current input value to sources and invokes onChange on add click', () => {
        const wrapper = mountWithIntl(<TermSourcesEdit i18n={i18n} onChange={onChange} sources={[]}
                                                       formatMessage={formatMessage}/>);
        const input = wrapper.find('input');
        const value = 'new source';
        (input.getDOMNode() as HTMLInputElement).value = value;
        input.simulate('change', input);
        wrapper.find(Button).simulate('click');
        expect(onChange).toHaveBeenCalledWith([value]);
    });

    it('clears input value after adding new source', () => {
        const wrapper = mountWithIntl(<TermSourcesEdit i18n={i18n} onChange={onChange} sources={[]}
                                                       formatMessage={formatMessage}/>);
        const input = wrapper.find('input');
        (input.getDOMNode() as HTMLInputElement).value = 'new source';
        input.simulate('change', input);
        wrapper.find(Button).simulate('click');
        wrapper.update();
        expect((wrapper.find('input').getDOMNode() as HTMLInputElement).value).toEqual('');
    });

    it('supports adding input value as source on enter', () => {
        const wrapper = mountWithIntl(<TermSourcesEdit i18n={i18n} onChange={onChange} sources={[]}
                                                       formatMessage={formatMessage}/>);
        const input = wrapper.find('input');
        const value = 'new source';
        (input.getDOMNode() as HTMLInputElement).value = value;
        input.simulate('change', input);
        input.simulate('keyPress', {key: 'Enter'});
        expect(onChange).toHaveBeenCalledWith([value]);
    });

    it('does nothing on add when input is empty', () => {
        const wrapper = mountWithIntl(<TermSourcesEdit i18n={i18n} onChange={onChange} sources={[]}
                                                       formatMessage={formatMessage}/>);
        const input = wrapper.find('input');
        (input.getDOMNode() as HTMLInputElement).value = '';
        input.simulate('change', input);
        wrapper.find(Button).simulate('click');
        expect(onChange).not.toHaveBeenCalled();
    });

    it('removes source and calls onChange with updated sources when source remove button is clicked', () => {
        const sources = ['first', 'second'];
        const wrapper = mountWithIntl(<TermSourcesEdit i18n={i18n} onChange={onChange} sources={sources}
                                                       formatMessage={formatMessage}/>);
        wrapper.find('[color="danger"]').at(0).simulate('click');
        expect(onChange).toHaveBeenCalledWith([sources[1]]);
    });
});