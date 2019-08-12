import * as React from "react";
import {shallow} from "enzyme";
import {ParentTermSelector} from "../ParentTermSelector";
import Generator from "../../../__tests__/environment/Generator";
import FetchOptionsFunction from "../../../model/Functions";
import VocabularyUtils, {IRI} from "../../../util/VocabularyUtils";
import Term from "../../../model/Term";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import {intlDataForShallow} from "../../../__tests__/environment/Environment";
// @ts-ignore
import {IntelligentTreeSelect} from "intelligent-tree-select";

describe("ParentTermSelector", () => {

    let onChange: (parents: Term[]) => void;
    let loadTerms: (fetchOptions: FetchOptionsFunction, vocabularyIri: IRI) => Promise<Term[]>;

    beforeEach(() => {
        onChange = jest.fn();
        loadTerms = jest.fn().mockImplementation(() => Promise.resolve([]));
    });

    it("passes selected parent as value to tree component", () => {
        const parent = [Generator.generateTerm(Generator.generateUri())];
        const wrapper = shallow(<ParentTermSelector termIri={Generator.generateUri()} parentTerms={parent}
                                                    vocabularyIri={parent[0].vocabulary!.iri!} onChange={onChange}
                                                    loadTerms={loadTerms} {...intlFunctions()} {...intlDataForShallow()}/>);
        expect(wrapper.find(IntelligentTreeSelect).prop("value")).toEqual(parent[0].iri);
    });

    it("invokes onChange with correct parent object on selection", () => {
        const terms = [Generator.generateTerm()];
        const wrapper = shallow<ParentTermSelector>(<ParentTermSelector termIri={Generator.generateUri()}
                                                                        vocabularyIri={Generator.generateUri()}
                                                                        onChange={onChange}
                                                                        loadTerms={loadTerms} {...intlFunctions()} {...intlDataForShallow()}/>);
        wrapper.instance().onChange([terms[0]]);
        expect(onChange).toHaveBeenCalledWith([terms[0]]);
    });

    it("filters out selected parent if it is the same as the term itself", () => {
        const term = Generator.generateTerm();
        const wrapper = shallow<ParentTermSelector>(<ParentTermSelector termIri={term.iri}
                                                                        vocabularyIri={Generator.generateUri()}
                                                                        onChange={onChange}
                                                                        loadTerms={loadTerms} {...intlFunctions()} {...intlDataForShallow()}/>);
        wrapper.instance().onChange([term]);
        expect(onChange).toHaveBeenCalledWith([]);
    });

    it("handles selection reset by passing empty array to onChange handler", () => {
        const term = Generator.generateTerm();
        const wrapper = shallow<ParentTermSelector>(<ParentTermSelector termIri={term.iri}
                                                                        vocabularyIri={Generator.generateUri()}
                                                                        onChange={onChange}
                                                                        loadTerms={loadTerms} {...intlFunctions()} {...intlDataForShallow()}/>);
        wrapper.instance().onChange(null);
        expect(onChange).toHaveBeenCalledWith([]);
    });

    describe("fetchOptions", () => {
        it("fetches terms including imported when configured to", () => {
            const wrapper = shallow<ParentTermSelector>(<ParentTermSelector termIri={Generator.generateUri()}
                                                                            vocabularyIri={Generator.generateUri()}
                                                                            onChange={onChange}
                                                                            loadTerms={loadTerms} {...intlFunctions()} {...intlDataForShallow()}/>);
            wrapper.setState({includeImported: true});
            wrapper.update();
            wrapper.instance().fetchOptions({});
            expect((loadTerms as jest.Mock).mock.calls[0][0].includeImported).toBeTruthy();
        });

        it("uses vocabulary of term being toggled when loading it subterms", () => {
            const parent = new Term({
                iri: Generator.generateUri(),
                label: "parent",
                vocabulary: {iri: Generator.generateUri()}
            });
            const wrapper = shallow<ParentTermSelector>(<ParentTermSelector termIri={Generator.generateUri()}
                                                                            vocabularyIri={Generator.generateUri()}
                                                                            onChange={onChange}
                                                                            loadTerms={loadTerms} {...intlFunctions()} {...intlDataForShallow()}/>);
            wrapper.setState({includeImported: true});
            wrapper.update();
            wrapper.instance().fetchOptions({optionID: parent.iri, option: parent});
            expect((loadTerms as jest.Mock).mock.calls[0][1]).toEqual(VocabularyUtils.create(parent.vocabulary!.iri!));
        });

        it("filters out option with the term IRI", () => {
            const options: Term[] = [];
            const vocabularyIri = Generator.generateUri();
            for (let i = 0; i < Generator.randomInt(5, 10); i++) {
                const t = Generator.generateTerm(vocabularyIri);
                options.push(t);
            }
            const currentTerm = options[Generator.randomInt(0, options.length)];
            loadTerms = jest.fn().mockImplementation(() => Promise.resolve(options));
            const wrapper = shallow<ParentTermSelector>(<ParentTermSelector termIri={currentTerm.iri}
                                                                            vocabularyIri={vocabularyIri}
                                                                            onChange={onChange}
                                                                            loadTerms={loadTerms} {...intlFunctions()} {...intlDataForShallow()}/>);
            return wrapper.instance().fetchOptions({}).then((terms) => {
                expect(terms.indexOf(currentTerm)).toEqual(-1);
            });
        });

        it("removes term IRI from options subterms as well", () => {
            const vocabularyIri = Generator.generateUri();
            const options: Term[] = [Generator.generateTerm(vocabularyIri), Generator.generateTerm(vocabularyIri)];
            const currentTerm = options[1];
            options[0].plainSubTerms = [currentTerm.iri];
            loadTerms = jest.fn().mockImplementation(() => Promise.resolve(options));
            const wrapper = shallow<ParentTermSelector>(<ParentTermSelector termIri={currentTerm.iri}
                                                                            vocabularyIri={vocabularyIri}
                                                                            onChange={onChange}
                                                                            loadTerms={loadTerms} {...intlFunctions()} {...intlDataForShallow()}/>);
            return wrapper.instance().fetchOptions({}).then((terms) => {
                expect(terms.indexOf(currentTerm)).toEqual(-1);
                expect(terms[0].plainSubTerms!.indexOf(currentTerm.iri)).toEqual(-1);
            });
        });
    });
});
