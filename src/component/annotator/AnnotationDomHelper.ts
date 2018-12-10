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
    removeAnnotation(annotation: Node): Node {
        const newNode = this.createTextualNode(annotation);
        DomUtils.replaceElement(annotation, newNode)
        return newNode;
    },
    replaceAnnotation(oldAnnotation: Node, newAnnotation: Node): void {
        DomUtils.replaceElement(oldAnnotation, newAnnotation)
    },
    createNewAnnotation(): any {
        return {type: "tag", name: "span"}
    },
    createTextualNode(annotation: Node): any {
        return {data: annotation.children![0].data, type: "text"}
    },
    isAnnotationWithMinimumScore(node: Node, score: number): boolean {
        if (!this.isAnnotation(node)) {
            return false;
        }
        if (!node.attribs.score) {
            return true;
        }
        return score <= Number(node.attribs.score);
    },
}