import * as React from "react";
import Term from "../../../model/Term";
import classNames from "classnames";
import ResultItem from "./ResultItem";
import ImportedTermInfo from "../../term/ImportedTermInfo";

interface TreeOption {
    disabled: boolean;
    className: string;
}

interface OptionRendererParams<T> {
    focusedOption?: T & TreeOption;
    focusOption: (option: T & TreeOption) => void;
    key?: string;
    option: T & TreeOption;
    selectValue: (option: T & TreeOption) => void;
    optionStyle: any;
    renderAsTree: boolean;
    valueArray: T & TreeOption[];
    toggleOption: (option: T & TreeOption) => void;
    searchString: string;
}

/**
 * Intelligent tree select option renderer which visualizes imported Terms by adding icon to them.
 *
 * @param currentVocabularyIri IRI of the current vocabulary, used to resolve whether term is imported
 */
export function createTermsWithImportsOptionRenderer(currentVocabularyIri?: string) {
    return (params: OptionRendererParams<Term>) => {
        const {option, focusedOption, optionStyle, selectValue, focusOption, toggleOption, valueArray} = {...params};
        const className = classNames("VirtualizedSelectOption", {
            "VirtualizedSelectFocusedOption": option === focusedOption,
            "VirtualizedSelectDisabledOption": option.disabled,
            "VirtualizedSelectSelectedOption": valueArray && valueArray.indexOf(option) >= 0
        }, option.className);

        const eventHandlers = option.disabled ? {} : {
            onClick: () => selectValue(option),
            onMouseEnter: () => focusOption(option),
            onToggleClick: () => toggleOption(option),
        };

        const importInfo = !currentVocabularyIri || currentVocabularyIri === option.vocabulary!.iri ? undefined :
            <span><ImportedTermInfo term={option}/></span>;

        return <ResultItem key={params.key} renderAsTree={params.renderAsTree} className={className} option={option}
                           childrenKey="plainSubTerms" labelKey="label" valueKey="iri" style={optionStyle}
                           searchString={params.searchString} addonBefore={importInfo}
                           displayInfoOnHover={false} {...eventHandlers}/>;
    }
}