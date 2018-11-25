import Utils from "../util/Utils";

/**
 * Common logic for classes implementing support for unmapped properties.
 */
export default {
    getUnmappedProperties(instance: any, mappedProperties: string[]): Map<string, string[]> {
        const map = new Map<string, string[]>();
        Object.getOwnPropertyNames(instance).filter(p => mappedProperties.indexOf(p) === -1)
            .forEach(prop => {
                const values: string[] = Utils.sanitizeArray(instance[prop]);
                map.set(prop, values);
            });
        return map;
    },

    setUnmappedProperties(instance: any, properties: Map<string, string[]>) {
        properties.forEach((value, key) => instance[key] = value);
    }
}