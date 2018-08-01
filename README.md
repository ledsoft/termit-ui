# TermIt UI

This project was bootstrapped with [Create React App](https://github.com/wmonk/create-react-app-typescript), TypeScript version.

The backend is developed separately and their communication is enabled via CORS support on the backend.


## Tests

[Jest](https://jestjs.io/en/) is used for testing the TermIt UI code.

The proposed test structure consists of:

- **Unit tests** - should test singular classes/components. The tests should be put in a `__tests__` directory
next to the file they test (see `src/reducer` and `src/reducer/__tests__`).
- **Integration tests** - tests using multiple components and classes. These include sanity tests,
regression tests and general integration tests. These should be put in the `src/__tests__` directory. Further structuring
is recommended (e.g., the sanity tests are currently in `src/__tests__/sanity`).

To enable easy integration with Jest's file name matching, all test files should have the pattern `*.test.ts(x)`. The actual
name of the file (before the first dot) should reflect the purpose of the test file, e.g., for unit tests this is the name of the
tested file (see for example `TermItReducers.ts` and the corresponding `TermItReducers.test.ts`).

