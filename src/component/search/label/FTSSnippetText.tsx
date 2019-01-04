import * as React from "react";
import {Instruction, Parser as HtmlToReactParser, ProcessNodeDefinitions} from "html-to-react";

interface FTSSnippetTextProps {
    text: string;
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

const FTSSnippetText: React.SFC<FTSSnippetTextProps> = (props: FTSSnippetTextProps) => {
    const parser = new HtmlToReactParser();
    const elem = parser.parseWithInstructions(props.text, isValidNode, processingInstructions);
    return <div><React.Fragment>{elem}</React.Fragment></div>;
};

export default FTSSnippetText;