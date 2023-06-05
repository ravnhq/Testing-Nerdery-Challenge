import { faker } from '@faker-js/faker';
import {
  isInteger,
  toLowerCase,
  removeDuplicatesFromArray,
  createRandomProduct,
  getStarWarsPlanets,
  createProduct,
  Product,
} from './index';
import fetch, { Response } from 'node-fetch';
import { createProductSchema } from './utils/product.schema';
import cases from 'jest-in-case';
import { mocked } from 'ts-jest/utils';
import users from './utils/users';
import { number } from 'joi';
jest.mock('node-fetch');

function casify(obj) {
  return Object.entries(obj).map(([name, actual]) => {
    return {
      name: `${name} - ${actual}`,
      actual: actual as string,
    };
  });
}

describe('isIntenger', () => {
  cases(
    'should return true when pass a number by argument',
    (opts) => {
      const expected = true;

      const actual = isInteger(opts.actual);

      expect(actual).toEqual(expected);
    },
    {
      'argument 0': { actual: 0 },
      'argument 20': { actual: 20 },
      'argument -10': { actual: -10 },
    },
  );

  cases(
    'should return false when pass a string by argument',
    (opts) => {
      const expected = false;

      const actual = isInteger(opts.actual);

      expect(actual).toEqual(expected);
    },

    {
      "argument 'hola'": { actual: 'hola' },
      "argument '400'": { actual: ' 400' },
      "argument '-400'": { actual: '-400' },
    },
  );
});

describe('toLowerCase', () => {
  cases(
    `should return argument in lowercase`,
    (opts) => {
      const expected = opts.actual.toLowerCase();

      const actual = toLowerCase(opts.actual);

      expect(actual).toEqual(expected);
    },
    casify({
      UpperCase: 'MESSAGE CONVERT TO A LOWERCASE',
      LowerCase: 'message convert to a lowercase',
      CapitalizeEachWord: 'Message convert to a lowercase',
    }),
  );

  const expectedError: string = 'Please provide a string';
  cases(
    `throws \'${expectedError}\' when pass invalid argument`,
    (opts) => {
      const actual = toLowerCase(opts.actual as any);

      expect(actual).toBe(expectedError);
    },
    {
      'Empty string': { actual: '' },
      undefined: { actual: undefined },
      null: { actual: null },
    },
  );
});

describe('removeDuplicatesFromArray', () => {
  test('should return array without duplicate elements', () => {
    const expected = [2, 3, 4];

    const actual = removeDuplicatesFromArray([2, 2, 3, 4, 4]);

    expect(actual).toEqual(expected);
  });

  test('should return the same array for array with only one element', () => {
    const arrayWithOneElement = ['array with one element'];

    const actual = removeDuplicatesFromArray(arrayWithOneElement);

    expect(actual).toBe(arrayWithOneElement);
  });

  test('throws and error when called with a non-array argument', () => {
    const expected = new Error('please provide an array of numbers or strings');

    const actual = () => removeDuplicatesFromArray('not an array' as any);

    expect(actual).toThrow(expected);
  });
});

describe('createProduct', () => {
  test('throws an error for invalid product ', () => {
    const mockInvalidProduct = {
      name: faker.string.alpha({ length: { min: 3, max: 30 } }),
    };
    const expected =
      createProductSchema.validate(mockInvalidProduct).error?.details;

    const actual = () => createProduct(mockInvalidProduct as any);

    expect(actual).toThrowError(JSON.stringify(expected));
  });

  test('should return new product for valid argument', () => {
    const mockProduct: Product = {
      name: faker.string.alpha({ length: { min: 3, max: 30 } }),
      price: faker.number.float({ precision: 2 }),
      description: faker.string.alpha({ length: { min: 3, max: 30 } }),
      tags: [faker.commerce.productAdjective()],
    };

    const actual: Product = createProduct(mockProduct);

    expect(actual).toHaveProperty('id');
    expect(actual).toHaveProperty('name', mockProduct.name);
    expect(actual).toHaveProperty('price', mockProduct.price);
    expect(actual).toHaveProperty('description', mockProduct.description);
    expect(actual.tags).toHaveLength(mockProduct.tags.length);
  });
});

describe('createRandomProduct', () => {
  test('should return new product for authorized user', () => {
    const userWithRoleAuthorized: string = users[1].email;

    const actual: Product = createRandomProduct(userWithRoleAuthorized);

    expect(actual).toHaveProperty('id');
    expect(actual).toHaveProperty('name');
    expect(actual).toHaveProperty('price');
    expect(actual).toHaveProperty('description');
    expect(actual).toHaveProperty('tags');
  });

  test('throws an error for unathorized user', () => {
    const userWithRoleUnathorized = users[0].email;
    const expected: Error = new Error('You are not allowed to create products');

    const actual = () => createRandomProduct(userWithRoleUnathorized);

    expect(actual).toThrow(expected);
  });
});

describe('getStartWatsPlanets', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('throw error when is unable to make request', async () => {
    mocked(fetch).mockImplementation(() => Promise.reject());
    const expectedError = new Error('unable to make request');

    const actual = () => getStarWarsPlanets();

    await expect(actual).rejects.toThrow(expectedError);
  });

  test('should return correct json from api call', async () => {
    const expected = {
      count: 60,
      next: 'https://swapi.dev/api/planets/?page=2',
      previous: null,
      results: expect.any(Array),
    };
    mocked(fetch).mockImplementation((): Promise<Response> => {
      return Promise.resolve({
        json() {
          return Promise.resolve(expected);
        },
      }) as unknown as Promise<Response>;
    });

    const actual = await getStarWarsPlanets();

    expect(actual).toHaveProperty('count', 60);
    expect(actual).toHaveProperty(
      'next',
      'https://swapi.dev/api/planets/?page=2',
    );
    expect(actual).toHaveProperty('previous', null);
    expect(actual).toHaveProperty('results');
    expect(mocked(fetch)).toHaveBeenCalledTimes(1);
    expect(mocked(fetch)).toHaveBeenCalledWith('https://swapi.dev/api/planets');
  });
});
