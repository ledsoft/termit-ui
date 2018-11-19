import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Badge, Label} from "reactstrap";
import {GoX} from "react-icons/go";
import OutgoingLink from "../misc/OutgoingLink";
import AssetLabel from "../misc/AssetLabel";

interface UnmappedPropertiesEditProps extends HasI18n {
    properties: Map<string, string[]>;
    onChange: (properties: Map<string, string[]>) => void;
}

interface UnmappedPropertiesEditState {
    property: string;
    value: string;
}

export class UnmappedPropertiesEdit extends React.Component<UnmappedPropertiesEditProps, UnmappedPropertiesEditState> {
    constructor(props: UnmappedPropertiesEditProps) {
        super(props);
        this.state = {
            property: "",
            value: ""
        };
    }

    public render() {
        return <div>
            {this.renderExisting()}
        </div>;
    }

    private renderExisting() {
        const result: JSX.Element[] = [];
        this.props.properties.forEach((values, k) => {
            const items = values.map(v => <li key={v}>
                {v}
                <Badge color='danger' title={this.props.i18n('properties.edit.remove')}
                       className='term-edit-source-remove align-middle'><GoX/></Badge>
            </li>);

            result.push(<div key={k}>
                <div><OutgoingLink label={<Label className="attribute-label"><AssetLabel iri={k}/></Label>} iri={k}/>
                </div>
                <div>
                    <ul className="term-items">
                        {items}
                    </ul>
                </div>
            </div>);
        });
        return result;
    }
}

export default injectIntl(withI18n(UnmappedPropertiesEdit));
