export class Route {

    public readonly name: string;
    public readonly path: string;

    constructor(name:string, path:string) {
        this.name = name;
        this.path = path;
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
    vocabularies: new Route('vocabulary', '/vocabularies'),
    resources: new Route('resource', '/resources'),
    createVocabulary: new Route('createVocabulary', '/vocabularies/create'),
    vocabularyDetail: new Route('vocabularyDetail', '/vocabularies/:name/terms'),
    vocabularySummary: new Route('vocabularySummary', '/vocabularies/:name'),
    resourceSummary: new Route('resourceSummary', '/resources/:name'),
    createVocabularyTerm: new Route('createVocabularyTerm', '/vocabularies/:name/terms/create'),
    vocabularyTermDetail: new Route('vocabularyTermDetail', '/vocabularies/:name/terms/:termName'),
    annotateFile: new Route("annotateFile", '/file/:name')
}