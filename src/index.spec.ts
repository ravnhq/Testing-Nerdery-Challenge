import cases from 'jest-in-case';
import fetch from 'node-fetch';
import { mocked } from 'ts-jest/utils';
import {
  isInteger,
  toLowerCase,
  removeDuplicatesFromArray,
  createRandomProduct,
  getStarWarsPlanets,
  createProduct,
} from './index';

jest.mock('node-fetch', () => jest.fn());

describe('isInteger', () => {
  cases(
    'should return',
    (opts) => {
      expect(isInteger(opts.actual)).toBe(opts.expected);
    },
    [
      { name: 'true evaluating a number', actual: 123, expected: true },
      {
        name: 'true evaluating a negative number',
        actual: -123,
        expected: true,
      },
      { name: 'false evaluating a string', actual: '1', expected: false },
      { name: 'false evaluating a float', actual: 1.25, expected: false },
    ],
  );
});

describe('toLowerCase', () => {
  cases(
    `should return`,
    (opts) => {
      expect(toLowerCase(opts.actual)).toEqual(opts.expected);
    },
    [
      {
        name: 'prueba when PrueBa is given',
        actual: 'PrueBa',
        expected: 'prueba',
      },
      {
        name: 'the same string when a lowercase string is given',
        actual: 'lowercase',
        expected: 'lowercase',
      },
      {
        name: 'return error when passing null or an empty string',
        actual: null,
        expected: 'Please provide a string',
      },
    ],
  );
});

describe('removeDuplicatesFromArray', () => {
  cases(
    `should return`,
    (opts) => {
      expect(removeDuplicatesFromArray(opts.actual)).toStrictEqual(
        opts.expected,
      );
    },
    [
      {
        name: '[1,2,3] when [1,2,2,3,1] is evaluated',
        actual: [1, 2, 2, 3, 1],
        expected: [1, 2, 3],
      },
      {
        name: `['1','2','3'] when ['1','2','2','3','1'] is evaluated`,
        actual: ['1', '2', '2', '3', '1'],
        expected: ['1', '2', '3'],
      },
      {
        name: 'the same array when the array only has one element',
        actual: ['one'],
        expected: ['one'],
      },
    ],
  );

  cases(
    'should throw an error',
    (opts) => {
      expect(() => removeDuplicatesFromArray(opts.actual as any)).toThrowError(
        opts.expected,
      );
    },
    [
      {
        name: 'when there is no an array given',
        actual: {},
        expected: 'please provide an array of numbers or strings',
      },
    ],
  );
});

describe('createRandomProduct', () => {
  it('should return a random product when giving a creator role email', () => {
    const creatorEmail = 'clark@kent.com';
    const actual = createRandomProduct(creatorEmail);
    expect(actual).not.toBeNull();
  });

  it('should throw an error when user does not have creator role', () => {
    const noCreatorUser = 'diana@themyscira.com';
    expect(() => createRandomProduct(noCreatorUser)).toThrowError(
      'You are not allowed to create products',
    );
  });

  it('should throw an error when passing an invalid email', () => {
    const invalidEmail = 'invalidemail@fake.com';
    expect(() =>
      createRandomProduct(invalidEmail),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Cannot read properties of undefined (reading 'role')"`,
    );
  });
});

describe('createProduct', () => {
  const testProduct = {
    name: 'motorcycle',
    description: 'arch motorcycle',
    price: 1000,
    tags: ['at least one'],
  };

  it('should return a valid product', () => {
    const actual = createProduct(testProduct);

    expect(actual).toEqual({
      id: expect.any(Number),
      ...testProduct,
    });
  });

  it('should throw an error whit a bad forming object', () => {
    const invalidProduct = testProduct;
    invalidProduct.tags = [];

    expect(() => createProduct(invalidProduct)).toThrowError();
  });
});

describe('getStarWarsPlanets', () => {
  it('should throw an error if something goes wrong', () => {
    mocked(fetch).mockImplementation((): Promise<any> => {
      return Promise.resolve({
        json: () => Promise.reject()
      });
    });

    expect(
      async () => await getStarWarsPlanets()
    ).rejects.toThrow();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('https://swapi.dev/api/planets');
  });

  it('should fetch data from api', () => {
    mocked(fetch).mockImplementation((): Promise<any> => {
      return Promise.resolve({
        json: Promise.resolve({}),
      });
    });

    const response = async () => await getStarWarsPlanets();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('https://swapi.dev/api/planets');
    expect(Array.isArray(response)).toEqual(false);
  });
});
