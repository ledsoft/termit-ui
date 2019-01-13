import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../../hoc/withI18n";
import Asset from "../../../model/Asset";
import {Card, CardBody, CardHeader, Table} from "reactstrap";
import Term from "../../../model/Term";
import TermBadge from "../../badge/TermBadge";
import Vocabulary from "../../../model/Vocabulary";
import VocabularyBadge from "../../badge/VocabularyBadge";
import ResourceBadge from "../../badge/ResourceBadge";
import Resource from "../../../model/Resource";

interface LastEditedAssetsProps extends HasI18n {
    loadAssets: () => Promise<Asset[]>;
}

interface LastEditedAssetsState {
    assets: Asset[];
}

export class LastEditedAssets extends React.Component<LastEditedAssetsProps, LastEditedAssetsState> {
    constructor(props: LastEditedAssetsProps) {
        super(props);
        this.state = {assets: []};
    }

    public render() {
        const i18n = this.props.i18n;
        return <Card>
            <CardHeader tag="h4" color="primary">
                {i18n("dashboard.widget.lastEdited.title")}
            </CardHeader>
            <CardBody>
                <Table responsive={true}>
                    <tbody>
                    {this.renderAssets()}
                    </tbody>
                </Table>
            </CardBody>
        </Card>;
    }

    private renderAssets() {
        return this.state.assets.map(asset => <tr key={asset.iri}>
            <td className="col-xs-1">{LastEditedAssets.renderAssetBadge(asset)}</td>
            <td className="col-xs-7">{asset.label}</td>
            <td className="col-xs-4">{new Date(asset.lastModified ? asset.lastModified : asset.created!).toLocaleString()}</td>
        </tr>);
    }

    private static renderAssetBadge(asset: Asset) {
        if (asset instanceof Term) {
            return <TermBadge/>;
        } else if (asset instanceof Vocabulary) {
            return <VocabularyBadge/>;
        } else {
            return <ResourceBadge resource={asset as Resource}/>;
        }
    }
}

export default injectIntl(withI18n(LastEditedAssets));

