import * as React from "react";
import {ResourceSummary, ResourceSummaryProps} from "./ResourceSummary";
import Document from "../../model/Document";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {ThunkDispatch} from "../../util/Types";
import VocabularyUtils, {IRI} from "../../util/VocabularyUtils";
import {loadResource, removeResource, updateResourceTerms} from "../../action/AsyncActions";
import {default as Resource} from "../../model/Resource";
import {injectIntl} from "react-intl";
import withI18n from "../hoc/withI18n";
import {ButtonToolbar, Col, Label, Row} from "reactstrap";
import PanelWithActions from "../misc/PanelWithActions";
import RemoveAssetDialog from "../asset/RemoveAssetDialog";
import ResourceMetadata from "./ResourceMetadata";
import ResourceTermAssignments from "./ResourceTermAssignments";
import {Routing} from "../../util/Routing";
import Routes from "../../util/Routes";
import AssetIriLink from "../misc/AssteIriLink";
import Utils from "../../util/Utils";

interface DocumentSummaryProps extends ResourceSummaryProps {
    resource: Document;
}

export class DocumentSummary extends ResourceSummary<DocumentSummaryProps> {
    constructor(props: DocumentSummaryProps) {
        super(props);
    }

    protected canRemove(): false | boolean {
        return !this.props.resource.vocabulary && Utils.sanitizeArray(this.props.resource.files).length === 0;
    }

    public render() {
        const actions = [<ButtonToolbar key="resource.summary.actions">{this.getActionButtons()}</ButtonToolbar>];

        return <PanelWithActions id="resource-detail"
                                 title={this.props.resource.label}
                                 actions={actions}>
            <RemoveAssetDialog show={this.state.showRemoveDialog} asset={this.props.resource}
                               onCancel={this.onRemoveCancel} onSubmit={this.onRemove}/>
            {this.state.edit ? this.renderMetadataEdit() : this.renderMetadata()}
        </PanelWithActions>;
    }

    protected renderMetadata() {
        return <div className="metadata-panel">
            <ResourceMetadata resource={this.props.resource}/>
            {this.renderVocabulary()}
            <ResourceTermAssignments resource={this.props.resource}/>
        </div>;
    }

    private renderVocabulary() {
        if (this.props.resource.vocabulary) {
            const i18n = this.props.i18n;
            const iri = VocabularyUtils.create(this.props.resource.vocabulary.iri!);
            const path = Routing.getTransitionPath(Routes.vocabularySummary,
                {
                    params: new Map([["name", iri.fragment]]),
                    query: new Map([["namespace", iri.namespace!]])
                });
            return <Row>
                <Col md={2}>
                    <Label className="attribute-label">{i18n("resource.metadata.document.vocabulary")}</Label>
                </Col>
                <Col md={10}>
                    <AssetIriLink assetIri={iri.toString()} path={path} tooltip={i18n("asset.link.tooltip")}/>
                </Col>
            </Row>;
        } else {
            return null;
        }
    }
}

export default connect((state: TermItState) => ({intl: state.intl}), (dispatch: ThunkDispatch) => {
    return {
        loadResource: (iri: IRI) => dispatch(loadResource(iri)),
        saveResource: (resource: Resource) => dispatch(updateResourceTerms(resource)),
        removeResource: (resource: Resource) => dispatch(removeResource(resource))
    };
})(injectIntl(withI18n(DocumentSummary)));