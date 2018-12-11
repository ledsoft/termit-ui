import * as React from 'react';
import Vocabulary2 from "../../util/VocabularyUtils";
import {Link} from "react-router-dom";
import Asset from "../../model/Asset";
import OutgoingLink from "./OutgoingLink";

interface AssetLinkProps<T extends Asset> {
    asset: T,
    assetContextPath: string
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

        const {fragment, namespace} = Vocabulary2.create(props.asset.iri);
        return <span
            onMouseOut={setInvisible}
            onMouseOver={setVisible}>
            <OutgoingLink label=
                              {<Link
                                  to={props.assetContextPath + "/" + fragment + (namespace ? "?namespace=" + namespace : "")}>
                                  {props.asset.label}
                              </Link>}
                          iri={props.asset.iri}
                          showLink={this.state.showLink}/>
        </span>
    }
}
