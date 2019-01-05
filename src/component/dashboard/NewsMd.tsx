import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Card, CardBody, CardHeader} from "reactstrap";
import * as ReactMarkdown from "react-markdown";
import Constants from "../../util/Constants";
import Ajax from "../../util/Ajax";
import SpinnerPlaceholder from "../SpinnerPlaceholder";

interface NewsMdProps extends HasI18n {
}

interface NewsMdState {
    newsMd: string|null;
}

class NewsMd extends React.Component<NewsMdProps, NewsMdState> {

    constructor(props: NewsMdProps) {
        super(props);
        this.state = {
            newsMd: null
        };
    }

    private loadNews(locale: string) {
        return Ajax.get(Constants.NEWS_MD_URL[locale])
            .then((data: string) => {
                this.setState({newsMd: data})
            })
            .catch((reason: any) => {
                this.setState({newsMd: "*" + this.props.i18n("ajax.failed") + " (" + reason.status + ")*"})
            })
    }

    public componentWillReceiveProps(nextProps: NewsMdProps) {
        if (nextProps.locale !== this.props.locale) {
            this.setState({newsMd: null});
            this.loadNews(nextProps.locale);
        }
    }

    public componentDidMount() {
        return this.loadNews(this.props.locale);
    }

    public render() {
        const i18n = this.props.i18n;

        return <Card>
            <CardHeader tag="h4">
                {i18n("dashboard.news.tile")}
            </CardHeader>
            <CardBody>
                {this.state.newsMd ? <ReactMarkdown source={this.state.newsMd} /> : <SpinnerPlaceholder/>}
            </CardBody>
            </Card>;
    }
}

export default injectIntl(withI18n(NewsMd));
