import * as React from "react";
import {Link} from "react-router-dom";
import Asset from "../../model/Asset";
import OutgoingLink from "./OutgoingLink";

interface AssetLinkProps<T extends Asset> {
    asset: T;
    path: string;
    tooltip?: string;
}

interface AssetLinkState {
    showLink: boolean;
}

export default class AssetLink<T extends Asset> extends React.Component<AssetLinkProps<T>, AssetLinkState> {

    constructor(props: AssetLinkProps<T>) {
        super(props);
        this.state = {showLink: false};
    }

    private setVisible() {
        this.setState({showLink: true});
    }

    private setInvisible() {
        this.setState({showLink: false});
    }

    public render() {
        const props = this.props;
        const setInvisible = this.setInvisible.bind(this);
        const setVisible = this.setVisible.bind(this);

        // "asset-link" is a marker class, it contains no styling
        return <span
            onMouseOut={setInvisible}
            onMouseOver={setVisible}>
            <OutgoingLink label={<Link
                title={this.props.tooltip ? this.props.tooltip : undefined}
                to={props.path}>
                {props.asset.label}</Link>}
                          iri={props.asset.iri}
                          showLink={this.state.showLink}
                          className="asset-link"/>
        </span>
    }
}
