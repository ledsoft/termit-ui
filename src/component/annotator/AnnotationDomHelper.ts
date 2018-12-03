// @ts-ignore
import {DomUtils} from 'htmlparser2';
import {Node} from 'html-to-react';
import {DEFAULT_RDF_TYPEOF_VALUE} from "./Annotator";

export default {

    isAnnotation(node: Node): boolean {
        return node && (node.name === "span") && (node.attribs.typeof === DEFAULT_RDF_TYPEOF_VALUE);
    },

    findAnnotation(dom: [Node], annotationId: string): Node|void {
        const foundResults = DomUtils.find((n: Node) => this.isAnnotation(n) && annotationId === n.attribs.about, dom, true)
        if (foundResults && (foundResults.length === 1)) {
            return foundResults[0];
        }
    },
    removeAnnotation(annotation: Node): void {
        DomUtils.replaceElement(annotation, {data: annotation.children![0].data, type: "text"})
    }
}