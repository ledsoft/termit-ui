import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from '../hoc/withI18n';
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {loadFileContent} from "../../action/ComplexActions";
import {ThunkDispatch} from "redux-thunk";
import {Action} from "redux";
import Document from "../../model/Document";
import {Instruction, Parser as HtmlToReactParser, ProcessNodeDefinitions} from 'html-to-react';
import Annotation from "../annotation/Annotation";
import * as ReactDOM from 'react-dom';
import {RouteComponentProps} from "react-router";
import Vocabulary, {IRI} from "../../util/Vocabulary";


interface FileDetailProps extends HasI18n, RouteComponentProps<any> {
    document: Document,
    fileIri: string | null,
    fileContent: string| null
    loadContentFile: (documentIri: IRI, fileName: string) => void
}

class FileDetail extends React.Component<FileDetailProps> {
    private containerElement: HTMLDivElement | null;

    public componentDidMount(): void {
        const normalizedName = 'metropolitan-plan-p1.html'; // this.props.match.params.name; //TODO remove
        this.props.loadContentFile(Vocabulary.create(this.props.document.iri), normalizedName);
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
                    // node.attribs = Object.assign(node.attribs, { style:'background-color: rgb(132, 210, 255); padding: 0px 4px;'})
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

    private surroundSelection = (element: any, document: any) => {

        const selection = window.getSelection();

        if (!selection.isCollapsed) {
            const span = document.createElement("span");

            if (selection) {
                const sel = window.getSelection();
                if (sel.rangeCount) {
                    const range = sel.getRangeAt(0).cloneRange();
                    range.surroundContents(span);
                    sel.removeAllRanges();
                    sel.addRange(range);

                    ReactDOM.render(this.getAnnotation("sample-text"), span);
                }
            }
        }
    }

    private getAnnotation(text: string) {
        return <Annotation about={'_:fsdjifoisj'} property={"ddo:je-vyskytem-termu"} resource={"http://test.org/pojem/metropolitni-plan"} typeof={"ddo:vyskyt-termu"} text={text}/>
    }


    private handleMouseLeave = () => {

        if (this.containerElement !== null) {
            // const range = this.captureDocumentSelection(this.containerElement, this.containerElement.ownerDocument);
            const range = this.surroundSelection(this.containerElement, this.containerElement.ownerDocument)

            // tslint:disable-next-line:no-console
            console.log(range);

            // tslint:disable-next-line:no-console
            console.log(this.containerElement);
        }


        const sel = window.getSelection();
        // tslint:disable-next-line:no-console
        console.log(sel);
    };



    public render() {
        const isValidNode = () => {
            return true;
        };
        const htmlToReactParser = new HtmlToReactParser();
        const reactComponent = htmlToReactParser.parseWithInstructions(this.props.fileContent, isValidNode,
            this.getProcessingInstructions());

        return <div
            ref={r => {
                this.containerElement = r
            }}
            onMouseUp={this.handleMouseLeave}>
            {reactComponent}
        </div>
    }

    public componentDidUpdate() {
        if (this.containerElement && (this.containerElement.children.length !== 0)) {

            // tslint:disable-next-line:no-console
            console.log(this.containerElement);
        } else {
            // tslint:disable-next-line:no-console
            console.log('not yet ...');
        }
    }
}

export default connect((state: TermItState) => {
    return {
        document: state.document,
        fileIri: state.fileIri,
        fileContent: state.fileContent
    };
}, (dispatch: ThunkDispatch<object, undefined, Action>) => {
    return {
        loadContentFile: (documentIri: IRI, fileName: string) => dispatch(loadFileContent(documentIri, fileName))
    };
})(injectIntl(withI18n(FileDetail)));