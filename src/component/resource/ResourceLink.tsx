import * as React from 'react';
import AssetLink from "../misc/AssetLink";
import Resource from "../../model/Resource";

interface ResourceLinkProps {
    resource: Resource
}

export default (props : ResourceLinkProps) =>
    <AssetLink asset={props.resource} assetContextPath={"/resources"}/>