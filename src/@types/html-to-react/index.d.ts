/**
 * Type declarations for html-to-react library.
 */
declare module 'html-to-react' {

    interface Node {
        name?: string
        attribs?: any
        children?: [any]
    }

    interface Instruction {
        shouldProcessNode?: (node: any) => boolean
        processNode?: any
    }

    class ProcessNodeDefinitions {
        constructor(react: object)
        public processDefaultNode: any
    }
    class Parser {
        constructor(options?: any)
        public parseWithInstructions(html: any, isValidNode: any, processingInstructions: Instruction[]):  any;
    }



}