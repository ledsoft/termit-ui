import * as React from "react";
import {RouteComponentProps} from "react-router";
import VocabularyUtils, {IRI} from "../../util/VocabularyUtils";
import Utils from "../../util/Utils";
import FileDetail from "../file/FileDetail";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {ThunkDispatch} from "../../util/Types";
import {loadVocabularies} from "../../action/AsyncActions";
import {injectIntl} from "react-intl";
import withI18n from "../hoc/withI18n";
import Vocabulary from "../../model/Vocabulary";

function isEmpty(obj: object): boolean {
    return Object.getOwnPropertyNames(obj).length === 0;
}

interface ResourceFileDetailProps extends RouteComponentProps<any> {
    vocabularies: { [key: string]: Vocabulary }
    loadVocabularies: () => void
}

interface ResourceFileDetailState {
    vocabularyIri: IRI | null
}

export class ResourceFileDetail extends React.Component<ResourceFileDetailProps, ResourceFileDetailState> {
    constructor(props: any) {
        super(props);
        this.state = {
            vocabularyIri: null
        }
    }

    public componentDidMount() {
        if (isEmpty(this.props.vocabularies)) {
            this.props.loadVocabularies();
        }
    }

    public componentDidUpdate() {
        if (!isEmpty(this.props.vocabularies)) {
            const iri = this.getVocabularyIri();
            if (ResourceFileDetail.isDifferent(iri,this.state.vocabularyIri)) {
                this.setState({
                    vocabularyIri: iri
                });
            }
        }
    }

    public render() {
        if (this.state.vocabularyIri) {
            const fileIri = this.getFileIri();
            return <FileDetail iri={fileIri} vocabularyIri={this.state.vocabularyIri}/>
        }
        return null;
    }


    private getFileIri = (): IRI => {
        const normalizedFileName = this.props.match.params.name;
        const fileNamespace = Utils.extractQueryParam(this.props.location.search, "namespace");
        return VocabularyUtils.create(fileNamespace + normalizedFileName);
    };

    // TODO this is nasty hack => replace it through retrieval of /resources/$fileId
    private getVocabularyIri = (): IRI | null => {
        const HAS_FILE = "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/ma-soubor";
        const iri = this.getFileIri().namespace + this.getFileIri().fragment;


        const entries = Object.keys(this.props.vocabularies)
            .map(k => [k, this.props.vocabularies[k]])
            .filter((e: any) => e[1].document)
            .map((e: any) => [e[0], e[1].document])
            .filter((e: any) => {
                const hasFile = e[1][HAS_FILE];
                if (!hasFile) {
                    return false;
                }
                const files = Array.isArray(hasFile) ? hasFile : [hasFile];
                return files.filter(f => f.iri === iri).length !== 0
            });
        if (entries.length === 0) {
            return null;
        }
        return VocabularyUtils.create(entries[0][0]);
    }

    private static isDifferent(iri1: IRI | null, iri2: IRI|null) {
        return ((!iri1) && iri2)
            || (iri1 && (!iri2))
            || (iri1!.fragment !== iri2!.fragment)
            || (iri1!.namespace !== iri2!.namespace);
    }


}

export default connect((state: TermItState) => {
    return {
        vocabularies: state.vocabularies,
    };
}, (dispatch: ThunkDispatch) => {
    return {
        loadVocabularies: () => dispatch(loadVocabularies()),
    };
})(injectIntl(withI18n(ResourceFileDetail)));