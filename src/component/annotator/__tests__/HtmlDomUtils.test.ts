// @ts-ignore
import {XPathRange} from "xpath-range";
import HtmlDomUtils from "../HtmlDomUtils";
import * as xpathRange from "xpath-range";


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
    const textPointerSelector : XPathRange = {
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
        const parser = new DOMParser();
        doc = parser.parseFromString(htmlContent, "text/html");
        sampleDiv = doc.createElement("div");
        sampleDiv.innerHTML = sampleDivContent
        sampleTextNode = doc.createTextNode("text pointer");
        doc.body.appendChild(sampleDiv);
    });


    describe("get selection range", () => {

        it("returns range for a text node", () => {

            let ret: XPathRange | null;

            mockWindowSelection({
                isCollapsed: false,
                rangeCount: 1,
                getRangeAt
            });
            xpathRange.fromRange = jest.fn().mockImplementation(() => {
                return textPointerSelector;
            });
            ret = HtmlDomUtils.getSelectionRange(sampleDiv);
            expect(window.getSelection).toHaveBeenCalled();
            expect(getRangeAt).toHaveBeenCalledWith(0);
            expect(cloneContents).toHaveBeenCalled();
            expect(xpathRange.fromRange).toHaveBeenCalledWith( expect.any(Object), sampleDiv);
            expect(ret).toEqual(textPointerSelector);
        });


        it("returns null if nothing is selected", () => {

            let ret: XPathRange | null;

            mockWindowSelection({isCollapsed: true});
            ret = HtmlDomUtils.getSelectionRange(sampleDiv);
            expect(window.getSelection).toHaveBeenCalledTimes(1);
            expect(ret).toEqual(null);


            mockWindowSelection({isCollapsed: false, rangeCount: 0});
            ret = HtmlDomUtils.getSelectionRange(sampleDiv, true);
            expect(window.getSelection).toHaveBeenCalledTimes(1);
            expect(ret).toEqual(null);
        });

        it("returns null if not a text node", () => {

            let ret: XPathRange | null;

            mockWindowSelection({isCollapsed: true});
            ret = HtmlDomUtils.getSelectionRange(sampleDiv);
            expect(window.getSelection).toHaveBeenCalledTimes(1);
            expect(ret).toEqual(null);


            mockWindowSelection({isCollapsed: false, rangeCount: 0});
            ret = HtmlDomUtils.getSelectionRange(sampleDiv, true);
            expect(window.getSelection).toHaveBeenCalledTimes(1);
            expect(ret).toEqual(null);
        });

    });



    // let doc: Document;
    // let sampleDiv: HTMLElement;


    // });

    // it("getSelectionRange returns xpath range of window selection", () => {
    //     const x = window.getSelection();
    //     console.log(x);
    //     mountDOM(`<div id="foo"><h1>Just HTML</h1></div>`);
    //
    //     const myDiv = document.getElementById('foo');
    //     console.log(myDiv);
    //
    //
    //     const range = doc.createRange();
    //     range.selectNode(sampleDiv);
    //     const xpathRange = fromRange(range, sampleDiv);
    //     console.log(xpathRange);
    //     // const range = toRange(
    //     //     textPointerSelector.start,
    //     //     textPointerSelector.startOffset,
    //     //     textPointerSelector.end,
    //     //     textPointerSelector.endOffset,
    //     //     sampleDiv
    //     // );
    //     console.log(range);
    //    // expect(wrapper.html().includes(sampleContent)).toBe(true);
    // });


});
