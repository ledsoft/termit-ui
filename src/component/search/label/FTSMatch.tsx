import * as React from "react";
import {Instruction, Parser as HtmlToReactParser, ProcessNodeDefinitions} from "html-to-react";
import {Badge, Col, Row} from "reactstrap";
import classNames from "classnames";

interface FTSMatchProps {
    matches: string[];
    fields: string[];
}

const isValidNode = () => true;

const processingInstructions: Instruction[] = [{
    shouldProcessNode: node => {
        return node && node.name === "em";
    },

    processNode: (node: any, children: any) => {
        return <span key={Math.random()} className="search-result-snippet-match">{children}</span>;
    }
},
    {
        // Anything else
        shouldProcessNode: (node: any): boolean => {
            return true;
        },
        processNode: new ProcessNodeDefinitions(React).processDefaultNode
    }
];

const FTSMatch: React.SFC<FTSMatchProps> = (props: FTSMatchProps) => {
    const parser = new HtmlToReactParser();
    const items = [];
    for (let i = 0, len = props.matches.length; i < len; i++) {
        const className = classNames({"search-result-match-row": i < len - 1});
        items.push(<Row key={props.fields[i]} className={className}>
            <Col md={3} lg={2} xl={1}><Badge className="search-result-field-badge">{props.fields[i]}</Badge></Col>
            <Col md={9} lg={10} xl={11}>
                <React.Fragment>{parser.parseWithInstructions(props.matches[i], isValidNode, processingInstructions)}</React.Fragment>
            </Col>
        </Row>);
    }
    return <div>{items}</div>;
};

export default FTSMatch;