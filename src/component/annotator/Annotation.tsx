import * as React from 'react';
import {connect} from "react-redux";
import Term from "../../model/Term";
import {selectVocabularyTerm} from "../../action/SyncActions";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Button} from "reactstrap";
import SimplePopupWithActions from "./SimplePopupWithActions";
import "./Annotation.scss";
import TermItState from "../../model/TermItState";
import Vocabulary from "../../model/Vocabulary";
import OutgoingLink from "../misc/OutgoingLink";
import {ThunkDispatch} from "../../util/Types";
import AnnotationTerms from "./AnnotationTerms";
import {AnnotationSpanProps} from "./Annotator";
import {i18n} from "../../__tests__/environment/IntlUtil";

interface AnnotationProps extends HasI18n, AnnotationSpanProps {
    about: string
    property: string
    resource?: string // TODO rename to initialResource (we don't use it directly to render) !!!
    typeof: string
    score?: string
    text: string
    defaultTerms: Term[];
    vocabulary: Vocabulary
    sticky?: boolean;
    onRemove?: (annId: string) => void;
    onUpdate?: (annotation: AnnotationSpanProps) => void;
    onFetchTerm: (termIri: string) => Promise<Term>;
    selectVocabularyTerm: (selectedTerm: Term | null) => Promise<object>;
}

interface AnnotationState {
    detailOpened: boolean
    detailEditable: boolean
    detailPinned: boolean
    term: Term | null | undefined;
}

const TermOccurrenceState = {
    INVALID: 'invalid-term-occurrence',
    ASSIGNED: 'assigned-term-occurrence',
    SUGGESTED: 'suggested-term-occurrence',
};

const TermOccurrenceCreatorState = {
    PROPOSED: 'proposed-occurrence',
    SELECTED: 'selected-occurrence'
}

export class Annotation extends React.Component<AnnotationProps, AnnotationState> {

    constructor(props: any) { // TODO use props: AnnotationProps !!! (does not work)
        super(props);
        const resourceAssigned = (props.resource && (props.resource !== ""));
        this.state = {
            detailOpened: false,
            detailEditable: false,
            detailPinned: false,
            term: resourceAssigned ? undefined : null
        };
    }

    public componentDidMount() {
        if (this.props.resource) {
            this.props
                .onFetchTerm(this.props.resource).then(
                t => this.setState(
                    { term:t })
            ).catch(
                (reason) => undefined
            );
        }
    }

    private toggleOpenDetail = () => {
        this.setState({
            detailOpened: !this.state.detailOpened
        });
    };

    private closeDetail = () => {
        if (this.state.detailOpened) {
            this.setState({
                detailOpened: false
            });
        }
    };

    private openDetail = () => {
        if (!this.state.detailOpened) {
            this.setState({
                detailOpened: true
            });
        }
    };

    private onSaveDetail = () => {
        this.setState({
            detailEditable: false,
            detailPinned: false,
            detailOpened: false
        });
        // TODO -- start only if state changes
        if (this.props.onUpdate) {
            const newSpan: AnnotationSpanProps = {
                about: this.props.about,
                property: this.props.property,
                typeof: this.props.typeof
            }
            if (this.state.term) {
                newSpan.resource = this.state.term.iri;
            } else {
                newSpan.resource = this.props.resource;
            }
            this.props.onUpdate(newSpan);
        }

    };



    private toggleEditDetail = () => {
        if (!this.state.detailEditable) {
            if (this.props.resource) {
                this.props.selectVocabularyTerm(this.findTermByIri(this.props.resource));
            } else {
                this.props.selectVocabularyTerm(null);
            }
        }
        this.setState({
            detailEditable: !this.state.detailEditable
        });

    };

    private onRemoveAnnotation = () => {
        if (this.props.onRemove) {
            this.props.onRemove(this.props.about);
        }
    };

    private onCloseDetail = () => {
        this.setState({
            detailPinned: false,
            detailOpened: !this.state.detailOpened,
            detailEditable: false
        });
    };

    private onClick = () => {
        if (this.state.detailPinned) {
            this.setState({
                detailPinned: false
            });
        } else {
            this.setState({
                detailPinned: true
            });
        }
    };

    private onMouseEnter = () => {
        this.openDetail();
    };

    private onMouseLeave = () => {
        if (!this.state.detailEditable && !this.state.detailPinned && !this.props.sticky) {
            this.closeDetail();
        }
    };

    private getReadOnlyComponent = () => {
        const i18n = this.props.i18n;
        const score = this.props.score;
        const scoreRow = (score) ? <tr>
            <td>{i18n('annotation.term.occurrence.scoreLabel')}</td>
            <td>{score}</td>
        </tr> : null;
        const labelRow = (this.state.term) ? <tr>
            <td className={"label"}>{i18n('annotation.term.assigned-occurrence.termLabel')}</td>
            <td><OutgoingLink
                label={this.state.term!.label}
                iri={this.state.term!.iri}/></td>
        </tr> : null;
        let outputComponent = <div/>;
        switch (this.getTermState()) {
            case TermOccurrenceState.ASSIGNED:
                const termCommentRow = (this.state.term!.comment) ? <tr>
                    <td>{i18n('annotation.form.assigned-occurrence.termInfoLabel')}</td>
                    <td>{this.state.term!.comment}</td>
                </tr> : null;
                outputComponent = <table>
                    <tbody>
                    {labelRow}
                    {scoreRow}
                    {termCommentRow}
                    </tbody>
                </table>;
                break;
            case TermOccurrenceState.SUGGESTED:
                outputComponent = <span className={'an-warning'}>
                    {i18n('annotation.form.suggested-occurrence.message')}
                    </span>
                break;
            case TermOccurrenceState.INVALID:
                const errorLine = i18n('annotation.form.invalid-occurrence.message').replace('%', this.props.resource!)

                outputComponent = <div>
                    <span className={'an-error'}>
                        {errorLine}
                    </span>
                    <table>
                        <tbody>
                        {labelRow}
                        {scoreRow}
                        </tbody>
                    </table>
                </div>;
                break;
        }
        return outputComponent;
    };

    private onTermChange = (term: Term) => {
        this.setState(
            { term }
        )
    };

    private getEditableComponent = () => <div>
        <AnnotationTerms selectedTerm={this.state.term ? this.state.term : null} onChange={this.onTermChange}/>
    </div>;

    private getComponent = () => {
        if (this.state.detailEditable) {
            return this.getEditableComponent();
        } else {
            return this.getReadOnlyComponent();
        }
    }

    private getTermState = () => {
        if (!this.props.resource) {
            return TermOccurrenceState.SUGGESTED;
        }
        if (this.state.term) {
            return TermOccurrenceState.ASSIGNED
        }
        return TermOccurrenceState.INVALID;
    }

    private getTermCreatorState = () => {
        if (this.props.score) {
            return TermOccurrenceCreatorState.PROPOSED;
        }
        return TermOccurrenceCreatorState.SELECTED;
    }


    public render() {
        const id = 'id' + this.props.about.substring(2);
        const termClassName = this.getTermState();
        const termCreatorClassName = this.getTermCreatorState();
        const actions = [];
        if (this.state.detailPinned || this.props.sticky) {
            if (this.props.onUpdate && (this.state.detailEditable || termCreatorClassName === TermOccurrenceCreatorState.PROPOSED)) {
                actions.push(<Button key='annotation.save'
                                     color='secondary'
                                     title={i18n("save")}
                                     size='sm'
                                     onClick={this.onSaveDetail}>{"✓"}</Button>);
            }
            if (!this.state.detailEditable) {
                actions.push(<Button key='annotation.edit'
                                     color='secondary'
                                     title={i18n("edit")}
                                     size='sm'
                                     onClick={this.toggleEditDetail}>{"✎"}</Button>);
            }
            if (this.props.onRemove) {
                actions.push(<Button key='annotation.remove'
                                     color='secondary'
                                     title={i18n("annotation.remove")}
                                     size='sm'
                                     onClick={this.onRemoveAnnotation}>{"🚮"}</Button>);
            }
            actions.push(<Button key='annotation.close'
                                 color='secondary'
                                 title={i18n("annotation.remove")}
                                 size='sm'
                                 onClick={this.onCloseDetail}>{"x"}</Button>);
        }
        return <span id={id}
                     onMouseEnter={this.onMouseEnter}
                     onMouseLeave={this.onMouseLeave}
                     onClick={this.onClick}
                     about={this.props.about}
                     property={this.props.property}
                     resource={this.props.resource}
                     typeof={this.props.typeof}
                     className={termClassName + " " + termCreatorClassName}
        >
        {this.props.text}
            <SimplePopupWithActions isOpen={this.state.detailOpened} isEditable={this.state.detailEditable}
                                    target={id} toggle={this.toggleOpenDetail}
                                    component={this.getComponent()} actions={actions} title={this.props.text}/>

        </span>;
    }

    private findTermByIri(iri: string): Term | null {
        return this.undefinedToNull(this.props.defaultTerms.filter((t, i) => (t.iri === iri)).pop());
    }

    private undefinedToNull(value: any) {
        if (value === undefined) {
            return null;
        }
        return value;
    }
}


export default connect((state: TermItState) => {
    return {
        vocabulary: state.vocabulary,
        defaultTerms: state.defaultTerms
    };
}, (dispatch: ThunkDispatch) => {
    return {
        selectVocabularyTerm: (selectedTerm: Term | null) => dispatch(selectVocabularyTerm(selectedTerm)),
    };
})(injectIntl(withI18n(Annotation)));