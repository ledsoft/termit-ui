import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../../hoc/withI18n";
import Asset from "../../../model/Asset";
import {Card, CardBody, CardHeader, Col, Label, Row, Table} from "reactstrap";
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
import TimeAgo from "javascript-time-ago";

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
        return <Table className="widget">
            {this.renderAssets()}
        </Table>;
    }

    private renderAssets() {
        const formatter = new TimeAgo(this.props.locale);
        return this.state.assets.map(asset => <tr key={asset.iri}>
            <td className="col-xs-12">
                <Row>
                    <Col md={3} lg={2}>
                        {LastEditedAssets.renderAssetBadge(asset)}
                    </Col>
                    <Col md={9} lg={10}>
                        {AssetLinkFactory.createAssetLink(asset)}
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <Label className="italics"
                               title={new Date(asset.lastEdited!).toLocaleString(this.props.locale)}>
                            {this.props.formatMessage("dashboard.widget.lastEdited.lastEditMessage", {
                                user: asset.lastEditedBy!.fullName,
                                when: formatter.format(asset.lastEdited!),
                                operation: asset.lastEditor ? "edit" : "create"
                            })}
                        </Label>
                    </Col>
                </Row>
            </td>
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

