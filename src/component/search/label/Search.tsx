import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../../hoc/withI18n";
import {RouteComponentProps, withRouter} from "react-router";
import {connect} from "react-redux";

interface SearchProps extends HasI18n, RouteComponentProps<any> {
    search: (searchString: string) => void;
}


class Search extends React.Component<SearchProps> {

    constructor(props: SearchProps) {
        super(props);
    }

    public render() {
        return <div>Search!</div>;
    }
}

export default connect()(withRouter(injectIntl(withI18n(Search))));