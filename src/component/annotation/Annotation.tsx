import * as React from 'react';
import GlossaryTermSelect from "./GlossaryTermSelect";
import {connect} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {Action} from "redux";
import VocabularyTerm from "../../model/VocabularyTerm";
import {selectVocabularyTerm} from "../../action/SyncActions";
import {injectIntl} from "react-intl";
import withI18n from "../hoc/withI18n";
import {Button} from "reactstrap";
import SimplePopupWithActions from "./SimplePopupWithActions";
import "./Annotation.scss";
import {getVocabularyTermByID} from "../../action/ComplexActions";
import TermItState from "../../model/TermItState";
import Vocabulary from "../../model/Vocabulary";
import OutgoingLink from "../misc/OutgoingLink";

interface AnnotationProps {
    about: string
    property: string
    resource?: string
    typeof: string
    text: string
    selectedTerm: VocabularyTerm | null
    defaultTerms: VocabularyTerm[];
    vocabulary: Vocabulary
    selectVocabularyTerm: (selectedTerms: VocabularyTerm | null) => Promise<object>;
    getVocabularyTermByID: (termId: string, vocabularyName: string) => Promise<object>;
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

    private toggle = () => {
        this.setState({
            popoverOpen: !this.state.popoverOpen
        });
    };

    private onClick = () => {
        this.toggle();
    };

    private getReadOnlyComponent = () => {
        const term = (this.props.resource) ? this.findTermByIri(this.props.resource) : null;
        let outputComponent = <div/>;
        switch (this.getTermState()) {
            case TermState.ASSIGNED:
                const termCommentRow = (term!.comment) ? <tr>
                    <td>{'Term info : '}</td>
                    <td>{term!.comment}</td>
                </tr> : "";

                outputComponent = <table>
                    <tr>
                        <td>{'Assigned term : '}</td>
                        <td><OutgoingLink
                            label={term!.label}
                            iri={term!.iri}/></td>
                    </tr>
                    {termCommentRow}
                </table>;
                break;
            case TermState.SUGGESTED:
                outputComponent = <span className={'an-warning'}>
                    {'Phrase is not assigned to a vocabulary term.'}
                    </span>
                break;
            case TermState.INVALID:
                outputComponent = <span className={'an-error'}>
                    {'Term "' + this.props.resource + '" not found in vocabulary.'}
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
        if (! this.props.resource) {
            return TermState.SUGGESTED;
        }
        if (this.findTermByIri(this.props.resource)){
            return TermState.ASSIGNED
        }
        return TermState.INVALID;
    }


    public render() {
        const id = 'id' + this.props.about.substring(2);
        const termClassName = this.getTermState();
        const actions = [];
        actions.push(<Button key='glossary.edit'
                             color='secondary'
                             title={"edit"}
                             size='sm'
                             onClick={this.onClick}>{"✎"}</Button>);
        actions.push(<Button key='glossary.save'
                             color='secondary'
                             title={"save"}
                             size='sm'
                             onClick={this.onClick}>{"✓"}</Button>);
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
                                    target={id} toggle={this.toggle}
                                    component={this.getComponent()} actions={actions} title={this.props.text}/>

        </span>
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
        getVocabularyTermByID: (termId: string, vocabularyName: string) => dispatch(getVocabularyTermByID(termId, vocabularyName))
    };
})(injectIntl(withI18n(Annotation)));