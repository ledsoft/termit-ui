import {mountWithIntl} from "../../../__tests__/environment/Environment";
import {intl} from "../../../__tests__/environment/IntlUtil";
import * as React from "react";
import {Annotator} from "../Annotator";
import {shallow} from "enzyme";
import Annotation from "..//Annotation";
import {createAnnotationSpan, mountWithIntlAttached, surroundWithHtml} from "./AnnotationUtil";
import Term from "../../../model/Term";

describe("Annotator", () => {

    const sampleContent = "<div><span>sample content</span></div>";
    const generalHtmlContent = surroundWithHtml(sampleContent);
    const suggestedOccProps = {
        about: "_:-421713841",
        property: "ddo:je-výskytem-termu",
        typeof: "ddo:výskyt-termu"
    };
    const assignedOccProps = {
        about: "_:-421713841",
        property: "ddo:je-výskytem-termu",
        resource: "http://data.iprpraha.cz/zdroj/slovnik/mpp-3/pojem/mesto",
        score: "1.0",
        typeof: "ddo:výskyt-termu"
    };
    let mockedCallbackProps: {
        onUpdate(newHtml: string): void
        onFetchTerm(termIri: string): Promise<Term>
        onCreateTerm(term: Term): Promise<Term>
    };
    beforeEach(() => {
        mockedCallbackProps = {
            onUpdate: jest.fn(),
            onFetchTerm: jest.fn(),
            onCreateTerm: jest.fn()
        }
    });

    it("renders body of provided html content", () => {

        const wrapper = mountWithIntl(<Annotator
            {...mockedCallbackProps}
            initialHtml={generalHtmlContent}
            intl={intl()}
        />);

        expect(wrapper.html().includes(sampleContent)).toBe(true);
    });

    it("renders annotation of suggested occurrence of a term", () => {
        const htmlWithOccurrence = surroundWithHtml(
            createAnnotationSpan(
                suggestedOccProps,
                "města"
            )
        );
        const wrapper = mountWithIntlAttached(<Annotator
            {...mockedCallbackProps}
            initialHtml={htmlWithOccurrence}
            intl={intl()}
        />);

        const constructedAnnProps = wrapper.find(Annotation).props();
        const expectedAnnProps = {...suggestedOccProps};

        expect(constructedAnnProps)
            .toEqual(expect.objectContaining(expectedAnnProps))
    });

    it("renders annotation of assigned occurrence of a term", () => {
        const htmlWithOccurrence = surroundWithHtml(
            createAnnotationSpan(
                assignedOccProps,
                "města"
            )
        );
        const wrapper = shallow(<Annotator
            {...mockedCallbackProps}
            initialHtml={htmlWithOccurrence}
            intl={intl()}
        />);

        const constructedAnnProps = wrapper.find(Annotation).props();
        const expectedAnnProps = Object.assign({}, assignedOccProps);

        expect(constructedAnnProps)
            .toEqual(expect.objectContaining(expectedAnnProps))
    });

    // todo rewrite it with xpath-range functions
    xit("renders annotation over selected text on mouseup event", () => {
        const div = document.createElement("div");
        document.body.appendChild(div);
        const wrapper = mountWithIntl(<Annotator
            {...mockedCallbackProps}
            initialHtml={generalHtmlContent}
            intl={intl()}
        />, {attachTo: div});
        const newSpan = div.querySelector("span");
        const annTarget = {element: newSpan, text: "some text"};
        // @ts-ignore
        wrapper.find(Annotator).instance().surroundSelection = () => annTarget;

        expect(wrapper.html().includes("suggested-term")).toBeFalsy();

        wrapper.simulate("mouseUp");

        expect(wrapper.html().includes("suggested-term")).toBeTruthy()
    });


});