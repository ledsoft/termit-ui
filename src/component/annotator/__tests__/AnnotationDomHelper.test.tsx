// @ts-ignore
import {DomHandler, DomUtils, Parser as HtmlParser}  from 'htmlparser2';
import AnnotationDomHelper from "../AnnotationDomHelper";
// @ts-ignore
import {Node} from 'html-to-react';

describe('AnnotationDomHelper', () => {

    const html = "<html>\n" +
        "<body>\n" +
        "\n" +
        "      <h1>My Heading</h1>\n" +
        "\n" +
        "            <p>First paragraph.</p>\n" +
        "            <span about=\"_:123\" property=\"ddo:je-vyskytem-termu\"\n" +
        "                  resource=\"http://data.iprpraha.cz/zdroj/slovnik/mpp-3/pojem/modernisticka-struktura-%28zastavba%29\"\n" +
        "                  typeof=\"ddo:vyskyt-termu\">annotated-text</span>" +
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
        annotationSpan = du.find((n: Node) =>  n.name === "span", dom, true)[0];
        otherSpan = du.find((n: Node) =>  n.name === "span", dom, true)[1];
    });

    it('isAnnotation recognizes annotation', () => {
        expect(ah.isAnnotation(otherSpan)).toBe(false);
        expect(ah.isAnnotation(annotationSpan)).toBe(true);
    });

    it('findAnnotation finds span', () => {
        const about = annotationSpan.attribs.about;

        const foundSpan = ah.findAnnotation(dom, about);

        expect(foundSpan).toEqual(annotationSpan);
    });

    it('removeAnnotation replaces span with text', () => {
        const about = annotationSpan.attribs.about;
        const text = annotationSpan.children[0].data;

        expect(html).toContain(about);
        expect(html).toContain(text);

        ah.removeAnnotation(annotationSpan);

        const newHtml = DomUtils.getOuterHTML(dom);

        expect(newHtml).not.toContain(about);
        expect(newHtml).toContain(text);
    });

});