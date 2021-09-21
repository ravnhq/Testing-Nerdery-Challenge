import {
  isInteger,
  toLowerCase,
  removeDuplicatesFromArray,
  createRandomProduct,
  getStarWarsPlanets,
  createProduct,
} from './index';

describe('isInteger tests', () => {
  test('it should be valid with a positive number', () => {
    expect(isInteger(10)).toBe(true);
  });

  test('it should be valid with a negative number', () => {
    expect(isInteger(-10)).toBe(true);
  });

  test('it should be invalid with a decimal', () => {
    expect(isInteger(0.1)).toBe(false);
  });

  test('it should be invalid with a string as a number', () => {
    expect(isInteger('10')).toBe(false);
  });

  test('it should be invalid with NaN', () => {
    expect(isInteger(NaN)).toBe(false);
  });

  test('it should be invalid with Infinity', () => {
    expect(isInteger(Infinity)).toBe(false);
  });
});

describe('toLowerCase tests', () => {
  test('it should return a lowercase string with string in capital letters', () => {
    expect(toLowerCase('ABC')).toBe('abc');
  });

  test('it should return an error message with a empty string', () => {
    expect(toLowerCase('')).toBe('Please provide a string');
  });

  test('it should return an error message with null', () => {
    expect(toLowerCase(null)).toBe('Please provide a string');
  });
});

describe('removeDuplicatesFromArray tests', () => {
  test('it should return the same array', () => {
    const array: string[] = ['a', 'b', 'c'];
    expect(removeDuplicatesFromArray(array)).toEqual(['a', 'b', 'c']);
  });

  test('it should return the same array with one element', () => {
    const array: string[] = ['1'];
    expect(removeDuplicatesFromArray(array)).toEqual(['1']);
  });

  test('it should return the same array with an array of differents types', () => {
    const array: (string | number)[] = ['a', 1, 'b', 2];
    expect(removeDuplicatesFromArray(array)).toEqual(['a', 1, 'b', 2]);
  });

  test('it should return an array without duplicates', () => {
    const array: string[] = ['a', 'a', 'b', 'c'];
    expect(removeDuplicatesFromArray(array)).toEqual(['a', 'b', 'c']);
  });

  test('it should throw an error message with null', () => {
    const array: string[] = null;
    expect(() => {
      removeDuplicatesFromArray(array);
    }).toThrow(new Error('please provide an array of numbers or strings'));
  });
});

describe('createProduct tests', () => {
  const validProduct = {
    name: 'laptop',
    tags: ['technology'],
    description: 'Asus 13 inch',
    price: 450.0,
  };

  test('with a valid product it should return the same product with an id', () => {
    expect(createProduct(validProduct)).toEqual({
      id: expect.any(Number),
      ...validProduct,
    });
  });

  test('it should throw an error with a name attribute of size 2', () => {
    const invalidProduct = { ...validProduct };
    invalidProduct['name'] = 'it';
    expect(() => {
      createProduct(invalidProduct);
    }).toThrowErrorMatchingSnapshot();
  });

  test('it should throw an error with a description attribute of size 2', () => {
    const invalidProduct = { ...validProduct };
    invalidProduct['description'] = 'me';
    expect(() => {
      createProduct(invalidProduct);
    }).toThrowErrorMatchingSnapshot();
  });

  test('it should throw an error with a tag attribute empty', () => {
    const invalidProduct = { ...validProduct };
    invalidProduct['tag'] = [];
    expect(() => {
      createProduct(invalidProduct);
    }).toThrowErrorMatchingSnapshot();
  });

  test('it should throw an error with a price attribute negative', () => {
    const invalidProduct = { ...validProduct };
    invalidProduct['price'] = -1;
    expect(() => {
      createProduct(invalidProduct);
    }).toThrowErrorMatchingSnapshot();
  });
});

describe('createRandomProduct tests', () => {
  test('it should create a product with a correct user role', () => {
    expect(createRandomProduct('clark@kent.com')).toEqual({
      id: expect.any(Number),
      name: expect.any(String),
      description: expect.any(String),
      tags: expect.any(Array),
      price: expect.any(String),
    });
  });

  test('it should throw an error with an incorrect user role', () => {
    expect(() => {
      createRandomProduct('bruce@wayne.com');
    }).toThrow(new Error('You are not allowed to create products'));
  });

  test('it should throw an error with an user not registered', () => {
    expect(() => {
      createRandomProduct('patrick@kent.com');
    }).toThrow(new Error(`Cannot read property 'role' of undefined`));
  });
});

import fetch from 'node-fetch';
import { mocked } from 'ts-jest/utils';

jest.mock('node-fetch', () => {
  return jest.fn();
});

beforeEach(() => {
  mocked(fetch).mockClear();
});

describe('getStarWarsPlanets tests', () => {
  test('it should call API and check if there is at least one planet', async () => {
    const mockApiResult = {
      count: 60,
      next: 'http://swapi.dev/api/planets/?page=2',
      previous: null,
      results: [
        {
          name: 'Tatooine',
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
  });

  test('it should throw an error when the API is down', async () => {
    mocked(fetch).mockImplementation((): Promise<any> => {
      return Promise.reject('API is down');
    });

    await expect(getStarWarsPlanets()).rejects.toThrowErrorMatchingSnapshot(
      `[Error: unable to make request]`,
    );
  });
});
