// @ts-ignore
import {DomHandler, DomUtils, Parser as HtmlParser} from 'htmlparser2';
import {Node} from 'html-to-react';

export default {

    html2dom(html: string) {
        const options = { decodeEntities: true };
        const handler = new DomHandler();
        const parser = new HtmlParser(handler, options);
        parser.parseComplete(html);
        return handler.dom;
    },
    dom2html(dom: [Node]): string {
        return DomUtils.getOuterHTML(dom)
    }
}