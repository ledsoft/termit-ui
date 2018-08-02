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

## Developer Notes

- Action are currently split into `SyncAction`, `AsyncActions` and `ComplexActions`, where `SyncActions` are simple synchronous actions represented by objects,
whereas `AsyncActions` and `ComplexActions` exploit `redux-thunk` and return functions. `ComplexActions` represent actions which involve both synchronous and
asynchronous actions. This division might change as the number of actions grows.
- The main purpose of `ComplexActions` is to provide a clear and simple name for the complex action which usually involves asynchronous data-fetching actions and
synchronous actions demarcating these events.
- Navigation is handled separately from Redux, although the Redux documentation contains a section on setting up routing with react-router and redux. Currently, I
believe it is not necessary to interconnect the two.

