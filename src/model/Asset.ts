export interface AssetData {
    iri?: string
}

export default abstract class Asset implements AssetData {
    public iri: string;
    public label: string;

    public abstract toJsonLd(): {};
}
