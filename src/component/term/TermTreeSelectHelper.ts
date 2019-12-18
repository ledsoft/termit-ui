import Utils from "../../util/Utils";
import Term, {TermData} from "../../model/Term";
import {TreeSelectFetchOptionsParams} from "../../util/Types";

/**
 * Common properties for a tree selector containing terms
 * @param i18n
 */
export function commonTermTreeSelectProps(i18n: (messageId: string) => string) {
    return {
        valueKey: "iri",
        labelKey: "label",
        childrenKey: "plainSubTerms",
        renderAsTree: true,
        simpleTreeData: true,
        showSettings: false,
        placeholder: i18n("glossary.select.placeholder"),
        valueRenderer: Utils.labelValueRenderer
    };
}

/**
 * Prepares the specified terms for the tree select component. This consists of removing terms and subterms which are
 * not in the specified vocabularies and flattening term ancestors if necessary.
 * @param terms Terms to process
 * @param vocabularies Vocabularies in which all the terms should be
 * @param fetchOptions Term fetching options
 */
export function processTermsForTreeSelect(terms: Term[], vocabularies: string[], fetchOptions: TreeSelectFetchOptionsParams<TermData>): Term[] {
    let result: Term[] = [];
    for (const t of terms) {
        if (vocabularies.indexOf(t.vocabulary!.iri!) === -1) {
            continue;
        }
        result.push(t);
        if (t.subTerms) {
            t.subTerms = t.subTerms.filter(st => vocabularies.indexOf(st.vocabulary.iri!) !== -1);
            t.syncPlainSubTerms();
        }
        if (fetchOptions.searchString && t.parentTerms) {
            result = result.concat(flattenAncestors(t.parentTerms));
        }
    }
    return result;
}

/**
 * Flattens ancestors of the specified terms by adding the into the result array together with the terms.
 *
 * This is necessary for proper functionality of the tree select.
 * @param terms Terms to flatten
 */
function flattenAncestors(terms: Term[]) {
    let result: Term[] = [];
    for (const t of terms) {
        result.push(t);
        if (t.parentTerms) {
            result = result.concat(flattenAncestors(t.parentTerms));
        }
    }
    return result;
}
