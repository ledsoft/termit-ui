import {fromRange, toRange, XPathRange} from "xpath-range";


function getFirstRange(rootElement: HTMLElement) {
    const sel = window.getSelection();

    if (!sel.isCollapsed) {
        if (sel.rangeCount) {
            return sel.getRangeAt(0);
        }
    }
    return null;
}

function hasOnlyTextNodes(fragment: DocumentFragment): boolean {
    return !(Array.from(fragment.childNodes).find((n) => { return n.nodeType !== Node.TEXT_NODE }));
}

export default {

    // TODO typing    element:HTMLElement
    getSelectionRange(rootElement: HTMLElement, adjustToWords: any = false): XPathRange | null {
        const rangeOriginal = getFirstRange(rootElement);

        if (rangeOriginal) {
            const fragment = rangeOriginal.cloneContents();
            if ((fragment.childNodes.length > 0) && (hasOnlyTextNodes(fragment))) {

                // TODO adjust to words
                // TODO fails if inside of span

                return fromRange(rangeOriginal, rootElement);
            }
        }
        return null;
    },

    replaceRange(rootElement: any, xpathRange: any, htmlToReplace: any): any {
        const clonedElement = rootElement.cloneNode(true);
        const range = toRange(xpathRange.start, xpathRange.startOffset, xpathRange.end, xpathRange.endOffset, clonedElement);

        range.extractContents();
        // range.surroundContents(span);
        // span.append(document.createTextNode(text));
    }


    // TODO String text = Selector.getSelectionText(this.containerElement, adjustToWords = true);

}




