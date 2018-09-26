import * as React from 'react';
import {Link, MemoryRouter} from "react-router-dom";
import {mount} from "enzyme";
import Vocabulary from "../../../model/Vocabulary";
import VocabularyLink from "../VocabularyLink";

describe('Vocabulary Link links to correct internal asset', () => {

    const fragment = 'localVocabularyFragment';

    const vocGen = (namespace: string) => new Vocabulary({
        name: "Test asset",
        iri: namespace + fragment
    })

    it('link to an asset', () => {
        const namespace="http://test.org/";
        const vocabulary = vocGen(namespace);
        const link = mount(<MemoryRouter><VocabularyLink vocabulary={vocabulary}/></MemoryRouter>).find(Link);
        expect(link.props().to).toEqual("/vocabulary/"+fragment+"?namespace="+namespace);
    });
});