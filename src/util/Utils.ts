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
        queryString = decodeURI(queryString); // TODO This is a nasty hack, the problem with encoding seems to be somewhere in thunk
        const match = queryString.match(new RegExp(paramName + '=([^&]*)'));
        return match ? match[1] : undefined;
    },

    /**
     * Ensures that file download using Ajax triggers browser file save mechanism.
     *
     * Adapted from https://github.com/kennethjiang/js-file-download/blob/master/file-download.js
     * @param data The downloaded data
     * @param filename Name of the file
     * @param mimeType Type of data
     */
    fileDownload(data: any, filename: string, mimeType: string = 'application/octet-stream') {
        const blob = new Blob([data], {type: mimeType});
        const blobURL = window.URL.createObjectURL(blob);
        const tempLink = document.createElement('a');
        tempLink.style.display = 'none';
        tempLink.href = blobURL;
        tempLink.setAttribute('download', filename);

        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
        window.URL.revokeObjectURL(blobURL);
    }
}