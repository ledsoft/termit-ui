import * as React from "react";
import {RouteComponentProps} from "react-router";
import {injectIntl} from "react-intl";
import VocabularyUtils, {IRI} from "../../util/VocabularyUtils";
import Utils from "../../util/Utils";
import FileDetail from "../file/FileDetail";
import {connect} from "react-redux";
import {ThunkDispatch} from "../../util/Types";
import {loadLatestTextAnalysisRecord, loadResource} from "../../action/AsyncActions";
import Resource, {EMPTY_RESOURCE} from "../../model/Resource";
import File from "../../model/File";
import TermItState from "../../model/TermItState";
import {TextAnalysisRecord} from "../../model/TextAnalysisRecord";
import {Label} from "reactstrap";
import withI18n, {HasI18n} from "../hoc/withI18n";

interface StoreStateProps {
    resource: Resource;
}

interface DispatchProps {
    loadResource: (resourceIri: IRI) => void;
    loadLatestTextAnalysisRecord: (resourceIri: IRI) => Promise<TextAnalysisRecord | null>;
}

type ResourceFileDetailProps = StoreStateProps & DispatchProps & RouteComponentProps<any> & HasI18n;

interface ResourceFileDetailState {
    vocabularyIri?: IRI | null;
}

export class ResourceFileDetail extends React.Component<ResourceFileDetailProps, ResourceFileDetailState> {
    constructor(props: ResourceFileDetailProps) {
        super(props);
        this.state = {
            vocabularyIri: undefined
        };
    }

    public componentDidMount() {
        this.props.loadResource(this.getFileIri());
    }

    public componentDidUpdate(prevProps: Readonly<ResourceFileDetailProps>): void {
        if (this.props.resource !== EMPTY_RESOURCE && prevProps.resource === EMPTY_RESOURCE || !prevProps.resource) {
            const vocabularyIri = this.getVocabularyIri();
            if (vocabularyIri) {
                this.setState({vocabularyIri});
            } else {
                this.props.loadLatestTextAnalysisRecord(this.getFileIri()).then((res: TextAnalysisRecord | null) => {
                    if (res) {
                        this.setState({vocabularyIri: VocabularyUtils.create(res.vocabularies[0].iri!)});
                    } else {
                        this.setState({vocabularyIri: null});
                    }
                });
            }
        }
    }

    private getFileIri = (): IRI => {
        const normalizedFileName = this.props.match.params.name;
        const fileNamespace = Utils.extractQueryParam(this.props.location.search, "namespace");
        return VocabularyUtils.create(fileNamespace + normalizedFileName);
    };

    private getVocabularyIri(): IRI | null {
        if (Utils.getPrimaryAssetType(this.props.resource) !== VocabularyUtils.FILE) {
            return null;
        }
        const file = this.props.resource as File;
        return file.owner && file.owner.vocabulary ? VocabularyUtils.create(file.owner.vocabulary.iri!) : null;
    }

    public render() {
        if (this.props.resource) {
            if (this.state.vocabularyIri === undefined) {
                return null;
            }
            if (this.state.vocabularyIri === null) {
                // This is temporary, annotator should support vocabulary selection
                return <Label id="file-detail-no-vocabulary"
                              className="italics">{this.props.i18n("file.annotate.unknown-vocabulary")}</Label>
            }
            return <FileDetail iri={VocabularyUtils.create(this.props.resource.iri)}
                               vocabularyIri={this.state.vocabularyIri}/>
        }
        return null;
    }
}

export default connect((state: TermItState) => {
    return {
        resource: state.resource
    }
}, (dispatch: ThunkDispatch) => {
    return {
        loadResource: (resourceIri: IRI) => dispatch(loadResource(resourceIri)),
        loadLatestTextAnalysisRecord: (resourceIri: IRI) => dispatch(loadLatestTextAnalysisRecord(resourceIri))
    };
})(injectIntl(withI18n(ResourceFileDetail)));