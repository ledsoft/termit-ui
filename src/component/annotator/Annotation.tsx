import * as React from 'react';
import TermSelect from "./TermSelect";
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

export interface AnnotationSpanProps {
    about?: string
    property?: string
    resource?: string
    typeof?: string
    score?: string
}

interface AnnotationProps extends HasI18n, AnnotationSpanProps {
    about: string
    property: string
    resource?: string
    typeof: string
    score?: string
    text: string
    selectedTerm: Term | null
    defaultTerms: Term[];
    vocabulary: Vocabulary
    sticky?: boolean;
    selectVocabularyTerm: (selectedTerm: Term | null) => Promise<object>;
}

interface AnnotationState {
    detailOpened: boolean
    detailEditable: boolean
    detailPinned: boolean
}

const TermOccurrenceState = {
    INVALID: 'invalid-term-occurrence',
    ASSIGNED: 'assigned-term-occurrence',
    SUGGESTED: 'suggested-term-occurrence',
};

export class Annotation extends React.Component<AnnotationProps, AnnotationState> {

    constructor(props: any) {
        super(props);

        this.state = {
            detailOpened: false,
            detailEditable: false,
            detailPinned: true
        };
    }

    public componentDidMount() {
        if (this.props.resource) {
            this.findTermByIri(this.props.resource);
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

    private onClick = () => {
        this.toggleOpenDetail();
    };

    private onMouseEnter = () => {
        this.openDetail();
    };

    private onMouseLeave = () => {
        if (!this.state.detailEditable && !this.props.sticky) {
            this.closeDetail();
        }
    };

    private getReadOnlyComponent = () => {
        const i18n = this.props.i18n;
        const term = (this.props.resource) ? this.findTermByIri(this.props.resource) : null;
        const score = this.props.score;
        const scoreRow = (score) ? <tr>
            <td>{i18n('annotation.term.occurrence.scoreLabel')}</td>
            <td>{score}</td>
        </tr> : null;
        const labelRow = (term) ? <tr>
            <td>{i18n('annotation.term.assigned-occurrence.termLabel')}</td>
            <td><OutgoingLink
                label={term!.label}
                iri={term!.iri}/></td>
        </tr> : null;
        let outputComponent = <div/>;
        switch (this.getTermState()) {
            case TermOccurrenceState.ASSIGNED:
                const termCommentRow = (term!.comment) ? <tr>
                    <td>{i18n('annotation.form.assigned-occurrence.termInfoLabel')}</td>
                    <td>{term!.comment}</td>
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

    private getEditableComponent = () => <div>
        <TermSelect/>
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
        if (this.findTermByIri(this.props.resource)) {
            return TermOccurrenceState.ASSIGNED
        }
        return TermOccurrenceState.INVALID;
    }


    public render() {
        const id = 'id' + this.props.about.substring(2);
        const termClassName = this.getTermState();
        const actions = [];
        if (!this.state.detailEditable) {
            actions.push(<Button key='glossary.edit'
                                 color='secondary'
                                 title={"edit"}
                                 size='sm'
                                 onClick={this.toggleEditDetail}>{"✎"}</Button>);
        }
        if (this.state.detailEditable) {
            actions.push(<Button key='glossary.save'
                                 color='secondary'
                                 title={"save"}
                                 size='sm'
                                 onClick={this.toggleEditDetail}>{"✓"}</Button>);
        }
        actions.push(<Button key='glossary.close'
                             color='secondary'
                             title={"close"}
                             size='sm'
                             onClick={this.onClick}>{"x"}</Button>);
        return <span id={id}
                     onMouseEnter={this.onMouseEnter}
                     onMouseLeave={this.onMouseLeave}
                     about={this.props.about}
                     property={this.props.property}
                     resource={this.props.resource}
                     typeof={this.props.typeof}
                     className={termClassName}
        >
        {this.props.text}
            <SimplePopupWithActions isOpen={this.state.detailOpened} isEditable={this.state.detailOpened}
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
        selectedTerm: state.selectedTerm,
        defaultTerms: state.defaultTerms
    };
}, (dispatch: ThunkDispatch) => {
    return {
        selectVocabularyTerm: (selectedTerm: Term | null) => dispatch(selectVocabularyTerm(selectedTerm)),
    };
})(injectIntl(withI18n(Annotation)));