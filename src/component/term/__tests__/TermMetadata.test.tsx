import * as React from 'react';
import Term from "../../../model/Term";
import Generator from "../../../__tests__/environment/Generator";
import {mountWithIntl} from "../../../__tests__/environment/Environment";
import {TermMetadata} from "../TermMetadata";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import Vocabulary from "../../../model/Vocabulary";
import OutgoingLink from "../../misc/OutgoingLink";
import {Button} from "reactstrap";

jest.mock('../../../util/Routing');

describe('TermMetadata', () => {

    const vocabulary: Vocabulary = new Vocabulary({
        iri: Generator.generateUri(),
        label: 'Test vocabulary'
    });
    let term: Term;

    beforeEach(() => {
        term = new Term({
            iri: Generator.generateUri(),
            label: 'Test',
            comment: 'test'
        });
    });

    it('renders sub terms as internal and external links', () => {
        const iri = Generator.generateUri();
        term.subTerms = [{iri}];
        const wrapper = mountWithIntl(<TermMetadata vocabulary={vocabulary} term={term} {...intlFunctions()}/>);
        const linkButton = wrapper.find(Button);
        expect(linkButton.length).toEqual(1);
        expect(linkButton.text()).toEqual(iri);
        expect(wrapper.find(OutgoingLink).filterWhere(x => x.text().indexOf(iri) !== -1).length).toEqual(1);
    });
});