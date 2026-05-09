/**
 * Basic unit tests for critical functions.
 * These tests assume a Node test runner (Jest) and that functions are exported for testing.
 * If you don't use a bundler or test runner, keep this file as a reference.
 */

 const { generatePassword, formatJsonInputForTest } = require('../test-helpers/tools-test-helpers');

 describe('generatePassword', () => {
   test('generates correct length', () => {
     const pw = generatePassword(12, { lower: true, upper: true, digits: true, symbols: false });
     expect(pw).toHaveLength(12);
   });
 
   test('returns empty string when no sets selected', () => {
     const pw = generatePassword(8, { lower: false, upper: false, digits: false, symbols: false });
     expect(pw).toBe('');
   });
 });
 
 describe('formatJsonInputForTest', () => {
   test('formats JSON with indent', () => {
     const input = '{"a":1,"b":2}';
     const out = formatJsonInputForTest(input, 2, false);
     expect(out).toBe(JSON.stringify(JSON.parse(input), null, 2));
   });
 
   test('minifies JSON', () => {
     const input = '{ "a": 1 }';
     const out = formatJsonInputForTest(input, 0, true);
     expect(out).toBe(JSON.stringify(JSON.parse(input)));
   });
 
   test('returns error message for invalid JSON', () => {
     const input = '{ a: 1 }';
     const out = formatJsonInputForTest(input, 2, false);
     expect(out).toMatch(/JSON parse error/i);
   });
 });
 