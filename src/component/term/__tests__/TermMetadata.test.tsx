import * as React from 'react';
import Term from "../../../model/Term";
import Generator from "../../../__tests__/environment/Generator";
import {mountWithIntl} from "../../../__tests__/environment/Environment";
import {TermMetadata} from "../TermMetadata";
import {formatMessage, i18n} from "../../../__tests__/environment/IntlUtil";
import {Button} from "reactstrap";
import TermMetadataEdit from "../TermMetadataEdit";

describe('TermMetadata', () => {

    let term: Term;

    beforeEach(() => {
        term = new Term({
            iri: Generator.generateUri(),
            label: 'Test',
            comment: 'test'
        });
    });

    it('renders term metadata by default', () => {
        const wrapper = mountWithIntl(<TermMetadata term={term} i18n={i18n} formatMessage={formatMessage}/>);
        expect(wrapper.find('.attribute-label').length).toBeGreaterThan(1);
    });

    it('renders term editor after clicking edit button', () => {
        const wrapper = mountWithIntl(<TermMetadata term={term} i18n={i18n} formatMessage={formatMessage}/>);
        wrapper.find(Button).simulate('click');
        expect(wrapper.find(TermMetadataEdit).exists()).toBeTruthy();
    });
});