import * as React from "react";
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";
import Vocabulary from "../../model/Vocabulary";
import TermItState from "../../model/TermItState";
import {connect} from "react-redux";
import {ThunkDispatch} from "../../util/Types";
import {loadVocabularies} from "../../action/AsyncActions";
import {HasI18n} from "../hoc/withI18n";
import {injectIntl} from "react-intl";
import withI18n from "../hoc/withI18n";

interface PropsExt {
    vocabulary: Vocabulary | null;
}

interface DispatchExt {
    onVocabularySet: (voc: Vocabulary) => void;
}

interface PropsCon {
    vocabularies: { [key: string]: Vocabulary },
}

interface DispatchCon {
    loadVocabularies: () => void
}

interface Props extends
    PropsExt, DispatchExt,
    PropsCon, HasI18n, DispatchCon {}

interface State {
    dropDownOpen: boolean;
}

export class VocabularySelect extends React.Component<Props, State> {

   constructor(props : Props) {
        super(props);
        this.state = {
            dropDownOpen: false,
        };
    }

    public componentDidMount() {
        this.props.loadVocabularies();
    }

    private toggle() {
        this.setState(prevState => ({
            dropDownOpen: !prevState.dropDownOpen
        }));
    }

    private changeValue(vIri : string) {
        this.props.onVocabularySet(this.props.vocabularies[vIri]);
    }

    public render() {
        const that = this;
        const items = Object.keys(this.props.vocabularies || []).map(vIri => {
             const onClick = () => that.changeValue(vIri);
             return  <DropdownItem key={vIri} onClick={onClick}>
                 {this.props.vocabularies[vIri].label}
                </DropdownItem>
            }
        );

        const toggle = this.toggle.bind(this);
        return <Dropdown group={true}
                         isOpen={this.state.dropDownOpen}
                         size="sm"
                         toggle={toggle}>
            <DropdownToggle caret={true}>
                {this.props.vocabulary ? this.props.vocabulary.label : that.props.i18n("vocabulary.select-vocabulary")}
            </DropdownToggle>
            <DropdownMenu>
                {items}
            </DropdownMenu>
        </Dropdown>;
    }
}

export default connect<PropsCon,DispatchCon>((state: TermItState) => {
    return {
        vocabularies: state.vocabularies
    };
}, (dispatch: ThunkDispatch) => {
    return {
        loadVocabularies: () => dispatch(loadVocabularies())
    };
})(injectIntl(withI18n(VocabularySelect)));