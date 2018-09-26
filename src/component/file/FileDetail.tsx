import * as React from 'react';
import {injectIntl, IntlProvider} from 'react-intl';
import withI18n, {HasI18n} from '../hoc/withI18n';
import {connect, Provider} from "react-redux";
import TermItState from "../../model/TermItState";
import {loadFileContent, loadTerms} from "../../action/ComplexActions";
import {ThunkDispatch} from "redux-thunk";
import {Action} from "redux";
import Document from "../../model/Document";
import {Instruction, Parser as HtmlToReactParser, ProcessNodeDefinitions} from 'html-to-react';
import Annotation from "../annotation/Annotation";
import * as ReactDOM from 'react-dom';
import {RouteComponentProps} from "react-router";
import Vocabulary2, {IRI} from "../../util/VocabularyUtils";
import Vocabulary from "../../model/Vocabulary";
import TermItStore from "../../store/TermItStore";
import IntlData from "../../model/IntlData";


interface FileDetailProps extends HasI18n, RouteComponentProps<any> {
    vocabulary: Vocabulary,
    document: Document,
    fileIri: string | null,
    fileContent: string | null
    loadContentFile: (documentIri: IRI, fileName: string) => void
    loadTerms: (normalizedVocabularyName: string) => void
    intl: IntlData
}

class FileDetail extends React.Component<FileDetailProps> {
    private containerElement: HTMLDivElement | null;

    public componentDidMount(): void {
        const normalizedFileName = this.props.match.params.name;
        if (this.props.vocabulary.iri) {
            this.props.loadTerms(this.getNormalizedName(this.props.vocabulary.iri))
        }
        this.props.loadContentFile(Vocabulary2.create(this.props.document.iri), normalizedFileName);
    }

    private getNormalizedName(iri: string): string {
        return Vocabulary2.create(iri).fragment;
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


            if (selection) {
                const sel = window.getSelection();
                if (sel.rangeCount) {
                    const range = sel.getRangeAt(0).cloneRange();

                    const fragment = range.cloneContents();
                    if ((fragment.childNodes.length === 1) && (fragment.childNodes[0].nodeType === Node.TEXT_NODE)) {
                        const span = document.createElement("span");
                        const text = fragment.childNodes[0].nodeValue!;

                        range.extractContents();
                        range.surroundContents(span);
                        sel.removeAllRanges();
                        sel.addRange(range);

                        ReactDOM.render(
                            this.getAnnotation(text),
                            span);
                    }


                }
            }
        }
    }


    private getAnnotation = (text: string) => {
        return <Provider store={TermItStore}>
            <IntlProvider {...this.props.intl}>
                <Annotation about={this.getRDFNodeId()} property={"ddo:je-vyskytem-termu"} typeof={"ddo:vyskyt-termu"}
                            text={text}/>
            </IntlProvider>
        </Provider>
    }

    private getRDFNodeId(): string {
        return '_:' + Math.random().toString(36).substring(8);
    }

    private handleMouseLeave = () => {
        if (this.containerElement) {
            this.surroundSelection(this.containerElement, this.containerElement.ownerDocument)
        }
    };

    // private onAnnotate = () => {
    // };
    //
    // private onSave = () => {
    // };

    public render() {
        // const actions = [];
        // actions.push(<Button key='glossary.edit'
        //                          color='secondary'
        //                          title={"annotate"}
        //                          size='sm'
        //                          onClick={this.onAnnotate}>{"✎"}</Button>);
        // actions.push(<Button key='glossary.save'
        //                          color='secondary'
        //                          title={"save"}
        //                          size='sm'
        //                          onClick={this.onSave}>{"✓"}</Button>);

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

}

export default connect((state: TermItState) => {
    return {
        vocabulary: state.vocabulary,
        document: state.document,
        fileIri: state.fileIri,
        fileContent: state.fileContent,
        intl: state.intl
    };
}, (dispatch: ThunkDispatch<object, undefined, Action>) => {
    return {
        loadContentFile: (documentIri: IRI, fileName: string) => dispatch(loadFileContent(documentIri, fileName)),
        loadTerms: (normalizedVocabularyName: string) => dispatch(loadTerms(normalizedVocabularyName))
    };
})(injectIntl(withI18n(FileDetail)));