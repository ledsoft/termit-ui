import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Card, CardBody, CardHeader} from "reactstrap";
import * as ReactMarkdown from "react-markdown";

interface NewsMdProps extends HasI18n {
}

class NewsMd extends React.Component<NewsMdProps> {
    public render() {
        const i18n = this.props.i18n;
        const newsText = "Hello **World**!";

        return <Card>
            <CardHeader tag="h4">
                {i18n("dashboard.news.tile")}
            </CardHeader>
            <CardBody>
                <ReactMarkdown source={newsText} />
            </CardBody>
            </Card>;
    }
}

export default injectIntl(withI18n(NewsMd));
