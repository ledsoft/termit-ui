import * as React from 'react';
import {SparqlWidget} from '../SparqlWidget';
import {mountWithIntl} from "../../../__tests__/environment/Environment";

describe('SPARQL Widget', () => {
    let executeQuery: (str: string) => any;

    beforeEach(() => {
        executeQuery = jest.fn();
    });
    it('runs a SPARQL query on mount', () => {
        const fn = () => <div/>;
        mountWithIntl(<SparqlWidget
            title={""}
            sparqlQuery={""}
            componentFunction={fn}
            queryResults={{}}
            executeQuery={executeQuery}/>);
        expect(executeQuery).toHaveBeenCalled();
    });
});