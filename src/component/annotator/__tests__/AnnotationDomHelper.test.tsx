// @ts-ignore
import {DomHandler, DomUtils, Parser as HtmlParser}  from "htmlparser2";
import AnnotationDomHelper from "../AnnotationDomHelper";
// @ts-ignore
import {Node} from "html-to-react";
import VocabularyUtils from "../../../util/VocabularyUtils";

describe("AnnotationDomHelper", () => {

    const html = "<html>\n" +
        "<body>\n" +
        "\n" +
        "      <h1>My Heading</h1>\n" +
        "\n" +
        "            <p>First paragraph.</p>\n" +
        "            <span about=\"_:123\" property=\""+VocabularyUtils.IS_OCCURRENCE_OF_TERM+"\"\n" +
        "                  resource=\"http://data.iprpraha.cz/zdroj/slovnik/mpp-3/pojem/modernisticka-struktura-%28zastavba%29\"\n" +
        "                  typeof=\""+VocabularyUtils.TERM_OCCURRENCE+"\">annotated-text</span>" +
        "\n after annotation span" +
        "            <span about=\"_:111\" \n>not-annotation</span>" +
        "\n after text span" +
        "</body>\n" +
        "</html>";
    const options = { decodeEntities: true };
    let dom: [Node];
    let annotationSpan: Node;
    let otherSpan: Node;
    const ah = AnnotationDomHelper;
    const du = DomUtils;
    beforeEach(() => {
        const handler = new DomHandler();
        const parser = new HtmlParser(handler, options);
        parser.parseComplete(html);
        dom =  handler.dom;
        annotationSpan = du.find((n: Node) =>  n.name === "span" && n.attribs.property, dom, true, 1)[0];
        otherSpan = du.find((n: Node) =>  n.name === "span" && !n.attribs.property, dom, true, 1)[0];
    });

    it("isAnnotation recognizes annotation", () => {
        expect(ah.isAnnotation(otherSpan)).toBe(false);
        expect(ah.isAnnotation(annotationSpan)).toBe(true);
    });

    it("findAnnotation finds span", () => {
        const about = annotationSpan.attribs.about;

        const foundSpan = ah.findAnnotation(dom, about);

        expect(foundSpan).toEqual(annotationSpan);
    });

    it("removeAnnotation replaces span with text", () => {
        const about = annotationSpan.attribs.about;
        const text = annotationSpan.children![0]!.data;

        expect(html).toContain(about);
        expect(html).toContain(text);

        ah.removeAnnotation(annotationSpan);

        const newHtml = DomUtils.getOuterHTML(dom);

        expect(newHtml).not.toContain(about);
        expect(newHtml).toContain(text);
    });

    it("isAnnotationWithMinimumScore returns false if it is not annotation", () => {
        expect(ah.isAnnotationWithMinimumScore(otherSpan, 0.5)).toBe(false);
    });

    it("isAnnotationWithMinimumScore returns false if score is less-than trashold", () => {
        annotationSpan.attribs.score = "0.4";
        expect(ah.isAnnotationWithMinimumScore(annotationSpan, 0.5)).toBe(false);
    });

    it("isAnnotationWithMinimumScore returns true if score is more-than or equal trashold", () => {
        annotationSpan.attribs.score = "0.5";
        expect(ah.isAnnotationWithMinimumScore(annotationSpan, 0.5)).toBe(true);
        expect(ah.isAnnotationWithMinimumScore(annotationSpan, 0.4)).toBe(true);
    });

    it("isAnnotationWithMinimumScore returns true if score is not defined", () => {
        expect(ah.isAnnotationWithMinimumScore(annotationSpan, 0.5)).toBe(true);
    });







});