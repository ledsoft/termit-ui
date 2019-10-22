import User from "../../model/User";
import VocabularyUtils from "../../util/VocabularyUtils";
import Term from "../../model/Term";

export default class Generator {

    public static readonly URI_BASE = "http://onto.fel.cvut.cz/ontologies/application/termit";

    public static randomInt(min: number = 0, max: number = Number.MAX_SAFE_INTEGER) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    public static randomBoolean() {
        return Math.random() < 0.5;
    }

    public static generateUri() {
        return Generator.URI_BASE + "/instance-" + Generator.randomInt();
    }

    public static generateUser() {
        return new User({
            iri: Generator.generateUri(),
            firstName: "FirstName" + Generator.randomInt(0, 10000),
            lastName: "LastName" + Generator.randomInt(0, 10000),
            username: "username" + Generator.randomInt() + "@kbss.felk.cvut.cz",
            types: [VocabularyUtils.USER]
        });
    }

    /**
     * Randomly shuffles the specified array, using the Knuth shuffle algorithm.
     * @param arr The array to shuffle
     * @return {*} The shuffled array (it is the same instance as the parameter)
     */
    public static shuffleArray(arr: object[]) {
        let currentIndex = arr.length;
        while (currentIndex !== 0) {
            const randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            const tmp = arr[currentIndex];
            arr[currentIndex] = arr[randomIndex];
            arr[randomIndex] = tmp;
        }
        return arr;
    }

    public static randomItem<T>(arr: T[]): T {
        return arr[Generator.randomInt(0, arr.length)];
    }

    public static generateTerm(vocabularyIri?: string) {
        return new Term(Object.assign(this.generateAssetData("Term " + this.randomInt(0, 10000)), {vocabulary: vocabularyIri ? {iri: vocabularyIri} : undefined}));
    }

    public static generateAssetData(label?: string): { iri: string, label: string } {
        return {
            iri: Generator.generateUri(),
            label: label ? label : "Asset " + Generator.randomInt(0, 100)
        };
    }
}
