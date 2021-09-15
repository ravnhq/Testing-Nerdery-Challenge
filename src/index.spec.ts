import {
  isInteger,
  toLowerCase,
  removeDuplicatesFromArray,
  createRandomProduct,
  getStarWarsPlanets,
  createProduct,
} from './index';

import planets from './utils/planets';
import { mocked } from 'ts-jest/utils';
import fetch from 'node-fetch';

jest.mock('node-fetch', () => jest.fn());

describe('Get Star Wars Planets', () => {
  it('it must throw an error if something fails', async () => {
    mocked(fetch).mockImplementation((): Promise<any> => {
      return Promise.resolve({
        json: () => Promise.reject(),
      });
    });

    expect(async () => {
      const data = await getStarWarsPlanets();
      console.log(data);
    }).rejects.toThrow();
  });

  it('must fetches all the planets', async () => {
    mocked(fetch).mockClear();
    mocked(fetch).mockImplementation((): Promise<any> => {
      return Promise.resolve({
        json() {
          return Promise.resolve({
            count: 60,
            next: 'https://swapi.dev/api/planets/?page=2',
            previous: null,
            results: [
              {
                name: 'Tatooine',
                climate: 'arid',
              },
              {
                name: 'Alderaan',
                climate: 'temperate',
              },
              {
                name: 'Yavin IV',
                climate: 'temperate, tropical',
              },
              {
                name: 'Hoth',
                climate: 'frozen',
              },
              {
                name: 'Dagobah',
                climate: 'murky',
              },
            ],
          });
        },
      });
    });

    const data = await getStarWarsPlanets();

    expect(data).toEqual(planets);
  });
});

describe('Create random Product', () => {
  it('must create a prodcut if the user have the permisions', () => {
    expect(createRandomProduct('clark@kent.com')).toEqual({
      id: expect.any(Number),
      name: expect.any(String),
      description: expect.any(String),
      price: expect.any(String),
      tags: expect.any(Array),
    });
  });

  it('must trhow an error if the user dont have the permisions', () => {
    expect(() => {
      createRandomProduct('bruce@wayne.com');
    }).toThrow();
  });
});

describe('Create product', () => {
  it('Must throw an error if called with a null value', () => {
    expect(() => createProduct(null)).toThrowError();
  });

  it('Must pass if called with no idProduct', () => {
    const product = {
      name: 'HyS',
      description: 'The best shampoo',
      price: 9.99,
      tags: ['Shampoo'],
    };

    expect(createProduct(product)).toHaveProperty('id');
  });

  it('must throw an error if ID is defined', () => {
    const productWithID = {
      id: 12,
      name: 'HyS',
      description: 'The best shampoo',
      price: 9.99,
      tags: ['Shampoo'],
    };

    expect(() => createProduct(productWithID)).toThrow();
  });
});

describe('is Integer()', () => {
  it('a positive integer must return true', () => {
    expect(isInteger(12)).toBe(true);
  });

  it('a negative integer must return true', () => {
    expect(isInteger(-12)).toBe(true);
  });

  it('a string must return false', () => {
    expect(isInteger('12')).toBe(false);
  });

  it('a double must return false', () => {
    expect(isInteger(12.2)).toBe(false);
  });

  it('an undefined value must return false', () => {
    expect(isInteger(undefined)).toBe(false);
  });

  it('a null vaule must return false', () => {
    expect(isInteger(null)).toBe(false);
  });
});

describe('ToLowerCase function', () => {
  const rejectMessage = 'Please provide a string';
  it('an uppercase text mus return the same text in lowercase', () => {
    expect(toLowerCase('HELLO')).toEqual('hello');
  });

  it('a lower case text must return the same text', () => {
    expect(toLowerCase('hello')).toEqual('hello');
  });

  it('a null value must return a error message', () => {
    expect(toLowerCase(null)).toEqual(rejectMessage);
  });

  it('an empty string must return a error message', () => {
    expect(toLowerCase('')).toEqual(rejectMessage);
  });
});

describe('Remove duplicates from Array function', () => {
  const array = [1, 2, 3, 3, 4, 'foo', 'foo'];
  const arrayRemoveDuplicates = [1, 2, 3, 4, 'foo'];

  it('a non array must throw an exception', () => {
    expect(() => {
      removeDuplicatesFromArray(null);
    }).toThrowError('please provide an array of numbers or strings');
  });

  it('an array with one element must return the same array', () => {
    expect(removeDuplicatesFromArray(['foo'])).toEqual(['foo']);
  });

  it('an array with repeat elements must return the same array without the duplicate items', () => {});
  expect(removeDuplicatesFromArray(array)).toEqual(arrayRemoveDuplicates);
});
