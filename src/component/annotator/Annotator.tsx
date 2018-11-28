import * as React from "react";
import {Instruction, Parser as HtmlToReactParser, ProcessNodeDefinitions} from 'html-to-react';
import Annotation from "./Annotation";
import * as ReactDOM from "react-dom";
import {Provider} from "react-redux";
import TermItStore from "../../store/TermItStore";
import {IntlProvider} from "react-intl";
import IntlData from "../../model/IntlData";

interface AnnotatorProps {
    html: string
    intl: IntlData
}

const DEFAULT_RDF_PROPERTY_VALUE = "ddo:je-vyskytem-termu";
const DEFAULT_RDF_TYPEOF_VALUE = "ddo:vyskyt-termu";

interface AnnotationTarget {
    element: HTMLElement
    text: string
}

interface HtmlSplit {
    prefix: string,
    body: string,
    suffix: string
}

export class Annotator extends React.Component<AnnotatorProps> {
    private containerElement: HTMLDivElement | null;
    private stickyAnnotationId: string;

    constructor(props: AnnotatorProps) {
        super(props);
    }

    // TODO extract to separate class
    public surroundSelection = (element: any, document: any): AnnotationTarget | null => {

        const sel = window.getSelection();

        if (!sel.isCollapsed) {

            if (sel.rangeCount) {
                const range = sel.getRangeAt(0).cloneRange();

                const fragment = range.cloneContents();
                if ((fragment.childNodes.length === 1) && (fragment.childNodes[0].nodeType === Node.TEXT_NODE)) {
                    const span = document.createElement("span");
                    const text = fragment.childNodes[0].nodeValue!;

                    // replace
                    range.extractContents();
                    range.surroundContents(span);
                    sel.removeAllRanges();
                    sel.addRange(range);

                    return {element: span, 'text': text};
                }
            }
        }
        return null;
    }

    private renderAnnotation(annTarget: AnnotationTarget) {
        const annId = this.getRDFNodeId();
        this.stickyAnnotationId = annId;
        ReactDOM.render(
            this.getAnnotation(annId, annTarget.text),
            annTarget.element);
    }


    private isStickyAnnotation = (annotationId: string) =>  {
        return () =>  (this.stickyAnnotationId === annotationId) ;
    };

    private getAnnotation = (id: string, text: string) => {
        return <Provider store={TermItStore}>
            <IntlProvider {...this.props.intl}>
                <Annotation about={id} property={DEFAULT_RDF_PROPERTY_VALUE}
                            typeof={DEFAULT_RDF_TYPEOF_VALUE}
                            text={text}
                            isSticky={this.isStickyAnnotation(id)}/>
            </IntlProvider>
        </Provider>
    }

    private getRDFNodeId(): string {
        return '_:' + Math.random().toString(36).substring(8);
    }

    private getProcessingInstructions(): Instruction[] {
        // Order matters. Instructions are processed in the order they're defined
        const processNodeDefinitions = new ProcessNodeDefinitions(React);
        return [
            {
                // Custom annotated <span> processing
                shouldProcessNode: (node: any): boolean => {
                    // return node.parent && node.parent.name && node.parent.name === 'span';
                    return node.name && (node.name === 'span') && (node.attribs.typeof === "ddo:vyskyt-termu")
                },
                processNode: (node: any, children: any) => {
                    // node.attribs = Object.assign(node.attribs, { style:'background-color: rgb(132, 210, 255);
                    // padding: 0px 4px;'})
                    return <Annotation text={node.children[0].data} {...node.attribs} />
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
            const annTarget = this.surroundSelection(this.containerElement, this.containerElement.ownerDocument)
            if (annTarget != null) {
                this.renderAnnotation(annTarget);
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
                this.matchHtml(this.props.html).body,
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
}