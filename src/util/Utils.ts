/**
 * General utility functions.
 */
import Asset, {AssetData} from "../model/Asset";
import VocabularyUtils from "./VocabularyUtils";

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
        return str.startsWith("http://") || str.startsWith("https://") || str.startsWith("ftp://") || str.startsWith("sftp://");
    },

    /**
     * Extracts query parameter value from the specified query string
     * @param queryString String to extracts params from
     * @param paramName Name of the parameter to extract
     * @return extracted parameter value or undefined if the parameter is not present in the query
     */
    extractQueryParam(queryString: string, paramName: string): string | undefined {
        queryString = decodeURI(queryString); // TODO This is a nasty hack, the problem with encoding seems to be
                                              // somewhere in thunk
        const match = queryString.match(new RegExp(paramName + "=([^&]*)"));
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
    fileDownload(data: any, filename: string, mimeType: string = "application/octet-stream") {
        const blob = new Blob([data], {type: mimeType});
        const blobURL = window.URL.createObjectURL(blob);
        const tempLink = document.createElement("a");
        tempLink.style.display = "none";
        tempLink.href = blobURL;
        tempLink.setAttribute("download", filename);

        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
        window.URL.revokeObjectURL(blobURL);
    },

    /**
     * Creates paging parameters (page number - starts at 0, page size) from the specified offset and limit
     * configuration.
     *
     * Note that offset is always rounded up to the the closest greater page number. I.e., for example, offset 88 with
     * limit 100 results in page = 1 and size = 100.
     *
     * This allows to adapt offset and limit-based components (e.g., the intelligent-tree-select) to paging-based
     * server API.
     * @param offset Result offset
     * @param limit Number of results
     */
    createPagingParams(offset?: number, limit?: number): { page?: number, size?: number } {
        if (offset === undefined || !Number.isInteger(offset) || limit === undefined || !Number.isInteger(limit)) {
            return {};
        }
        return {
            size: limit,
            page: Math.ceil(offset! / limit!)
        };
    },

    /**
     * Determines primary asset type from the specified data.
     *
     * Primary asset type is the most specific ontological class the specified asset data carry. For instance, for a
     * resource of type file, which would contain both file and resource in its "types" definition, file is the primary
     * one, as it is more specific than resource.
     *
     * The type is determined using the "types" attribute.
     * @param asset Asset whose type should be determined
     * @return asset primary  type, undefined if the type is not known or it the asset does not contain type info
     */
    getPrimaryAssetType(asset: AssetData): string | undefined {
        const types = this.sanitizeArray(asset.types);
        if (types.indexOf(VocabularyUtils.TERM) !== -1) {
            return VocabularyUtils.TERM;
        } else if (types.indexOf(VocabularyUtils.VOCABULARY) !== -1) {
            return VocabularyUtils.VOCABULARY;
        } else if (types.indexOf(VocabularyUtils.DOCUMENT) !== -1) {
            return VocabularyUtils.DOCUMENT;
        } else if (types.indexOf(VocabularyUtils.FILE) !== -1) {
            return VocabularyUtils.FILE;
        } else if (types.indexOf(VocabularyUtils.DATASET) !== -1) {
            return VocabularyUtils.DATASET;
        } else if (types.indexOf(VocabularyUtils.RESOURCE) !== -1) {
            return VocabularyUtils.RESOURCE;
        } else {
            return undefined;
        }
    },

    /**
     * Determines the id of the i18n message representing the label of the specified asset's type.
     *
     * The type resolution is based on value of the @type attribute of the specified asset.
     * @param asset Asset whose type label id should be determined
     */
    getAssetTypeLabelId(asset: Asset): string | undefined {
        switch (this.getPrimaryAssetType(asset)) {
            case VocabularyUtils.TERM:
                return "type.term";
            case VocabularyUtils.VOCABULARY:
                return "type.vocabulary";
            case VocabularyUtils.DOCUMENT:
                return "type.document";
            case VocabularyUtils.FILE:
                return "type.file";
            case VocabularyUtils.DATASET:
                return "type.dataset";
            case VocabularyUtils.RESOURCE:
                return "type.resource";
            default:
                return undefined;
        }
    },

    /**
     * Calculates the height of the asset tree selector.
     */
    calculateAssetListHeight() {
        const container = document.getElementById("content-container");
        return container? container.clientHeight * 0.8 : window.innerHeight / 2;
    }
}