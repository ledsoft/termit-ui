import * as React from 'react';
import Vocabulary from "../../model/Vocabulary";
import AssetLink from "../misc/AssetLink";

interface VocabularyLinkProps {
    vocabulary: Vocabulary
}

export default (props : VocabularyLinkProps) =>
    <AssetLink asset={props.vocabulary} assetContextPath={"/vocabulary"}/>