import * as React from "react";
import {Annotation} from "../Annotation";
import {Popover} from "reactstrap";
import {formatMessage, i18n} from "../../../__tests__/environment/IntlUtil";
import Term from "../../../model/Term";
import Vocabulary from "../../../model/Vocabulary";
import Generator from "../../../__tests__/environment/Generator";
import {ComponentClass, ReactWrapper, shallow} from "enzyme";
import {mountWithIntlAttached} from "./AnnotationUtil";


function expectProps(wrapper: ReactWrapper, component: ComponentClass<any>, props: {}) {
    expect(wrapper.find(Popover).props())
        .toEqual(expect.objectContaining(props));
}

function assumeProps(wrapper: ReactWrapper, component: ComponentClass<any>, props: {}) {
    expect(wrapper.find(Popover).props())
        .toEqual(expect.objectContaining(props));
}

describe('Annotation', () => {

    const locale = "en";
    const term = new Term({
        label: "Mesto",
        iri: "http://data.iprpraha.cz/zdroj/slovnik/mpp-3/pojem/mesto"
    });
    const suggestedOccProps = {
        about: "_:-421713841",
        property: "ddo:je-vyskytem-termu",
        typeof: "ddo:vyskyt-termu"
    };
    const assignedOccProps = {
        ...suggestedOccProps,
        resource: term.iri,
        score: "1.0",
    };

    let selectedTerm: Term | null;
    let defaultTerms: Term[];
    let vocabulary: Vocabulary;
    let selectVocabularyTerm: (selectedTerm: Term | null) => Promise<object>;
    beforeEach(() => {
        selectedTerm = null;
        defaultTerms = [term];
        vocabulary = new Vocabulary({
            iri: Generator.generateUri(),
            label: 'Test vocabulary'
        });
        selectVocabularyTerm = jest.fn();
    });

    it('recognizes suggested occurrence', () => {
        const wrapper = shallow(
            <Annotation
                {...suggestedOccProps} text={"some text"}
                selectedTerm={selectedTerm} defaultTerms={defaultTerms}
                vocabulary={vocabulary} selectVocabularyTerm={selectVocabularyTerm}
                i18n={i18n} formatMessage={formatMessage} locale={locale}
            />);

        expect(wrapper.find(".suggested-term-occurrence").exists()).toBeTruthy();
    });

    it('recognizes assigned occurrence', () => {
        const wrapper = shallow(
            <Annotation
                {...assignedOccProps} text={"some text"}
                selectedTerm={selectedTerm} defaultTerms={defaultTerms}
                vocabulary={vocabulary} selectVocabularyTerm={selectVocabularyTerm}
                i18n={i18n} formatMessage={formatMessage} locale={locale}
            />);

        expect(wrapper.find(".assigned-term-occurrence").exists()).toBeTruthy();
    });

    it('recognizes invalid occurrence', () => {
        // noinspection JSMismatchedCollectionQueryUpdate
        const emptyDefaultTerms: Term[] = [];
        const wrapper = shallow(
            <Annotation
                {...assignedOccProps} text={"some text"}
                selectedTerm={selectedTerm} defaultTerms={emptyDefaultTerms}
                vocabulary={vocabulary} selectVocabularyTerm={selectVocabularyTerm}
                i18n={i18n} formatMessage={formatMessage} locale={locale}
            />);

        expect(wrapper.find(".invalid-term-occurrence").exists()).toBeTruthy();
    });

    it('renders occurrence view form on mouse enter', () => {
        const wrapper = mountWithIntlAttached(
            <Annotation
                {...assignedOccProps} text={"some text"}
                selectedTerm={selectedTerm} defaultTerms={defaultTerms}
                vocabulary={vocabulary} selectVocabularyTerm={selectVocabularyTerm}
                i18n={i18n} formatMessage={formatMessage} locale={locale}
            />);

        expectProps(wrapper, Popover, {isOpen: false});

        wrapper.find(Annotation).simulate("mouseEnter");

        expectProps(wrapper, Popover, {isOpen: true});
    });

    it('hides occurrence view form on mouse leave if not sticky', () => {
        const wrapper = mountWithIntlAttached(
            <Annotation
                sticky={false}
                {...assignedOccProps} text={"some text"}
                selectedTerm={selectedTerm} defaultTerms={defaultTerms}
                vocabulary={vocabulary} selectVocabularyTerm={selectVocabularyTerm}
                i18n={i18n} formatMessage={formatMessage} locale={locale}
            />);

        wrapper.find(Annotation).simulate("mouseEnter");

        assumeProps(wrapper, Popover, {isOpen: true});

        wrapper.find(Annotation).simulate("mouseLeave");

        expectProps(wrapper, Popover, {isOpen: false});
    });

    it('renders occurrence view form on mouse leave if sticky', () => {
        const wrapper = mountWithIntlAttached(
            <Annotation
                sticky={true}
                {...assignedOccProps} text={"some text"}
                selectedTerm={selectedTerm} defaultTerms={defaultTerms}
                vocabulary={vocabulary} selectVocabularyTerm={selectVocabularyTerm}
                i18n={i18n} formatMessage={formatMessage} locale={locale}
            />);

        wrapper.find(Annotation).simulate("mouseEnter");

        assumeProps(wrapper, Popover, {isOpen: true});

        wrapper.find(Annotation).simulate("mouseLeave");

        expectProps(wrapper, Popover, {isOpen: true});
    });



});