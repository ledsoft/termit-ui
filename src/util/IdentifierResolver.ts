export default class IdentifierResolver {

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