export interface AssetData {
    iri?: string;
    label?: string;
    comment?: string;
    types?: string[] | string;
}

/**
 * JSON-LD context definition for asset data.
 */
export const ASSET_CONTEXT = {
    iri: "@id",
    types: "@type"
};

export default abstract class Asset implements AssetData {
    public iri: string;
    public label: string;
    public comment?: string;
    public types?: string[];

    public addType(type: string) {
        if (!this.types) {
            this.types = [];
        }
        if (this.types.indexOf(type) === -1) {
            this.types.push(type);
        }
    }

    public abstract toJsonLd(): {};
}
