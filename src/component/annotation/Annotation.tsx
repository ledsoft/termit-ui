import * as React from 'react';
import GlossaryTermSelect from "./GlossaryTermSelect";
import {connect} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {Action} from "redux";
import VocabularyTerm from "../../model/VocabularyTerm";
import {selectVocabularyTerm} from "../../action/SyncActions";
import {injectIntl} from "react-intl";
import withI18n from "../hoc/withI18n";
import PopupWithActions from "./PopupWithActions";
import {Button} from "reactstrap";


interface AnnotationProps {
    about: string
    property: string
    resource: string
    typeof: string
    text: string
    selectVocabularyTerm: (selectedTerms: VocabularyTerm | null) => void;
}

interface AnnotationState {
    popoverOpen: boolean
}

class Annotation extends React.Component<AnnotationProps, AnnotationState> {

    constructor(props: any) {
        super(props);

        this.state = {
            popoverOpen: false
        };
    }

    private toggle = () => {
        this.setState({
            popoverOpen: !this.state.popoverOpen
        });
    };

    private onClick = () => {
        this.toggle();
    };

    public render() {
        const id = 'id'+this.props.about.substring(2);
        const assignedTermBackgroundColor = "rgb(188, 239, 184)";
        const notAssignedTermBackgroundColor = "rgb(239, 207, 184)";
        const backgroundColor = (this.props.resource) ? assignedTermBackgroundColor : notAssignedTermBackgroundColor;
        const component = <div>
                <GlossaryTermSelect/>
        </div>;
        const actions = [];
        actions.push(<Button key='glossary.close'
                             color='primary'
                             title={"edit"}
                             size='sm'
                             onClick={this.onClick}>{"✎"}</Button>);
        actions.push(<Button key='glossary.close'
                             color='primary'
                             title={"save"}
                             size='sm'
                             onClick={this.onClick}>{"✓"}</Button>);
        actions.push(<Button key='glossary.createTerm'
                             color='primary'
                             title={"close"}
                             size='sm'
                             onClick={this.onClick}>{"x"}</Button>);
        return <span id={id}
                     onClick={this.onClick}
                     about={this.props.about}
                     property={this.props.property}
                     resource={this.props.resource}
                     typeof={this.props.typeof}
                     style={{backgroundColor}}
        >
        {this.props.text}
        <PopupWithActions isOpen={this.state.popoverOpen} target={id} toggle={this.toggle} component={component} actions={actions} title={this.props.text} />

        </span>
    }
}


export default connect((dispatch: ThunkDispatch<object, undefined, Action>) => {
    return {
        selectVocabularyTerm: (selectedTerm: VocabularyTerm | null) => dispatch(selectVocabularyTerm(selectedTerm)),
    };
})(injectIntl(withI18n(Annotation)));