import * as React from "react";
import {Instruction, Parser as HtmlToReactParser, ProcessNodeDefinitions} from 'html-to-react';
import Annotation from "./Annotation";
import IntlData from "../../model/IntlData";
import {fromRange, toRange} from "xpath-range";
import HtmlParserUtils from "./HtmlParserUtils";
import AnnotationDomHelper from "./AnnotationDomHelper";
import Term from "../../model/Term";

interface AnnotatorProps {
    html: string
    intl: IntlData
    onUpdate(newHtml :string): void
    onFetchTerm(termIri: string): Promise<Term>
}

interface AnnotatorState {
    internalHtml: string // TODO use htmlparser2 dom instead
    stickyAnnotationId : string
}

export interface AnnotationSpanProps { // TODO remove
    about?: string
    property?: string
    resource?: string
    typeof?: string
    score?: string
}

export const DEFAULT_RDF_PROPERTY_VALUE = "ddo:je-vyskytem-termu";
export const DEFAULT_RDF_TYPEOF_VALUE = "ddo:vyskyt-termu";
const ANNOTATION_MINIMUM_SCORE_THRESHOLD = 0.65;

interface HtmlSplit {
    prefix: string,
    body: string,
    suffix: string
}

export class Annotator extends React.Component<AnnotatorProps, AnnotatorState> {
    private containerElement: HTMLDivElement | null;

    constructor(props: AnnotatorProps) {
        super(props);
        this.state = {
            internalHtml: this.matchHtml(props.html).body,
            stickyAnnotationId: ""
        };
    }

    // TODO extract to separate class
    public surroundSelection = (element: any, document: any, about: string): HTMLDivElement | null => {

        const sel = window.getSelection();

        if (!sel.isCollapsed) {

            if (sel.rangeCount) {
                const rangeOriginal = sel.getRangeAt(0);

                const xpathSelection = fromRange(rangeOriginal, element);
                const clonedElement = element.cloneNode(true);
                const range = toRange(xpathSelection.start, xpathSelection.startOffset, xpathSelection.end, xpathSelection.endOffset, clonedElement);

                const fragment = range.cloneContents();
                if ((fragment.childNodes.length === 1) && (fragment.childNodes[0].nodeType === Node.TEXT_NODE)) {
                    const span = document.createElement("span");
                    const text = fragment.childNodes[0].nodeValue!;

                    span.setAttribute("about", about);
                    span.setAttribute("property", DEFAULT_RDF_PROPERTY_VALUE);
                    span.setAttribute("typeof", DEFAULT_RDF_TYPEOF_VALUE);

                    // replace
                    range.extractContents();
                    range.surroundContents(span);
                    span.append(document.createTextNode(text));

                    return clonedElement;
                }
            }
        }
        return null;
    }

    private getRDFNodeId(): string {
        return '_:' + Math.random().toString(36).substring(8);
    }

    private onRemove = (annotationId : string) => {
        const dom = HtmlParserUtils.html2dom(this.state.internalHtml);
        const ann = AnnotationDomHelper.findAnnotation(dom, annotationId);
        if (ann) {
            AnnotationDomHelper.removeAnnotation(ann);
            const newInternalHtml = HtmlParserUtils.dom2html(dom);
            this.setState(
                { internalHtml: newInternalHtml,
                        stickyAnnotationId: ""
                }
            )
            this.props.onUpdate(this.reconstructHtml(newInternalHtml));
        }
    };

    private onUpdate = (annotationSpan : AnnotationSpanProps) => {
        const dom = HtmlParserUtils.html2dom(this.state.internalHtml);
        const ann = AnnotationDomHelper.findAnnotation(dom, annotationSpan.about!);
        if (ann) {
            ann.attribs.resource = annotationSpan.resource;
            delete ann.attribs.score;
            const newInternalHtml = HtmlParserUtils.dom2html(dom);
            this.setState(
                { internalHtml: newInternalHtml }
            )
            this.props.onUpdate(this.reconstructHtml(newInternalHtml));
        }
    };

    private getProcessingInstructions = ():Instruction[] => {
        // Order matters. Instructions are processed in the order they're defined
        const processNodeDefinitions = new ProcessNodeDefinitions(React);
        return [
            {
                // Custom annotated <span> processing
                shouldProcessNode: (node: any): boolean => {
                    // return node.parent && node.parent.name && node.parent.name === 'span';
                    return AnnotationDomHelper.isAnnotation(node);
                },
                processNode: (node: any, children: any) => {
                    // node.attribs = Object.assign(node.attribs, { style:'background-color: rgb(132, 210, 255);
                    // padding: 0px 4px;'})

                    // filter annotations by score
                    if (! AnnotationDomHelper.isAnnotationWithMinimumScore(node, ANNOTATION_MINIMUM_SCORE_THRESHOLD)){
                         // return AnnotationDomHelper.createTextualNode(node);
                         return <React.Fragment key={node.attribs.about}>{node.children[0].data}</React.Fragment>;
                    }
                    const sticky = this.state.stickyAnnotationId === node.attribs.about;
                    return <Annotation onRemove={this.onRemove} onUpdate={this.onUpdate} onFetchTerm={this.props.onFetchTerm} sticky={sticky} text={node.children[0].data} {...node.attribs} />
                    // return node.data.toUpperCase();
                }
            }, {
                // Anything else
                shouldProcessNode: (node: any): boolean => {
                    return true;
                },
                processNode: processNodeDefinitions.processDefaultNode
            }];
    }

    private handleMouseLeave = () => {
        if (this.containerElement) {
            const about = this.getRDFNodeId();
            const newContainerElement = this.surroundSelection(this.containerElement, this.containerElement.ownerDocument, about)
            if (newContainerElement != null) {
                this.setState(
                    {
                        internalHtml: newContainerElement.innerHTML,
                        stickyAnnotationId: about
                    }
                )
            }
        }
    };

    public render() {
        const isValidNode = () => {
            return true;
        };

        const htmlToReactParser = new HtmlToReactParser();
        const reactComponents = [].concat(
            htmlToReactParser.parseWithInstructions(
                this.state.internalHtml,
                isValidNode,
                this.getProcessingInstructions()
            ));

        return <div
            ref={r => {
                this.containerElement = r
            }}
            onMouseUp={this.handleMouseLeave}>
            {Annotator.attachKeys(reactComponents)}
        </div>
    }

    // TODO generation of keys might be issue if page dynamically changes content
    private static attachKeys(nodes: any[]) {
        return nodes.map((n:any,i:number) => <React.Fragment key={i}>{n}</React.Fragment>)
    }

    private matchHtml(htmlContent: string): HtmlSplit {

        const htmlSplit = htmlContent.split(/(<body>|<\/body>)/ig);

        if (htmlSplit.length === 5) {
            return {
                prefix: htmlSplit[0] + htmlSplit[1],
                body: htmlSplit[2],
                suffix: htmlSplit[3] + htmlSplit[4]
            }
        }
        return {
            prefix: "",
            body: htmlContent,
            suffix: ""
        }

    }

    private reconstructHtml(htmlBodyContent: string) {
        const htmlSplit = this.matchHtml(this.props.html);
        return htmlSplit.prefix + htmlBodyContent + htmlSplit.suffix;
    }
}