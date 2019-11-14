import Generator from "../../__tests__/environment/Generator";
import VocabularyUtils from "../../util/VocabularyUtils";

describe("User", () => {

    describe("isLocked", () => {
        it("returns true when types contain locked user type", () => {
            const sut = Generator.generateUser();
            sut.types.push(VocabularyUtils.USER_LOCKED);
            expect(sut.isLocked()).toBeTruthy();
        });

        it("returns false when types do not contain locked user type", () => {
            const sut = Generator.generateUser();
            expect(sut.isLocked()).toBeFalsy();
        });
    });

    describe("isDisabled", () => {
        it("returns true when types contain disabled user type", () => {
            const sut = Generator.generateUser();
            sut.types.push(VocabularyUtils.USER_DISABLED);
            expect(sut.isDisabled()).toBeTruthy();
        });

        it("returns false when types do not contain disabled user type", () => {
            const sut = Generator.generateUser();
            expect(sut.isDisabled()).toBeFalsy();
        });
    });
});
