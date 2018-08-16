export default class IdentifierResolver {

    /**
     * Extracts path variable and possible query parameters for routing purposes from the specified location.
     *
     * Basically, this method extracts the local name from the location URL, which is either the part after the last
     * slash or the hash fragment and adds them into a params map under the key 'name'. In addition, any query
     * parameters are extracted from the URL and put into a query map.
     * @param location URI of resource, usually extracted from location header
     */
    public static routingOptionsFromLocation(location: string): { params?: Map<string, string>, query?: Map<string, string> } {
        const slashIndex = location.lastIndexOf('/');
        const hashIndex = location.lastIndexOf('#');
        const name = location.substring((slashIndex > hashIndex ? slashIndex : hashIndex) + 1);
        const queryMap = new Map();
        const queryIndex = location.indexOf('?');
        if (queryIndex !== -1) {
            const queryString = location.substring(queryIndex + 1);
            const queryParams = queryString.split('&');
            queryParams.forEach(q => {
                const ind = q.indexOf('=');
                queryMap.set(q.substring(0, ind), q.substring(ind + 1));
            });
        }
        return {
            params: new Map([['name', name]]),
            query: queryMap
        };
    }
}