import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../../hoc/withI18n";
import Asset from "../../../model/Asset";
import {Card, CardBody, CardHeader, Col, Row, Table} from "reactstrap";
import Term from "../../../model/Term";
import TermBadge from "../../badge/TermBadge";
import Vocabulary from "../../../model/Vocabulary";
import VocabularyBadge from "../../badge/VocabularyBadge";
import ResourceBadge from "../../badge/ResourceBadge";
import Resource from "../../../model/Resource";
import {connect} from "react-redux";
import {ThunkDispatch} from "../../../util/Types";
import {loadLastEditedAssets} from "../../../action/AsyncActions";
import withInjectableLoading, {InjectsLoading} from "../../hoc/withInjectableLoading";
import AssetLinkFactory from "../../factory/AssetLinkFactory";
import TermItState from "../../../model/TermItState";

interface LastEditedAssetsProps extends HasI18n, InjectsLoading {
    loadAssets: () => Promise<Asset[]>;
    locale: string;
}

interface LastEditedAssetsState {
    assets: Asset[];
}

export class LastEditedAssets extends React.Component<LastEditedAssetsProps, LastEditedAssetsState> {
    constructor(props: LastEditedAssetsProps) {
        super(props);
        this.state = {assets: []};
    }

    public componentDidMount(): void {
        this.props.loadingOn();
        this.props.loadAssets().then((result: Asset[]) => {
            this.setState({assets: result});
            this.props.loadingOff();
        });
    }

    public render() {
        const i18n = this.props.i18n;
        return <Card>
            <CardHeader tag="h4" color="primary">
                {i18n("dashboard.widget.lastEdited.title")}
            </CardHeader>
            <CardBody>
                {this.props.renderMask()}
                {this.state.assets.length > 0 ? this.renderNonEmptyContent() : this.renderEmptyInfo()}
            </CardBody>
        </Card>;
    }

    private renderEmptyInfo() {
        return <div className="italics">{this.props.i18n("dashboard.widget.lastEdited.empty")}</div>;
    }

    private renderNonEmptyContent() {
        const i18n = this.props.i18n;
        return <Table responsive={true}>
            <thead>
            <tr>
                <th className="align-content-center col-xs-8">{i18n("type.asset")}</th>
                <th className="col-xs-4">{i18n("dashboard.widget.lastEdited.lastEditDate")}</th>
            </tr>
            </thead>
            <tbody>
            {this.renderAssets()}
            </tbody>
        </Table>;
    }

    private renderAssets() {
        return this.state.assets.map(asset => <tr key={asset.iri}>
            <td className="col-xs-8">
                <Row>
                    <Col>
                        {LastEditedAssets.renderAssetBadge(asset)}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {AssetLinkFactory.createAssetLink(asset)}
                    </Col>
                </Row>
            </td>
            <td className="col-xs-4">{new Date(asset.lastEdited!).toLocaleString(this.props.locale)}</td>
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

export default connect((state: TermItState) => {
    return {
        locale: state.intl.locale
    };
}, (dispatch: ThunkDispatch) => {
    return {
        loadAssets: () => dispatch(loadLastEditedAssets())
    };
})(injectIntl(withI18n(withInjectableLoading(LastEditedAssets))));

