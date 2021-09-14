import {
  isInteger,
  toLowerCase,
  removeDuplicatesFromArray,
  createRandomProduct,
  getStarWarsPlanets,
  createProduct,
} from './index';

describe('Test isInteger function', () => {
  it('return true if we pass a number', () => {
    expect(isInteger(1)).toBe(true);
  });

  it('return true if we pass a negative number', () => {
    expect(isInteger(-1)).toBe(true);
  });

  it('return false if we pass a decimal number', () => {
    expect(isInteger(-10.4)).toBe(false);
  });

  it('return false if we pass a string', () => {
    expect(isInteger('1')).toBe(false);
  });

  it('return false if we pass a NaN', () => {
    expect(isInteger(NaN)).toBe(false);
  });

  it('return false if we pass a null', () => {
    expect(isInteger(null)).toBe(false);
  });
});
