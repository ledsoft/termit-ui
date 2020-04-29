import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../../hoc/withI18n";
import {Card, CardBody, CardHeader, Col, Label, Row, Table} from "reactstrap";
import TermBadge from "../../badge/TermBadge";
import VocabularyBadge from "../../badge/VocabularyBadge";
import ResourceBadge from "../../badge/ResourceBadge";
import {connect} from "react-redux";
import {ThunkDispatch} from "../../../util/Types";
import {loadLastEditedAssets} from "../../../action/AsyncActions";
import withInjectableLoading, {InjectsLoading} from "../../hoc/withInjectableLoading";
import TermItState from "../../../model/TermItState";
import TimeAgo from "javascript-time-ago";
import RecentlyModifiedAsset from "../../../model/RecentlyModifiedAsset";
import Utils from "../../../util/Utils";
import VocabularyUtils from "../../../util/VocabularyUtils";
import AssetLinkFactory from "../../factory/AssetLinkFactory";
import AssetFactory from "../../../util/AssetFactory";

interface LastEditedAssetsProps extends HasI18n, InjectsLoading {
    loadAssets: () => Promise<RecentlyModifiedAsset[]>;
    locale: string;
}

interface LastEditedAssetsState {
    assets: RecentlyModifiedAsset[];
}

export class LastEditedAssets extends React.Component<LastEditedAssetsProps, LastEditedAssetsState> {
    constructor(props: LastEditedAssetsProps) {
        super(props);
        this.state = {assets: []};
    }

    public componentDidMount(): void {
        this.props.loadingOn();
        this.props.loadAssets().then((result: RecentlyModifiedAsset[]) => {
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
        return <Table className="widget">
            <tbody>
            {this.renderAssets()}
            </tbody>
        </Table>;
    }

    private renderAssets() {
        // TODO Determine operation type
        const formatter = new TimeAgo(this.props.locale);
        return this.state.assets.map(asset => <tr key={asset.iri}>
            <td className="col-xs-12">
                <Row>
                    <Col md={3} lg={2}>
                        {LastEditedAssets.renderAssetBadge(asset)}
                    </Col>
                    <Col md={9} lg={10}>
                        {AssetLinkFactory.createAssetLink(AssetFactory.createAsset(asset))}
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <Label className="italics last-edited-message"
                               title={new Date(asset.modified).toLocaleString(this.props.locale)}>
                            {this.props.formatMessage("dashboard.widget.lastEdited.lastEditMessage", {
                                user: asset.editor.fullName,
                                when: formatter.format(asset.modified),
                                operation: asset.types.indexOf(VocabularyUtils.PERSIST_EVENT) !== -1 ? "create" : "edit"
                            })}
                        </Label>
                    </Col>
                </Row>
            </td>
        </tr>);
    }

    private static renderAssetBadge(asset: RecentlyModifiedAsset) {
        const type = Utils.getPrimaryAssetType(asset);
        if (type === VocabularyUtils.TERM) {
            return <TermBadge/>;
        } else if (type === VocabularyUtils.VOCABULARY) {
            return <VocabularyBadge/>;
        } else {
            return <ResourceBadge resource={asset}/>;
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

