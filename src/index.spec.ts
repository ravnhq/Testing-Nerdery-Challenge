import {
  isInteger,
  toLowerCase,
  removeDuplicatesFromArray,
  createRandomProduct,
  getStarWarsPlanets,
  createProduct,
} from './index';

/*test('Testing time!', () => {
  console.log('welcome');
});*/

describe('isInteger()',() => {
  it("should return true if value is a number", () => {
    expect(isInteger(1)).toBe(true);
    expect(isInteger(-1)).toBe(true);
    expect(isInteger(0)).toBe(true);
  });
  it('should return false if value is a string', () => {
    expect(isInteger('test')).toBe(false);
    expect(isInteger('111')).toBe(false);
    expect(isInteger('-123')).toBe(false);
  });
});

describe('toLowerCase()', () => {
  it('should return a default message if not pass a string', () => {
    const defaultMessage = 'Please provide a string';
    expect(toLowerCase('')).toBe(defaultMessage);
    expect(toLowerCase(null)).toBe(defaultMessage);
    expect(toLowerCase(undefined)).toBe(defaultMessage);
  });
  it('should return a string in lower case', () => {
    expect(toLowerCase('TEST')).toBe('test');
    expect(toLowerCase('test')).toBe('test');
    expect(toLowerCase('TeSt')).toBe('test');
  });
});

describe('removeDuplicatesFromArray()', () => {
  it('should throw an error if not array provided', () => {
    const errorMessage = 'please provide an array of numbers or strings';
    expect(() => removeDuplicatesFromArray(null)).toThrowError(errorMessage);
    expect(() => removeDuplicatesFromArray(undefined)).toThrowError(errorMessage);
    expect(() => removeDuplicatesFromArray({} as any)).toThrowError(errorMessage);
  });
  it('should return an array with no duplicates', () => {
    const oneElement = [1];
    expect(removeDuplicatesFromArray(oneElement)).toEqual([1]);

    const numbers = [1, 2, 3, 4, 5, 6];
    expect(removeDuplicatesFromArray(numbers)).toEqual([1, 2, 3, 4, 5, 6]);

    const repeatedNumbers = [1, 1, 1, 1, 1, 1];
    expect(removeDuplicatesFromArray(repeatedNumbers)).toEqual([1]);

    const strings = ['a', 'b', 'c', 'd', 'e', 'f'];
    expect(removeDuplicatesFromArray(strings)).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);

    const repeatedStrings = ['a', 'a', 'a', 'a', 'a', 'a'];
    expect(removeDuplicatesFromArray(repeatedStrings)).toEqual(['a']);

    const stringAndNumbers = [1, 'b', 'c', 4, 'e', 6];
    expect(removeDuplicatesFromArray(stringAndNumbers)).toEqual([1, 'b', 'c', 4, 'e', 6]);

    const repeatedStringAndNumbers = ['a', 'a', 1, 1, null, undefined];
    expect(removeDuplicatesFromArray(repeatedStringAndNumbers)).toEqual(['a', 1, null, undefined]);
  })
});

import products from './utils/products';

describe('createProduct()', () => {
  it('should throw an error if product is not valid', () => {
    for(const product of products){
      expect(() => createProduct(product)).toThrowError();
    }
  });
  it('should return a product', () => {
    const validProduct = {  
      name: 'Egg',
      tags: ['dairy'],
      description: 'A boiled egg',
      price: 2.30,
    };
    expect(createProduct(validProduct)).toEqual({
      id: expect.any(Number),
      ...validProduct,
    });
  });
});

import users from './utils/users';

describe('createRandomProduct()', () => {
  it('should throw an error if user is not creator', () => {
    const defaultMessage = 'You are not allowed to create products';
    expect(() => createRandomProduct(users[0].email)).toThrowError(defaultMessage);
    expect(() => createRandomProduct(users[2].email)).toThrowError(defaultMessage);
  });
  it('should throw an error if email is incorrect', () => {
    expect(() => createRandomProduct(null)).toThrowError();
    expect(() => createRandomProduct(undefined)).toThrowError();
    expect(() => createRandomProduct('')).toThrowError();
  });
  it('should return a product when user is creator', () => {
    expect(createRandomProduct(users[1].email)).toEqual({
      id: expect.any(Number),
      name: expect.any(String),
      description: expect.any(String),
      tags: expect.any(Array),
      price: expect.any(String),
    })
  });
});

import { mocked } from 'ts-jest/utils';
import fetch from 'node-fetch';

jest.mock('node-fetch', () => {
  return jest.fn();
});

beforeEach(() => {
  mocked(fetch).mockClear();
});

describe('getStarWarsPlanets()', () => {
  it('should return a json response with Star War Planets', async () => {
    const response = {
      count: 60,
      next: 'https://swapi.dev/api/planets/?page=2', 
      previous: null, 
      results: expect.any(Array),
    }
    mocked(fetch).mockImplementation((): Promise<any> => {
      return Promise.resolve({
        json() {
          return Promise.resolve(response);
        },
      });
    });
    await expect(getStarWarsPlanets()).resolves.toEqual(response);
    expect(mocked(fetch)).toHaveBeenCalledTimes(1);
    expect(mocked(fetch)).toHaveBeenCalledWith('https://swapi.dev/api/planets');
  });
  it('should throw error if api no available', async () => {
    mocked(fetch).mockImplementation(() => Promise.reject());
    await expect(getStarWarsPlanets()).rejects.toThrowError('unable to make request');
  });
})