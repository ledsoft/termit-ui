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
    statistics: new Route('statistics', '/statistics'),
    vocabularies: new Route('vocabularies', '/vocabularies'),
    createVocabulary: new Route('createVocabulary', '/vocabularies/create'),
    vocabularyDetail: new Route('vocabularyDetail', '/vocabularies/:name')
}