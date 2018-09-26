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
    vocabularies: new Route('vocabulary', '/vocabulary'),
    createVocabulary: new Route('createVocabulary', '/vocabulary/create'),
    vocabularySummary: new Route('vocabularySummary', '/vocabulary/:name'),
    vocabularyDetail: new Route('vocabularyDetail', '/vocabulary/:name/detail'),
    createVocabularyTerm: new Route('createVocabularyTerm', '/vocabulary/:name/new-term'),
    vocabularyTermDetail: new Route('vocabularyTermDetail', '/vocabulary/:name/term/:termName'),
    annotateFile: new Route("annotateFile", '/file/:name')
}