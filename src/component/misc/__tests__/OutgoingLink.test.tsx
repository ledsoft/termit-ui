import * as React from 'react';
import {OutgoingLink} from "../OutgoingLink";
import {intlDataForShallow} from "../../../__tests__/environment/Environment";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import {mount} from "enzyme";

describe('OutgoingLink', () => {
    it('OutgoingLink shows the link symbol by default', () => {
        const wrapper = mount(<OutgoingLink
            label="label"
            iri="http://link.me/link" {...intlFunctions()} {...intlDataForShallow()}
        />);
        expect(wrapper.contains('↱')).toBeTruthy();
    });
    it('OutgoingLink does not show the link symbol for showLink=false', () => {
        const wrapper = mount(<OutgoingLink
            label="label"
            iri="http://link.me/link" {...intlFunctions()} {...intlDataForShallow()}
            showLink={false}
        />);
        expect(wrapper.contains('↱')).toBeFalsy();
    });
});

