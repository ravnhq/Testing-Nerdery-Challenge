import {
  isInteger,
  toLowerCase,
  removeDuplicatesFromArray,
  createRandomProduct,
  createFakeProduct,
  getStarWarsPlanets,
  createProduct,
} from './index';

// Test isInteger()

describe('checking if it is integer', () => {
  it('should return true if we pass a number', () => {
    expect(isInteger(8)).toBe(true);
  });
  it('should return true if we pass a  negative number', () => {
    expect(isInteger(-2)).toBe(true);
  });
  it('should return false if we pass a string', () => {
    expect(isInteger('10')).toBe(false);
  });
  it('should return false if we pass a decimal number', () => {
    expect(isInteger(20.45)).toBe(false);
  });
  it('should return false if we pass NaN', () => {
    expect(isInteger(NaN)).toBe(false);
  });
  it('should return false if we pass infinity', () => {
    expect(isInteger(Infinity)).toBe(false);
  });
});

// Test toLowerCase()
describe('turn a string into lowercase', () => {
  it('should return a lowercase string  if we pass capital letters', () => {
    expect(toLowerCase('MMMM')).toMatch(/mmm/);
  });
  it('should return a lowercase string if we pass lowercase letters', () => {
    expect(toLowerCase('mmm')).toMatch(/mmm/);
  });
  it('fails if we dont pass any string', () => {
    expect(toLowerCase('')).toBe('Please provide a string');
  });
});

// Test removeDuplicatesFromArray()

describe('remove duplicates from Array', () => {
  it('return one item if we pass an array with one item', () => {
    expect(removeDuplicatesFromArray([2])).toEqual([2]);
  });

  it('return the same array if we pass an array with unique elements', () => {
    const myArray = ['a', 1, 'M'];
    expect(removeDuplicatesFromArray(myArray)).toEqual(['a', 1, 'M']);
  });

  it('remove duplicates numbers or string form an array', () => {
    const myArray = ['a', 1, 1, 'a', 3];
    expect(removeDuplicatesFromArray(myArray)).toEqual(['a', 1, 3]);
  });
  it('fails if we pass a wrong argument type', () => {
    const props = { item: 2 };
    const testFunction = () => {
      removeDuplicatesFromArray(props as any);
    };
    expect(testFunction).toThrow(Error);
  });
});
