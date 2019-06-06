import {DomUtils} from "htmlparser2";
import {Node} from "html-to-react";
import VocabularyUtils from "../../util/VocabularyUtils";
import HtmlParserUtils from "./HtmlParserUtils";


export default {

    isAnnotation(node: Node, prefixMap?: Map<string, string>): boolean {
        return node && (node.name === "span") && (HtmlParserUtils.resolveIri(node.attribs.typeof, prefixMap) === VocabularyUtils.TERM_OCCURRENCE);
    },

    findAnnotation(dom: [Node], annotationId: string, prefixMap?: Map<string, string>): Node|void {
        const foundResults = DomUtils.find((n: Node) => this.isAnnotation(n, prefixMap) && annotationId === n.attribs.about, dom, true)
        if (foundResults && (foundResults.length === 1)) {
            return foundResults[0];
        }
    },
    removeAnnotation(annotation: Node): Node {
        const newNode = this.createTextualNode(annotation);
        DomUtils.replaceElement(annotation, newNode);
        return newNode;
    },
    replaceAnnotation(oldAnnotation: Node, newAnnotation: Node): void {
        DomUtils.replaceElement(oldAnnotation, newAnnotation)
    },
    createNewAnnotation(about: string, text: string, prefixMap?: Map<string, string>): Node {
        return {
            type: "tag",
            name: "span",
            attribs: {
                about,
                property: HtmlParserUtils.shortenIri(VocabularyUtils.IS_OCCURRENCE_OF_TERM, prefixMap),
                typeof: HtmlParserUtils.shortenIri(VocabularyUtils.TERM_OCCURRENCE, prefixMap)
            },
            children: [{data: text, type: "text"}]
        };
    },
    createTextualNode(annotation: Node): any {
        return {data: annotation.children![0].data, type: "text"}
    },
    isAnnotationWithMinimumScore(node: Node, score: number, prefixMap?: Map<string, string>): boolean {
        if (!this.isAnnotation(node, prefixMap)) {
            return false;
        }
        if (!node.attribs.score) {
            return true;
        }
        return score <= Number(node.attribs.score);
    }
}