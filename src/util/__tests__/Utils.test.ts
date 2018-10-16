import Utils from "../Utils";

describe('Utils', () => {

    describe('sanitizeArray', () => {
        it('returns array as it is', () => {
            const arr = ['1', '2', '3'];
            expect(Utils.sanitizeArray(arr)).toEqual(arr);
        });

        it('returns single object as a single-element array', () => {
            const elem = 117;
            expect(Utils.sanitizeArray(elem)).toEqual([elem]);
        });

        it('returns empty array for undefined argument', () => {
            expect(Utils.sanitizeArray(undefined)).toEqual([]);
        });

        it('returns empty array for null argument', () => {
            expect(Utils.sanitizeArray(null)).toEqual([]);
        });
    });
});