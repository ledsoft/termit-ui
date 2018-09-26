import * as React from 'react';
import GlossaryTermSelect from "./GlossaryTermSelect";
import {connect} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {Action} from "redux";
import VocabularyTerm from "../../model/VocabularyTerm";
import {selectVocabularyTerm} from "../../action/SyncActions";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Button} from "reactstrap";
import SimplePopupWithActions from "./SimplePopupWithActions";
import "./Annotation.scss";
import TermItState from "../../model/TermItState";
import Vocabulary from "../../model/Vocabulary";
import OutgoingLink from "../misc/OutgoingLink";

interface AnnotationProps extends HasI18n {
    about: string
    property: string
    resource?: string
    typeof: string
    text: string
    selectedTerm: VocabularyTerm | null
    defaultTerms: VocabularyTerm[];
    vocabulary: Vocabulary
    selectVocabularyTerm: (selectedTerm: VocabularyTerm | null) => Promise<object>;
}

interface AnnotationState {
    popoverOpen: boolean
    isEditable: boolean
}

const TermState = {
    INVALID: 'invalid-term',
    ASSIGNED: 'assigned-term',
    SUGGESTED: 'suggested-term',
};

class Annotation extends React.Component<AnnotationProps, AnnotationState> {

    constructor(props: any) {
        super(props);

        this.state = {
            popoverOpen: false,
            isEditable: false
        };
    }

    public componentDidMount() {
        if (this.props.resource) {
            this.findTermByIri(this.props.resource);
        }
    }

    private toggleOpen = () => {
        this.setState({
            popoverOpen: !this.state.popoverOpen
        });
    };

    private toggleEdit = () => {
        if (!this.state.isEditable) {
            if (this.props.resource) {
                this.props.selectVocabularyTerm(this.findTermByIri(this.props.resource));
            } else {
                this.props.selectVocabularyTerm(null);
            }
        }
        this.setState({
            isEditable: !this.state.isEditable
        });

    };

    private onClick = () => {
        this.toggleOpen();
    };

    private getReadOnlyComponent = () => {
        const i18n = this.props.i18n;
        const term = (this.props.resource) ? this.findTermByIri(this.props.resource) : null;
        let outputComponent = <div/>;
        switch (this.getTermState()) {
            case TermState.ASSIGNED:
                const termCommentRow = (term!.comment) ? <tr>
                    <td>{i18n('annotation.form.assignedterm.termInfoLabel')}</td>
                    <td>{term!.comment}</td>
                </tr> : "";

                outputComponent = <table>
                    <tr>
                        <td>{i18n('annotation.term.assignedterm.termLabel')}</td>
                        <td><OutgoingLink
                            label={term!.label}
                            iri={term!.iri}/></td>
                    </tr>
                    {termCommentRow}
                </table>;
                break;
            case TermState.SUGGESTED:
                outputComponent = <span className={'an-warning'}>
                    {i18n('annotation.form.suggestedterm.message')}
                    </span>
                break;
            case TermState.INVALID:
                outputComponent = <span className={'an-error'}>
                    {i18n('annotation.form.invalidterm.message').replace('%', this.props.resource!)}
                    </span>
                break;
        }
        return outputComponent;
    };

    private getEditableComponent = () => <div>
        <GlossaryTermSelect/>
    </div>;

    private getComponent = () => {
        if (this.state.isEditable) {
            return this.getEditableComponent();
        } else {
            return this.getReadOnlyComponent();
        }
    }

    private getTermState = () => {
        if (!this.props.resource) {
            return TermState.SUGGESTED;
        }
        if (this.findTermByIri(this.props.resource)) {
            return TermState.ASSIGNED
        }
        return TermState.INVALID;
    }


    public render() {
        const id = 'id' + this.props.about.substring(2);
        const termClassName = this.getTermState();
        const actions = [];
        if (!this.state.isEditable) {
            actions.push(<Button key='glossary.edit'
                                 color='secondary'
                                 title={"edit"}
                                 size='sm'
                                 onClick={this.toggleEdit}>{"✎"}</Button>);
        }
        if (this.state.isEditable) {
            actions.push(<Button key='glossary.save'
                                 color='secondary'
                                 title={"save"}
                                 size='sm'
                                 onClick={this.toggleEdit}>{"✓"}</Button>);
        }
        actions.push(<Button key='glossary.close'
                             color='secondary'
                             title={"close"}
                             size='sm'
                             onClick={this.onClick}>{"x"}</Button>);
        return <span id={id}
                     onClick={this.onClick}
                     about={this.props.about}
                     property={this.props.property}
                     resource={this.props.resource}
                     typeof={this.props.typeof}
                     className={termClassName}
        >
        {this.props.text}
            <SimplePopupWithActions isOpen={this.state.popoverOpen} isEditable={this.state.popoverOpen}
                                    target={id} toggle={this.toggleOpen}
                                    component={this.getComponent()} actions={actions} title={this.props.text}/>

        </span>;
    }

    private findTermByIri(iri: string): VocabularyTerm | null {
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
}, (dispatch: ThunkDispatch<object, undefined, Action>) => {
    return {
        selectVocabularyTerm: (selectedTerm: VocabularyTerm | null) => dispatch(selectVocabularyTerm(selectedTerm)),
    };
})(injectIntl(withI18n(Annotation)));