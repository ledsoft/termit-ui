import Utils from "../Utils";

describe("Utils", () => {

    describe("sanitizeArray", () => {
        it("returns array as it is", () => {
            const arr = ["1", "2", "3"];
            expect(Utils.sanitizeArray(arr)).toEqual(arr);
        });

        it("returns single object as a single-element array", () => {
            const elem = 117;
            expect(Utils.sanitizeArray(elem)).toEqual([elem]);
        });

        it("returns empty array for undefined argument", () => {
            expect(Utils.sanitizeArray(undefined)).toEqual([]);
        });

        it("returns empty array for null argument", () => {
            expect(Utils.sanitizeArray(null)).toEqual([]);
        });
    });

    describe("extractQueryParam", () => {
        it("extracts parameter value from query string", () => {
            const value = "http://onto.fel.cvut.cz/ontologies/termit/";
            const queryString = "?namespace=" + value;
            expect(Utils.extractQueryParam(queryString, "namespace")).toEqual(value);
        });

        it("extracts parameter value from query string containing multiple parameters", () => {
            const value = "http://onto.fel.cvut.cz/ontologies/termit/";
            const queryString = "?namespace=" + value + "&searchString=test";
            expect(Utils.extractQueryParam(queryString, "namespace")).toEqual(value);
        });

        it("returns undefined when parameter is not set in query string", () => {
            const queryString = "&searchString=test";
            expect(Utils.extractQueryParam(queryString, "namespace")).not.toBeDefined();
        });
    });

    describe("createPagingParams", () => {
        it("creates empty object for undefined params", () => {
            expect(Utils.createPagingParams()).toEqual({});
        });

        it("creates page object for offset and limit", () => {
            expect(Utils.createPagingParams(0, 100)).toEqual({page: 0, size: 100});
        });

        it("rounds offset up to the closest greater page number", () => {
            expect(Utils.createPagingParams(88, 100)).toEqual({page: 1, size: 100});
            expect(Utils.createPagingParams(173, 100)).toEqual({page: 2, size: 100});
        });

        it("returns empty object when either limit or offset is missing", () => {
            expect(Utils.createPagingParams(117)).toEqual({});
            expect(Utils.createPagingParams(undefined, 100)).toEqual({});
        });
    });
});