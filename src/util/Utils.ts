/**
 * General utility functions.
 */

export default {

    /**
     * Ensures that the specified argument is returned as an array at all conditions.
     *
     * If the argument is a single element, it is returned as a single-element array.
     * @param arr Input to sanitize
     */
    sanitizeArray<T>(arr: T[] | T | undefined | null): T[] {
        return arr ? (Array.isArray(arr) ? arr : [arr]) : [];
    },

    /**
     * Checks if the specified string is a link which can be dereferenced.
     * @param str
     */
    isLink(str: string): boolean {
        return str.startsWith('http://') || str.startsWith('https://') || str.startsWith('ftp://') || str.startsWith('sftp://');
    },

    /**
     * Extracts query parameter value from the specified query string
     * @param queryString String to extracts params from
     * @param paramName Name of the parameter to extract
     * @return extracted parameter value or undefined if the parameter is not present in the query
     */
    extractQueryParam(queryString: string, paramName: string): string | undefined {
        const match = queryString.match(new RegExp(paramName + '=([^&]*)'));
        return match ? match[1] : undefined;
    }
}