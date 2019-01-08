import * as React from "react";
import {injectIntl} from "react-intl";
import {Instruction, Parser as HtmlToReactParser, ProcessNodeDefinitions} from "html-to-react";
import {Badge, Col, Row} from "reactstrap";
import classNames from "classnames";
import withI18n, {HasI18n} from "../../hoc/withI18n";

interface FTSMatchProps extends HasI18n {
    matches: string[];
    fields: string[];
}

const isValidNode = () => true;

const processingInstructions: Instruction[] = [{
    shouldProcessNode: node => {
        // Process only nodes representing the mach
        return node && node.name === "em";
    },

    processNode: (node: any, children: any) => {
        // Render matches in the snippet with some sort of emphasis
        return <span key={Math.random()} className="search-result-snippet-match">{children}</span>;
    }
},
    {
        // Anything else
        shouldProcessNode: (): boolean => {
            return true;
        },
        processNode: new ProcessNodeDefinitions(React).processDefaultNode
    }
];

/**
 * Renders the matching field and text snippet with the match(es) visualizing the match(es) in the text.
 */
export const FTSMatch: React.SFC<FTSMatchProps> = (props: FTSMatchProps) => {
    const parser = new HtmlToReactParser();
    const items = [];
    for (let i = 0, len = props.matches.length; i < len; i++) {
        const className = classNames({"search-result-match-row": i < len - 1});
        const i18nField = props.i18n("search.results.field." + props.fields[i]);
        items.push(<Row key={props.fields[i]} className={className}>
            <Col md={3} lg={2} xl={1}><Badge
                className="search-result-field-badge">{i18nField ? i18nField : props.fields[i]}</Badge></Col>
            <Col md={9} lg={10} xl={11}>
                <React.Fragment>{parser.parseWithInstructions(props.matches[i], isValidNode, processingInstructions)}</React.Fragment>
            </Col>
        </Row>);
    }
    return <div>{items}</div>;
};

export default injectIntl(withI18n(FTSMatch));