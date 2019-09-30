// ts-ignore
import * as htmlparser2 from "htmlparser2";
import {Node} from "html-to-react";


/**
 * Type declarations for htmlparser2 library.
 */
declare module "htmlparser2" {

    interface Node {
        type?: string
        name?: string
        attribs?: any
        children?: [any]
    }

    class DomUtils {
        public static getOuterHTML(dom: [Node]): string
        public static replaceElement(element: Node, replacement: Node): void
        public static find(test: (n: Node) => boolean, elems: [Node], recurse: boolean, limit?: any): [Node]
        public static findOneChild(test: (n: Node) => boolean, elems: [Node]): Node|null
    }
}