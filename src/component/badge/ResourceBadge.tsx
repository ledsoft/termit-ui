import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Badge} from "reactstrap";
import Resource from "../../model/Resource";
import Utils from "../../util/Utils";

interface ResourceBadgeProps extends HasI18n {
    resource?: Resource
}

const ResourceBadge: React.SFC<ResourceBadgeProps> = (props: ResourceBadgeProps) => {
    let typeLabel = props.resource ? Utils.getAssetTypeLabelId(props.resource) : "type.resource";
    if (!typeLabel) {
        typeLabel = "type.resource";
    }
    return <Badge color="warning">{props.i18n(typeLabel)}</Badge>;
};

export default injectIntl(withI18n(ResourceBadge));