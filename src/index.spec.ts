import {
  isInteger,
  toLowerCase,
  removeDuplicatesFromArray,
  createRandomProduct,
  getStarWarsPlanets,
  createProduct,
} from './index';

import fetch from 'node-fetch';
import { mocked } from 'ts-jest/utils';

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

describe('Test toLowerCase function', () => {
  it('returns lowercase string', () => {
    expect(toLowerCase('Hello')).toBe('hello');
  });

  it('returns lowercase string', () => {
    expect(toLowerCase('Hello World')).toBe('hello world');
  });

  it("return 'Please provide a string' if we pass an empty string", () => {
    expect(toLowerCase('')).toBe('Please provide a string');
  });
});

describe('Test removeDuplicatesFromArray function', () => {
  it('should return the same array if we pass an array with one element', () => {
    expect(removeDuplicatesFromArray([1])).toEqual([1]);
  });

  it('should return the same array if there is no duplicated items', () => {
    const arr = [1, 'test', 23];

    expect(removeDuplicatesFromArray(arr)).toEqual(arr);
  });

  it('should return the array without duplated elements', () => {
    const arr = [1, 'test', 23, 1, 'test', 23];

    expect(removeDuplicatesFromArray(arr)).toEqual([1, 'test', 23]);
  });

  it('should fail if we pass a wrong argument type', () => {
    const prop = { number: 2 };
    const functionTest = () => removeDuplicatesFromArray(prop as any);

    expect(functionTest).toThrowError(Error);
  });
});

describe('Test createProduct function', () => {
  const validProduct = {
    name: 'Product',
    tags: ['tag1'],
    description: 'description product 1',
    price: 10.2,
  };

  const invalidProduct = {
    ...validProduct,
    tags: ['tag1', 'tag2'],
  };

  it('should return a product with an id', () => {
    expect(createProduct(validProduct)).toEqual({
      id: expect.any(Number),
      name: 'Product',
      tags: ['tag1'],
      description: 'description product 1',
      price: 10.2,
    });
  });

  it('should fail if we pass an ivnalid schema of the product', () => {
    expect(() => createProduct(invalidProduct)).toThrowError(Error);
  });
});

describe('Test createRandomProduct function', () => {
  it('should create a product with the correct role', () => {
    expect(createRandomProduct('clark@kent.com')).toEqual({
      id: expect.any(Number),
      name: expect.any(String),
      tags: expect.any(Array),
      description: expect.any(String),
      price: expect.any(String),
    });
  });

  it('should throw an error if we pass a user without <creator> role', () => {
    expect(() => createRandomProduct('diana@themyscira.com')).toThrowError(
      Error,
    );
  });
});

jest.mock('node-fetch', () => {
  return jest.fn();
});

beforeEach(() => {
  mocked(fetch).mockClear();
});

describe('test getStarWarsPlanets function ', () => {
  it('should call the API and check the response ', async () => {
    const mockApiResult = {
      count: 60,
      next: 'http://swapi.dev/api/planets/',
      previous: null,
      results: [
        {
          name: 'Mars',
        },
        {
          name: 'Earth',
        },
        {
          name: 'Venus',
        },
      ],
    };

    mocked(fetch).mockImplementation((): Promise<any> => {
      return Promise.resolve({
        json() {
          return Promise.resolve(mockApiResult);
        },
      });
    });

    const planets = await getStarWarsPlanets();
    expect(mocked(fetch)).toHaveBeenCalledTimes(1);
    expect(mocked(fetch)).toHaveBeenCalledWith('https://swapi.dev/api/planets');
    expect(planets.results).not.toHaveLength(0);
    expect(planets.results[0].name).toBe('Mars');
  });

  it('should throw an error when the API rejects the request', async () => {
    mocked(fetch).mockImplementation((): Promise<any> => {
      return Promise.reject('API rejection');
    });

    await expect(getStarWarsPlanets()).rejects.toThrowErrorMatchingSnapshot(
      'Error: unable to make request',
    );
  });
});
