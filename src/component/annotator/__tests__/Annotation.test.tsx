import * as React from "react";
import {Annotation} from "../Annotation";
import {formatMessage, i18n, intlFunctions} from "../../../__tests__/environment/IntlUtil";
import Term from "../../../model/Term";
import Vocabulary from "../../../model/Vocabulary";
import Generator from "../../../__tests__/environment/Generator";
import {ComponentClass, ReactWrapper, shallow} from "enzyme";
import {mountWithIntlAttached} from "./AnnotationUtil";
import SimplePopupWithActions from "../SimplePopupWithActions";


function expectProps(wrapper: ReactWrapper, component: ComponentClass<any>, props: {}) {
    expect(wrapper.find(component).props())
        .toEqual(expect.objectContaining(props));
}

function assumeProps(wrapper: ReactWrapper, component: ComponentClass<any>, props: {}) {
    expect(wrapper.find(component).props())
        .toEqual(expect.objectContaining(props));
}

function showOccurrenceViewForm(wrapper: ReactWrapper, popupComponent: ComponentClass<any>) {
    assumeProps(wrapper, popupComponent, {isOpen: false});
    wrapper.find(Annotation).simulate("mouseEnter");
    assumeProps(wrapper, popupComponent, {isOpen: true});
}

describe('Annotation', () => {

    const locale = "en";
    const term = new Term({
        label: "Mesto",
        iri: "http://data.iprpraha.cz/zdroj/slovnik/mpp-3/pojem/mesto"
    });
    const text = "mesta";
    const suggestedOccProps = {
        about: "_:-421713841",
        property: "ddo:je-vyskytem-termu",
        typeof: "ddo:vyskyt-termu",
        text
    };
    const assignedOccProps = {
        ...suggestedOccProps,
        resource: term.iri,
        score: "1.0",
    };
    // @ts-ignore
    const popupComponentClass: ComponentClass<any> = SimplePopupWithActions;

    let selectedTerm: Term | null;
    let defaultTerms: Term[];
    let vocabulary: Vocabulary;
    let selectVocabularyTerm: (selectedTerm: Term | null) => Promise<object>;
    let mockedVocabularyProps: {
        selectedTerm: Term | null,
        defaultTerms: Term[],
        vocabulary: Vocabulary,
        selectVocabularyTerm: (selectedTerm: Term | null) => Promise<object>;
    };
    beforeEach(() => {
        selectedTerm = null;
        defaultTerms = [term];
        vocabulary = new Vocabulary({
            iri: Generator.generateUri(),
            label: 'Test vocabulary'
        });
        selectVocabularyTerm = jest.fn();
        mockedVocabularyProps = {
            selectedTerm,
            defaultTerms,
            vocabulary,
            selectVocabularyTerm
        }
    });

    /* --- recognizes occurrence --- */
    it('recognizes suggested occurrence', () => {
        const wrapper = shallow(
            <Annotation
                {...suggestedOccProps}
                {...mockedVocabularyProps}
                text={"some text"}
                i18n={i18n} formatMessage={formatMessage} locale={locale}
            />);

        expect(wrapper.find(".suggested-term-occurrence").exists()).toBeTruthy();
    });

    it('recognizes assigned occurrence', () => {
        const wrapper = shallow(
            <Annotation
                {...assignedOccProps}
                {...mockedVocabularyProps}
                {...intlFunctions()}
            />);

        expect(wrapper.find(".assigned-term-occurrence").exists()).toBeTruthy();
    });

    it('recognizes invalid occurrence', () => {
        // noinspection JSMismatchedCollectionQueryUpdate
        const emptyDefaultTerms: Term[] = [];
        const wrapper = shallow(
            <Annotation
                defaultTerms={emptyDefaultTerms}
                selectedTerm={selectedTerm} vocabulary={vocabulary} selectVocabularyTerm={selectVocabularyTerm}
                {...assignedOccProps}
                {...intlFunctions()}
            />);

        expect(wrapper.find(".invalid-term-occurrence").exists()).toBeTruthy();
    });

    /* --- renders on enter/leave --- */
    it('renders occurrence view form on mouse enter', () => {
        const wrapper = mountWithIntlAttached(
            <Annotation
                {...assignedOccProps}
                {...mockedVocabularyProps}
                {...intlFunctions()}
            />);

        expectProps(wrapper, popupComponentClass, {isOpen: false});

        wrapper.find(Annotation).simulate("mouseEnter");

        expectProps(wrapper, popupComponentClass, {isOpen: true});
    });

    it('hides occurrence view form on mouse leave if not sticky', () => {
        const wrapper = mountWithIntlAttached(
            <Annotation
                sticky={false}
                {...assignedOccProps}
                {...mockedVocabularyProps}
                {...intlFunctions()}
            />);

        wrapper.find(Annotation).simulate("mouseEnter");

        assumeProps(wrapper, popupComponentClass, {isOpen: true});

        wrapper.find(Annotation).simulate("mouseLeave");

        expectProps(wrapper, popupComponentClass, {isOpen: false});
    });

    it('renders occurrence view form on mouse leave if sticky', () => {
        const wrapper = mountWithIntlAttached(
            <Annotation
                sticky={true}
                {...assignedOccProps}
                {...mockedVocabularyProps}
                {...intlFunctions()}
            />);

        wrapper.find(Annotation).simulate("mouseEnter");


        assumeProps(wrapper, popupComponentClass, {isOpen: true});

        wrapper.find(Annotation).simulate("mouseLeave");

        expectProps(wrapper, popupComponentClass, {isOpen: true});
    });

    /* --- pinning --- */
    it('renders occurrence view form on mouse leave if pinned', () => {
        const wrapper = mountWithIntlAttached(
            <Annotation
                {...assignedOccProps}
                {...mockedVocabularyProps}
                {...intlFunctions()}
            />);

        // @ts-ignore
        const annotationComponentClass = Annotation;
        showOccurrenceViewForm(wrapper, popupComponentClass);
        wrapper.find(Annotation).simulate("click");


        wrapper.find(Annotation).simulate("mouseLeave");

        expectProps(wrapper, popupComponentClass, {isOpen: true});
    });


    /* --- registers actions --- */
    it('registers remove action if onRemove is bound', () => {
        const wrapper = mountWithIntlAttached(
            <Annotation
                {...assignedOccProps}
                {...mockedVocabularyProps}
                {...intlFunctions()}
                onRemove={jest.fn()}
            />);

        showOccurrenceViewForm(wrapper, popupComponentClass);

        expect(wrapper.find(popupComponentClass)
            .props().actions.some((a: any) => a.key === "annotation.remove")
        ).toEqual(true);
    })

    it('does not register remove action if onRemove is not bound', () => {
        const wrapper = mountWithIntlAttached(
            <Annotation
                {...assignedOccProps}
                {...mockedVocabularyProps}
                {...intlFunctions()}
            />);

        showOccurrenceViewForm(wrapper, popupComponentClass);

        expect(wrapper.find(popupComponentClass)
            .props().actions.some((a: any) => a.key === "annotation.remove")
        ).toEqual(false);
    })

    it('registers edit action for occurrence view form', () => {
        const wrapper = mountWithIntlAttached(
            <Annotation
                {...assignedOccProps}
                {...mockedVocabularyProps}
                {...intlFunctions()}
            />);

        showOccurrenceViewForm(wrapper, popupComponentClass);

        expect(wrapper.find(popupComponentClass)
            .props().actions.some((a: any) => a.key === "annotation.edit")
        ).toEqual(true);
    })

    // it('does not register edit action for occurrence edit form', () => {})

    it('registers close action for occurrence form', () => {
        const wrapper = mountWithIntlAttached(
            <Annotation
                {...assignedOccProps}
                {...mockedVocabularyProps}
                {...intlFunctions()}
            />);

        showOccurrenceViewForm(wrapper, popupComponentClass);

        expect(wrapper.find(popupComponentClass)
            .props().actions.some((a: any) => a.key === "annotation.close")
        ).toEqual(true);
    })


});