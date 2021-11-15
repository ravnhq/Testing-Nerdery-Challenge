import {
  isInteger,
  toLowerCase,
  removeDuplicatesFromArray,
  createRandomProduct,
  getStarWarsPlanets,
  createProduct,
} from './index';

import products from './utils/products';
import cases from 'jest-in-case';
import faker from 'faker';
import fetch from 'node-fetch';
import { mocked } from 'ts-jest/utils';

jest.mock('node-fetch', () => {
  return jest.fn();
});

beforeEach(() => {
  mocked(fetch).mockReset();
});

function casify(expected, obj) {
  return Object.entries(obj).map(([description, parameter]) => ({
    name: `should return ${expected} when  we pass ${description}`,
    parameter,
  }));
}

cases(
  'isInteger: valid integers',
  ({ parameter }) => {
    expect(isInteger(parameter)).toBe(true);
  },
  casify(true, {
    'a Number': 123,
    'a big number': 12345678901234567890,
    'a negative number': -234,
    'a scientific notation number': 1.1e43,
  }),
);

cases(
  'isInteger: invalid integers',
  ({ parameter }) => {
    expect(isInteger(parameter)).toBe(false);
  },
  casify(false, {
    'a string literal': 'one',
    'a flotating number': '12.5',
    'a Nan value': NaN,
  }),
);

describe('tolowerCase', () => {
  it('should return a lowercase string when we pass full lowercase string', async () => {
    const input = 'lowercase';
    const expected = 'lowercase';

    expect(toLowerCase(input)).toBe<string>(expected);
  });

  it('should return a lowercase string when we pass full uppercase string', async () => {
    const input = 'UPPERCASE';
    const expected = 'uppercase';

    expect(toLowerCase(input)).toBe<string>(expected);
  });

  it('should return a lowercase string when we pass mixed case string', async () => {
    const input = 'mixedCase';
    const expected = 'mixedcase';

    expect(toLowerCase(input)).toBe<string>(expected);
  });

  it('should return default message when we pass an empty string', async () => {
    const input = 'lowercase';
    const expected = 'lowercase';

    expect(toLowerCase('')).toMatchInlineSnapshot(`"Please provide a string"`);
  });
});

describe('removeDuplicatesFromArray', () => {
  it('should return same array', async () => {
    const input: number[] = [2, 3, 4, 5];
    const expected: number[] = [2, 3, 4, 5];

    expect(removeDuplicatesFromArray(input)).toStrictEqual(expected);
  });

  it('should return a single element when all entries are the same', async () => {
    const input: number[] = [1, 1, 1, 1, 1];
    const expected: number[] = [1];

    expect(removeDuplicatesFromArray(input)).toStrictEqual(expected);
  });

  it('should remove a duplicate number', async () => {
    const input: number[] = [1, 2, 3, 4, 2];
    const expected: number[] = [1, 2, 3, 4];

    expect(removeDuplicatesFromArray(input)).toStrictEqual(expected);
  });

  it('should remove nothing when we pass an empty array', async () => {
    const input: number[] = [];
    const expected: number[] = [];

    expect(removeDuplicatesFromArray(input)).toStrictEqual(expected);
  });

  it('should remove nothing when we pass a single entry', async () => {
    const input: number[] = [3];
    const expected: number[] = [3];

    expect(removeDuplicatesFromArray(input)).toStrictEqual(expected);
  });

  it('should remove nothing when we pass a single entry string ', async () => {
    const input: string[] = ['str'];
    const expected: string[] = ['str'];

    expect(removeDuplicatesFromArray(input)).toStrictEqual(expected);
  });

  it('should remove duplicates when we pass an array of string', async () => {
    const input: string[] = ['one', 'two', 'two', 'three'];
    const expected: string[] = ['one', 'two', 'three'];

    expect(removeDuplicatesFromArray(input)).toStrictEqual(expected);
  });

  it('should throws an exception when the input is not an array', async () => {
    const input = {};

    expect(() =>
      removeDuplicatesFromArray(input as any),
    ).toThrowErrorMatchingInlineSnapshot(
      `"please provide an array of numbers or strings"`,
    );
  });
});

describe('createRandomProducts', () => {
  it('should return a random product', async () => {
    const creatorEmail = 'clark@kent.com';

    expect(createRandomProduct(creatorEmail)).not.toBeNull();
  });

  it("should throw an exception for 'non creator' role", async () => {
    const nonCreatorEmail = 'bruce@wayne.com';

    expect(() =>
      createRandomProduct(nonCreatorEmail),
    ).toThrowErrorMatchingInlineSnapshot(
      `"You are not allowed to create products"`,
    );
  });

  it('should throw an exception when the role roles is undefined', async () => {
    const invalidEmail = 'invalid@email.com';

    expect(() =>
      createRandomProduct(invalidEmail),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Cannot read properties of undefined (reading 'role')"`,
    );
  });
});

describe('createProduct', () => {
  const validProduct = {
    name: 'productA',
    description: 'a product',
    tags: ['tag'],
    price: 0.01,
  };

  it('should return a vallid Product', async () => {
    expect(createProduct(validProduct)).toEqual({
      id: expect.any(Number),
      ...validProduct,
    });
  });

  it('should throw an exception for invalid name', async () => {
    const invalidProduct = validProduct;
    invalidProduct.name = 'invalid product';

    expect(() => createProduct(invalidProduct)).toThrowErrorMatchingSnapshot();
  });

  it('should throw an exception for invalid description', async () => {
    const invalidProduct = validProduct;
    invalidProduct.name =
      'the description of this products is too long, so this will be an invalid product';

    expect(() => createProduct(invalidProduct)).toThrowErrorMatchingSnapshot();
  });

  it('should throw an exception for invalid tags', async () => {
    const invalidProduct = validProduct;
    invalidProduct.tags = [];

    expect(() => createProduct(invalidProduct)).toThrowErrorMatchingSnapshot();
  });

  it('should throw an exception for invalid price', async () => {
    const invalidProduct = validProduct;
    invalidProduct.price = 0.1;

    expect(() => createProduct(invalidProduct)).toThrowErrorMatchingSnapshot();
  });
});

describe('getStarWarsPlanets', () => {
  it('should return a json object', async () => {
    const mockFetchResult = {
      count: 1,
      results: [
        {
          name: 'Tatooine',
        },
      ],
    };
    mocked(fetch).mockImplementation(
      (): Promise<any> =>
        Promise.resolve({
          json: () => Promise.resolve(mockFetchResult),
        }),
    );
    const json = await getStarWarsPlanets();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('https://swapi.dev/api/planets');
    expect(Array.isArray(json)).toEqual(false);
  });

  it('should throw an exception', async () => {
    mocked(fetch).mockImplementation((): Promise<any> => {
      throw 'error';
    });

    await expect(
      getStarWarsPlanets(),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`"unable to make request"`);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('https://swapi.dev/api/planets');
  });
});
