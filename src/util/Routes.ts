export class Route {

    public readonly name: string;
    public readonly path: string;

    constructor(name:string, path:string) {
        this.name = name;
        this.path = path;
    }

    public link(params: object = {}): string {
        return this.path.replace(/:([A-Za-z0-9]+)/g, (match, placeholder) => encodeURIComponent(params[placeholder] || placeholder));
    }
}

export default {
    dashboard: new Route('dashboard', '/'),
    login: new Route('login', '/login'),
    profile: new Route('profile', '/profile'),
    register: new Route('register','/register'),
    search: new Route('search', '/search'),
    facetedSearch: new Route('facetedSearch', '/facetedSearch'),
    statistics: new Route('statistics', '/statistics'),
    vocabularies: new Route('vocabulary', '/vocabulary'),
    resources: new Route('resource', '/resource'),
    createVocabulary: new Route('createVocabulary', '/vocabulary/create'),
    vocabularyDetail: new Route('vocabularyDetail', '/vocabulary/:name/term'),
    vocabularySummary: new Route('vocabularySummary', '/vocabulary/:name'),
    resourceSummary: new Route('resourceSummary', '/resource/:name'),
    createVocabularyTerm: new Route('createVocabularyTerm', '/vocabulary/:name/new-term'),
    vocabularyTermDetail: new Route('vocabularyTermDetail', '/vocabulary/:name/term/:termName'),
    annotateFile: new Route("annotateFile", '/file/:name')
}
