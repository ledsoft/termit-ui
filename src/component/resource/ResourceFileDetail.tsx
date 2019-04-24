import * as React from "react";
import {RouteComponentProps} from "react-router";
import VocabularyUtils, {IRI} from "../../util/VocabularyUtils";
import Utils from "../../util/Utils";
import FileDetail from "../file/FileDetail";
import {connect} from "react-redux";
import {ThunkDispatch} from "../../util/Types";
import {loadResource} from "../../action/AsyncActions";
import Resource from "../../model/Resource";
import File from "../../model/File";
import TermItState from "../../model/TermItState";

interface StoreStateProps {
    resource: Resource;
}

interface DispatchProps {
    loadResource: (resourceIri: IRI) => void;
}

type ResourceFileDetailProps = StoreStateProps & DispatchProps & RouteComponentProps<any>;

export class ResourceFileDetail extends React.Component<ResourceFileDetailProps> {
    constructor(props: ResourceFileDetailProps) {
        super(props);
    }

    public componentDidMount() {
        this.props.loadResource(this.getFileIri());
    }

    private getFileIri = (): IRI => {
        const normalizedFileName = this.props.match.params.name;
        const fileNamespace = Utils.extractQueryParam(this.props.location.search, "namespace");
        return VocabularyUtils.create(fileNamespace + normalizedFileName);
    };

    public render() {
        if (this.props.resource) {
            const vocabularyIri = this.getVocabularyIri();
            if (vocabularyIri == null) {
                return null;    // Not supported, yet.
            }
            return <FileDetail iri={VocabularyUtils.create(this.props.resource.iri)} vocabularyIri={vocabularyIri}/>
        }
        return null;
    }

    private getVocabularyIri(): IRI | null {
        if (Utils.getPrimaryAssetType(this.props.resource) !== VocabularyUtils.FILE) {
            return null;
        }
        const file = this.props.resource as File;
        return file.owner && file.owner.vocabulary ? VocabularyUtils.create(file.owner.vocabulary.iri!) : null;
    }
}

export default connect((state: TermItState) => {
    return {
        resource: state.resource
    }
}, (dispatch: ThunkDispatch) => {
    return {
        loadResource: (resourceIri: IRI) => dispatch(loadResource(resourceIri)),
    };
})(ResourceFileDetail);