import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {RouteComponentProps} from "react-router";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import Vocabulary, {EMPTY_VOCABULARY} from "../../model/Vocabulary";
import {exportGlossary, loadVocabulary, updateVocabulary} from "../../action/AsyncActions";
import VocabularyMetadata from "./VocabularyMetadata";
import {
    Button,
    ButtonToolbar,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    UncontrolledButtonDropdown
} from "reactstrap";
import PanelWithActions from "../misc/PanelWithActions";
import VocabularyUtils, {IRI} from "../../util/VocabularyUtils";
import {GoCloudDownload, GoPencil, GoThreeBars} from "react-icons/go";
import {ThunkDispatch} from "../../util/Types";
import EditableComponent from "../misc/EditableComponent";
import Routing from "../../util/Routing";
import Routes from "../../util/Routes";
import VocabularyEdit from "./VocabularyEdit";
import Utils from "../../util/Utils";
import "./VocabularySummary.scss";
import ExportType from "../../util/ExportType";
import OutgoingLink from "../misc/OutgoingLink";

interface VocabularySummaryProps extends HasI18n, RouteComponentProps<any> {
    vocabulary: Vocabulary;
    loadVocabulary: (iri: IRI) => void;
    updateVocabulary: (vocabulary: Vocabulary) => Promise<any>;
    exportToCsv: (iri: IRI) => void;
    exportToExcel: (iri: IRI) => void;
    exportToTurtle: (iri: IRI) => void;
}

export class VocabularySummary extends EditableComponent<VocabularySummaryProps> {

    constructor(props: VocabularySummaryProps) {
        super(props);
        this.state = {
            edit: false
        };
    }

    public componentDidMount(): void {
        this.loadVocabulary();
    }

    public componentDidUpdate(): void {
        if (this.props.vocabulary !== EMPTY_VOCABULARY) {
            this.loadVocabulary();
        }
    }

    private loadVocabulary(): void {
        const normalizedName = this.props.match.params.name;
        const namespace = Utils.extractQueryParam(this.props.location.search, "namespace");
        const iri = VocabularyUtils.create(this.props.vocabulary.iri);
        if (iri.fragment !== normalizedName || (namespace && iri.namespace !== namespace)) {
            this.props.loadVocabulary({fragment: normalizedName, namespace});
        }
    }

    private openTerms = () => {
        const iri = VocabularyUtils.create(this.props.vocabulary.iri);
        Routing.transitionTo(Routes.vocabularyDetail, {
            params: new Map([["name", iri.fragment]]),
            query: new Map([["namespace", iri.namespace!]])
        });
    };

    public onSave = (vocabulary: Vocabulary) => {
        this.props.updateVocabulary(vocabulary).then(() => {
            this.onCloseEdit();
            this.props.loadVocabulary(VocabularyUtils.create(vocabulary.iri));
        });
    };

    private onExportToCsv = () => {
        this.props.exportToCsv(VocabularyUtils.create(this.props.vocabulary.iri));
    };

    private onExportToExcel = () => {
        this.props.exportToExcel(VocabularyUtils.create(this.props.vocabulary.iri));
    };

    private onExportToTurtle = () => {
        this.props.exportToTurtle(VocabularyUtils.create(this.props.vocabulary.iri));
    };

    public onFileAdded = () => {
        this.props.loadVocabulary(VocabularyUtils.create(this.props.vocabulary.iri));
    };

    public render() {
        const buttons = [<Button id="vocabulary-summary-detail" key="vocabulary.summary.detail" color="primary"
                                 size="sm"
                                 title={this.props.i18n("vocabulary.summary.gotodetail.label")}
                                 onClick={this.openTerms}>
            <GoThreeBars/> {this.props.i18n("vocabulary.summary.gotodetail.text")}
        </Button>];
        if (!this.state.edit) {
            buttons.push(<Button id="vocabulary-summary-edit" key="vocabulary.summary.edit" size="sm" color="primary"
                                 title={this.props.i18n("edit")}
                                 onClick={this.onEdit}><GoPencil/> {this.props.i18n("edit")}</Button>);
        }
        buttons.push(this.renderExportDropdown());
        const actions = [<ButtonToolbar key="vocabulary.summary.actions">{buttons}</ButtonToolbar>];
        const component = this.state.edit ?
            <VocabularyEdit save={this.onSave} cancel={this.onCloseEdit} vocabulary={this.props.vocabulary}/> :
            <VocabularyMetadata vocabulary={this.props.vocabulary} onFileAdded={this.onFileAdded}/>;
        return <PanelWithActions id="vocabulary-summary"
                                 title={<OutgoingLink
                                     label={this.props.vocabulary.label}
                                     iri={this.props.vocabulary.iri as string}
                                 />}
                                 actions={actions}>
            {component}
        </PanelWithActions>;
    }

    private renderExportDropdown() {
        const i18n = this.props.i18n;
        return <UncontrolledButtonDropdown id="vocabulary-summary-export" key="vocabulary.summary.export"
                                           size="sm" title={i18n("vocabulary.summary.export.title")}>
            <DropdownToggle caret={true}
                            color="primary"><GoCloudDownload/>&nbsp;{i18n("vocabulary.summary.export.text")}
            </DropdownToggle>
            <DropdownMenu className="glossary-export-menu">
                <DropdownItem name="vocabulary-export-csv" className="btn-sm" onClick={this.onExportToCsv}
                              title={i18n("vocabulary.summary.export.csv.title")}>{i18n("vocabulary.summary.export.csv")}</DropdownItem>
                <DropdownItem name="vocabulary-export-excel" className="btn-sm" onClick={this.onExportToExcel}
                              title={i18n("vocabulary.summary.export.excel.title")}>{i18n("vocabulary.summary.export.excel")}</DropdownItem>
                <DropdownItem name="vocabulary-export-ttl" className="btn-sm" onClick={this.onExportToTurtle}
                              title={i18n("vocabulary.summary.export.ttl.title")}>{i18n("vocabulary.summary.export.ttl")}</DropdownItem>
            </DropdownMenu>
        </UncontrolledButtonDropdown>;
    }
}

export default connect((state: TermItState) => {
    return {
        vocabulary: state.vocabulary
    };
}, (dispatch: ThunkDispatch) => {
    return {
        loadVocabulary: (iri: IRI) => dispatch(loadVocabulary(iri)),
        updateVocabulary: (vocabulary: Vocabulary) => dispatch(updateVocabulary(vocabulary)),
        exportToCsv: (iri: IRI) => dispatch(exportGlossary(iri, ExportType.CSV)),
        exportToExcel: (iri: IRI) => dispatch(exportGlossary(iri, ExportType.Excel)),
        exportToTurtle: (iri: IRI) => dispatch(exportGlossary(iri, ExportType.Turtle))
    };
})(injectIntl(withI18n(VocabularySummary)));