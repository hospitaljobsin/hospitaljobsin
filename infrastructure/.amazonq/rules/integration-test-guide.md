# Integration Test Writing guide

- while testing mutations, reference other tests written for mutations as examples
- Ensure every single edge case possible is covered
- Strictly do not use mocks or patches while writing integration tests
- Always use top level imports. Don't import separately inside test cases.
- Clean up test fixtures wherever possible after yielding them.
