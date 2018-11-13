import * as React from 'react';
import {Link, MemoryRouter} from "react-router-dom";
import Vocabulary from "../../../model/Vocabulary";
import VocabularyLink from "../VocabularyLink";
import {mountWithIntl} from "../../../__tests__/environment/Environment";

describe('Vocabulary Link links to correct internal asset', () => {

    const fragment = 'localVocabularyFragment';

    const vocGen = (namespace: string) => new Vocabulary({
        label: "Test asset",
        iri: namespace + fragment
    });

    it('link to an asset', () => {
        const namespace = "http://test.org/";
        const vocabulary = vocGen(namespace);
        const link = mountWithIntl(<MemoryRouter><VocabularyLink vocabulary={vocabulary}/></MemoryRouter>).find(Link);
        expect(link.props().to).toEqual("/vocabulary/" + fragment + "?namespace=" + namespace);
    });
});