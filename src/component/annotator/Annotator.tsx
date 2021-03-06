import * as React from "react";
import {Instruction, Node as Node2, Parser as HtmlToReactParser, ProcessNodeDefinitions} from "html-to-react";
import Annotation from "./Annotation";
import IntlData from "../../model/IntlData";
import HtmlParserUtils from "./HtmlParserUtils";
import AnnotationDomHelper from "./AnnotationDomHelper";
import Term from "../../model/Term";
import HtmlDomUtils from "./HtmlDomUtils";
import LegendToggle from "./LegendToggle";
import {DomUtils} from "htmlparser2";

interface AnnotatorProps {
    initialHtml: string
    intl: IntlData
    onUpdate(newHtml: string): void
    onFetchTerm(termIri: string): Promise<Term>
    onCreateTerm(term: Term): Promise<Term>
}

interface AnnotatorState {
    prefixMap: Map<string, string>
    internalHtml: string // TODO use htmlparser2 dom instead
    stickyAnnotationId: string
}

export interface AnnotationSpanProps {
    // TODO remove
    about?: string
    property?: string
    resource?: string
    content?: string;
    typeof?: string
    score?: string
}

const ANNOTATION_MINIMUM_SCORE_THRESHOLD = 0.65;

interface HtmlSplit {
    prefix: string,
    body: string,
    suffix: string
}

type RangeFilterCallback = (range: Range) => boolean;

export class Annotator extends React.Component<AnnotatorProps, AnnotatorState> {
    private containerElement: HTMLDivElement | null;

    constructor(props: AnnotatorProps) {
        super(props);
        const htmlSplit = Annotator.matchHtml(props.initialHtml);
        const prefixMap = Annotator.getPrefixesOfHtmlTag(htmlSplit.prefix + htmlSplit.suffix);
        this.state = {
            prefixMap,
            internalHtml: htmlSplit.body,
            stickyAnnotationId: ""
        };
    }

    private static getPrefixesOfHtmlTag(html: string): Map<string, string> {
        const dom = HtmlParserUtils.html2dom(html);
        const htmlNode = DomUtils.findOneChild(
            (n: Node2) => n.name === "html" && n.attribs && n.attribs.prefix,
            dom);
        if (htmlNode) {
            return HtmlParserUtils.getPrefixMap(htmlNode);
        }
        return new Map();
    }

    private static getRDFNodeId(): string {
        return "_:" + Math.random().toString(36).substring(8);
    }

    private onRemove = (annotationId: string) => {
        const dom = HtmlParserUtils.html2dom(this.state.internalHtml);
        const ann = AnnotationDomHelper.findAnnotation(dom, annotationId, this.state.prefixMap);
        if (ann) {
            AnnotationDomHelper.removeAnnotation(ann);
            const newInternalHtml = HtmlParserUtils.dom2html(dom);
            this.setState(
                {
                    internalHtml: newInternalHtml,
                    stickyAnnotationId: ""
                }
            );
            this.props.onUpdate(this.reconstructHtml(newInternalHtml));
        }
    };

    private onUpdate = (annotationSpan: AnnotationSpanProps) => {
        const dom = HtmlParserUtils.html2dom(this.state.internalHtml);
        const ann = AnnotationDomHelper.findAnnotation(dom, annotationSpan.about!, this.state.prefixMap);
        if (ann) {
            if (annotationSpan.resource) {
                ann.attribs.resource = annotationSpan.resource!;
            }
            delete ann.attribs.score;
            this.updateInternalHtml(dom);
            if (!annotationSpan.resource && annotationSpan.content) {
                this.assignNewTerm(annotationSpan.about!, annotationSpan.content!);
            }
        }
    };

    private assignNewTerm = (annAbout: string, termLabel: string) => {

        const term = new Term({label: termLabel});
        this.props.onCreateTerm(term).then(
            (t: Term) => {
                const dom = HtmlParserUtils.html2dom(this.state.internalHtml);
                const ann = AnnotationDomHelper.findAnnotation(dom, annAbout, this.state.prefixMap);
                if (ann) {
                    ann.attribs.resource = t.iri;
                }
                this.updateInternalHtml(dom);
            }
        ).catch(
            (d) => (d)
        );
    };

    private updateInternalHtml = (dom: [Node2]) => {
        const newInternalHtml = HtmlParserUtils.dom2html(dom);
        this.setState(
            {internalHtml: newInternalHtml}
        );
        this.props.onUpdate(this.reconstructHtml(newInternalHtml));
    };


    private getProcessingInstructions = (): Instruction[] => {
        // Order matters. Instructions are processed in the order they're defined
        const processNodeDefinitions = new ProcessNodeDefinitions(React);
        const prefixMap = this.state.prefixMap;
        return [
            {
                // Custom annotated <span> processing
                shouldProcessNode: (node: any): boolean => {
                    return AnnotationDomHelper.isAnnotation(node, prefixMap);
                },
                processNode: (node: any, children: any) => {

                    // filter annotations by score
                    if (!AnnotationDomHelper.isAnnotationWithMinimumScore(
                        node,
                        ANNOTATION_MINIMUM_SCORE_THRESHOLD,
                        prefixMap)) {
                        return <React.Fragment key={node.attribs.about}>{node.children[0].data}</React.Fragment>;
                    }
                    const sticky = this.state.stickyAnnotationId === node.attribs.about;

                    const attribs = HtmlParserUtils.resolveRDFAttributes(node.attribs, prefixMap);

                    return <Annotation key={node.attribs.about} onRemove={this.onRemove} onUpdate={this.onUpdate}
                                       onFetchTerm={this.props.onFetchTerm} sticky={sticky}
                                       text={node.children[0].data} {...attribs} />
                }
            }, {
                // Anything else
                shouldProcessNode: (node: any): boolean => {
                    return true;
                },
                processNode: processNodeDefinitions.processDefaultNode
            }];
    };

    private handleMouseLeave = () => {
        if (this.containerElement) {
            const about = Annotator.getRDFNodeId();
            const newContainerElement = Annotator.getSurroundedSelection(this.containerElement, about);

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

        return <div>
            <LegendToggle/>
            <div id={"annotator"}
            ref={r => {
                this.containerElement = r
            }}
            onMouseUp={this.handleMouseLeave}>
            {Annotator.attachKeys(reactComponents)}
        </div>
            </div>
    }

    private reconstructHtml(htmlBodyContent: string) {
        const htmlSplit = Annotator.matchHtml(this.props.initialHtml);
        return htmlSplit.prefix + htmlBodyContent + htmlSplit.suffix;
    }

    // TODO generation of keys might be issue if page dynamically changes content
    private static attachKeys(nodes: any[]) {
        return nodes.map((n: any, i: number) => <React.Fragment key={i}>{n}</React.Fragment>)
    }

    private static getSelection(rootElement: HTMLElement): Range | null {
        const range = HtmlDomUtils.getSelectionRange(
            rootElement
        );
        const selectionFilter = Annotator.composeRangeFilters(
            Annotator.isTextNode,
            Annotator.isNotInsideAnnotation
        );

        if (range && selectionFilter(range)) {
            return range;
        }
        return null;
    }


    private static getSurroundedSelection(rootElement: HTMLElement, about: string): HTMLElement | null {
        const originalRange = Annotator.getSelection(rootElement);
        if (originalRange) {
            const text = HtmlDomUtils.getText(originalRange);
            const newAnnotationNode = AnnotationDomHelper.createNewAnnotation(about, text);
            const newContainerElement = HtmlDomUtils.replaceRange(
                rootElement,
                originalRange,
                HtmlParserUtils.dom2html([newAnnotationNode])
            );
            return newContainerElement;
        }
        return null;
    }

    private static matchHtml(htmlContent: string): HtmlSplit {

        const htmlSplit = htmlContent.split(/(<body.*>|<\/body>)/ig);

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

    private static composeRangeFilters(...filters: RangeFilterCallback[]): RangeFilterCallback {
        return (range: Range): boolean => {
            return [range].filter(v => filters.every(f => f(v))).length !== 0;
        }
    }

    private static isTextNode(range: Range): boolean {
        return (range.startContainer === range.endContainer)
            && (range.startContainer === range.commonAncestorContainer)
            && (range.commonAncestorContainer.nodeType === Node.TEXT_NODE);
    }

    private static isNotInsideAnnotation(range: Range): boolean {
        if (!range.commonAncestorContainer.parentElement) {
            return true;
        }
        const dom = HtmlParserUtils.html2dom(range.commonAncestorContainer.parentElement!.outerHTML);
        if (dom.length !== 1) {
            return true;
        }
        return !AnnotationDomHelper.isAnnotation(dom[0]);
    }
}
