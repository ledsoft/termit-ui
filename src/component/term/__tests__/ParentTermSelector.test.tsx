import * as React from "react";
import {shallow} from "enzyme";
import {ParentTermSelector} from "../ParentTermSelector";
import Generator from "../../../__tests__/environment/Generator";
import {AssetData} from "../../../model/Asset";
import FetchOptionsFunction from "../../../model/Functions";
import {IRI} from "../../../util/VocabularyUtils";
import Term from "../../../model/Term";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import {intlDataForShallow} from "../../../__tests__/environment/Environment";
// @ts-ignore
import {IntelligentTreeSelect} from "intelligent-tree-select";

describe("ParentTermSelector", () => {

    let onChange: (parent?: AssetData) => void;
    let loadTerms: (fetchOptions: FetchOptionsFunction, vocabularyIri: IRI) => Promise<Term[]>;

    beforeEach(() => {
        onChange = jest.fn();
        loadTerms = jest.fn().mockImplementation(() => Promise.resolve([]));
    });

    it("passes selected parent's IRI as value to tree component", () => {
        const parent = {
            iri: Generator.generateUri()
        };
        const wrapper = shallow(<ParentTermSelector termIri={Generator.generateUri()} parentTerm={parent}
                                                    vocabularyIri={Generator.generateUri()} onChange={onChange}
                                                    vocabularyTerms={[]}
                                                    loadTerms={loadTerms} {...intlFunctions()} {...intlDataForShallow()}/>);
        expect(wrapper.find(IntelligentTreeSelect).prop("value")).toEqual(parent.iri);
    });

    it("invokes onChange with correct parent object on selection", () => {
        const terms = [new Term({
            iri: Generator.generateUri(),
            label: "Parent"
        })];
        const wrapper = shallow<ParentTermSelector>(<ParentTermSelector termIri={Generator.generateUri()}
                                                                        vocabularyIri={Generator.generateUri()}
                                                                        onChange={onChange}
                                                                        vocabularyTerms={terms}
                                                                        loadTerms={loadTerms} {...intlFunctions()} {...intlDataForShallow()}/>);
        wrapper.instance().onChange(terms[0]);
        expect(onChange).toHaveBeenCalledWith({iri: terms[0].iri});
    });

    it("does nothing when selected parent is the same as the term itself", () => {
        const term = new Term({
            iri: Generator.generateUri(),
            label: "Parent"
        });
        const wrapper = shallow<ParentTermSelector>(<ParentTermSelector termIri={term.iri}
                                                                        vocabularyIri={Generator.generateUri()}
                                                                        onChange={onChange}
                                                                        vocabularyTerms={[term]}
                                                                        loadTerms={loadTerms} {...intlFunctions()} {...intlDataForShallow()}/>);
        wrapper.instance().onChange(term);
        expect(onChange).not.toHaveBeenCalled();
    });

    it("handles selection reset by passing undefined to onChange handler", () => {
        const term = new Term({
            iri: Generator.generateUri(),
            label: "Parent"
        });
        const wrapper = shallow<ParentTermSelector>(<ParentTermSelector termIri={term.iri}
                                                                        vocabularyIri={Generator.generateUri()}
                                                                        onChange={onChange}
                                                                        vocabularyTerms={[term]}
                                                                        loadTerms={loadTerms} {...intlFunctions()} {...intlDataForShallow()}/>);
        wrapper.instance().onChange(null);
        expect(onChange).toHaveBeenCalledWith(undefined);
    });
});