import * as React from "react";
import {RouteComponentProps} from "react-router";
import VocabularyUtils from "../../util/VocabularyUtils";
import Utils from "../../util/Utils";
import FileDetail from "../file/FileDetail";

export const VocabularyFileDetail: React.SFC<RouteComponentProps<any>> = (props: RouteComponentProps<any>) => {
    const normalizedVocabularyName = props.match.params.name;
    const vocabularyNamespace = Utils.extractQueryParam(props.location.search, "namespace");
    const vocabularyIri = VocabularyUtils.create(vocabularyNamespace + normalizedVocabularyName);

    const normalizedFileName = props.match.params.fileName;
    const parsedFileNamespace = Utils.extractQueryParam(props.location.search, "fileNamespace");
    const fileNamespace = parsedFileNamespace ? parsedFileNamespace : vocabularyNamespace;
    const fileIri = VocabularyUtils.create(fileNamespace + normalizedFileName);

    return <FileDetail iri={fileIri} vocabularyIri={vocabularyIri}/>
};