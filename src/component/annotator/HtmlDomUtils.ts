import {fromRange, toRange} from "xpath-range";

export default {

    getSelectionRange(rootElement: HTMLElement): Range | null {
        const sel = window.getSelection();

        if (sel && !sel.isCollapsed) {
            if (sel.rangeCount) {
                return sel.getRangeAt(0);
            }
        }
        return null;
    },

    /**
     * Returns a clone of rootElement where range is replaced by provided surroundingElement.
     * @param rootElement Root element of a document that should be cloned.
     * @param range range within document referenced by rootElement that should be surrounded.
     * @param surroundingElementHtml string representing surroundingElement.
     */
    replaceRange(rootElement: HTMLElement,
                 range: Range,
                 surroundingElementHtml: string
    ): HTMLElement {
        const xpathRange = fromRange(range, rootElement);
        const clonedElement = rootElement.cloneNode(true) as HTMLElement;
        const newRange = toRange(xpathRange.start, xpathRange.startOffset, xpathRange.end, xpathRange.endOffset, clonedElement);

        const doc = clonedElement.ownerDocument;
        const template = doc!.createElement("template");
        template.innerHTML = surroundingElementHtml;
        const surroundingElement = template.content.childNodes[0] as HTMLElement;
        const text = surroundingElement.textContent;

        newRange.extractContents();
        newRange.surroundContents(surroundingElement);
        // @ts-ignore TODO workaround
        surroundingElement.append(doc.createTextNode(text!));
        return clonedElement;
    },

    getText(range: Range): string {
        if (!range) {
            throw new Error("Range " + range + " not defined.");
        }
        const fragment = range.cloneContents();
        if (fragment.childNodes.length !== 1) {
            throw new Error("Range " + range + " does not point to single text node.")
        }
        if (!fragment.childNodes[0].nodeValue) {
            throw new Error("Range " + range + " pointed to a node value that is null"
                + fragment.childNodes[0].nodeValue + ".")
        }

        return range.cloneContents().childNodes[0].nodeValue!;
    }
}




