// @ts-ignore
import {XPathRange} from "xpath-range";
// @ts-ignore
import * as xpathRange from "xpath-range";
import HtmlDomUtils from "../HtmlDomUtils";

function mockWindowSelection(selection: object) {
    window.getSelection = jest.fn().mockImplementation(() => {
        return Object.assign(
            {},
            selection
        );
    });
}

describe("Html dom utils", () => {

    const htmlContent = "<html><head/><body/></html>";
    const sampleDivContent = "<div>before span<span>sample text pointer in span</span>after span</div>";
    const surroundingElementHtml = "<span>text pointer</span>";
    const xpathTextPointerRange : XPathRange = {
        start: "/div[1]/span[1]/text()[1]",
        end: "/div[1]/span[1]/text()[1]",
        startOffset: 7,
        endOffset: 19
    };
    let sampleDiv: HTMLDivElement;
    let doc: Document;
    let sampleTextNode: Text;
    let getRangeAt: (i: number) => any;
    let cloneContents: () => DocumentFragment;
    let textPointerRange: any;
    beforeEach(() => {
        // // @ts-ignore
        window.getSelection = jest.fn().mockImplementation(() => {
            return {
                isCollapsed: true,
                rangeCount: 1,

            };
        });
        cloneContents = jest.fn().mockImplementation(() => {
            return { childNodes: [sampleTextNode]}
        });
        getRangeAt = jest.fn().mockImplementation(() => {
            return { cloneContents }
        });
        textPointerRange = {
            extractContents: jest.fn(),
            surroundContents: jest.fn()
        };

        const parser = new DOMParser();
        doc = parser.parseFromString(htmlContent, "text/html");
        sampleDiv = doc.createElement("div");
        sampleDiv.innerHTML = sampleDivContent
        sampleTextNode = doc.createTextNode("text pointer");
        doc.body.appendChild(sampleDiv);
    });

    describe("get selection range", () => {

        it("returns range for a text node", () => {

            let ret: Range | null;

            mockWindowSelection({
                isCollapsed: false,
                rangeCount: 1,
                getRangeAt
            });
            ret = HtmlDomUtils.getSelectionRange(sampleDiv);
            expect(window.getSelection).toHaveBeenCalled();
            expect(getRangeAt).toHaveBeenCalledWith(0);
            expect(ret).not.toBeNull();
            expect(ret!.cloneContents).toEqual(cloneContents);
        });


        it("returns null if nothing is selected", () => {

            let ret: Range | null;

            mockWindowSelection({isCollapsed: true});
            ret = HtmlDomUtils.getSelectionRange(sampleDiv);
            expect(window.getSelection).toHaveBeenCalledTimes(1);
            expect(ret).toEqual(null);


            mockWindowSelection({isCollapsed: false, rangeCount: 0});
            ret = HtmlDomUtils.getSelectionRange(sampleDiv);
            expect(window.getSelection).toHaveBeenCalledTimes(1);
            expect(ret).toEqual(null);
        });
    });

    describe("replace range", () => {

        it("returns clone of input element", () => {

            let ret: HTMLElement | null;
            // @ts-ignore
            xpathRange.fromRange = jest.fn().mockImplementation(() => {
                return xpathTextPointerRange;
            });
            // @ts-ignore
            xpathRange.toRange = jest.fn().mockImplementation(() => {
                return textPointerRange;
            });
            ret = HtmlDomUtils.replaceRange(sampleDiv, textPointerRange, surroundingElementHtml);
            expect(xpathRange.fromRange).toHaveBeenCalledWith( expect.any(Object), sampleDiv);
            expect(xpathRange.toRange).toHaveBeenCalledWith(
                xpathTextPointerRange.start, xpathTextPointerRange.startOffset,
                xpathTextPointerRange.end, xpathTextPointerRange.endOffset,
                expect.any(Object)
            );
            expect(ret === sampleDiv).toBe(false);
            expect(ret.childNodes[0].childNodes[0].nodeValue)
                .toEqual(sampleDiv.childNodes[0].childNodes[0].nodeValue);
        });
    });
});
