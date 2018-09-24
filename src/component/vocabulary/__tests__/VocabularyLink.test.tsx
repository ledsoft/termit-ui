import * as React from 'react';
import {Link, MemoryRouter} from "react-router-dom";
import {mount} from "enzyme";
import Constants from "../../../util/Constants";
import Vocabulary from "../../../model/Vocabulary";
import VocabularyLink from "../VocabularyLink";

describe('Vocabulary Link links to correct internal asset', () => {

    const fragment = 'localVocabularyFragment';

    const vocGen = (namespace: string) => new Vocabulary({
        name: "Test asset",
        iri: namespace + fragment
    })

    it('link to an internal asset', () => {
        const vocabulary = vocGen(Constants.namespace_vocabulary);
        const link = mount(<MemoryRouter><VocabularyLink vocabulary={vocabulary}/></MemoryRouter>).find(Link);
        expect(link.props().to).toEqual("/asset/"+fragment);
    });

    it('link to an external asset', () => {
        const namespace="http://test.org/";
        const vocabulary = vocGen(namespace);
        const link = mount(<MemoryRouter><VocabularyLink vocabulary={vocabulary}/></MemoryRouter>).find(Link);
        expect(link.props().to).toEqual("/asset/"+fragment+"?namespace="+namespace);
    });
});