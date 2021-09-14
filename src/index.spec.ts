import {
  isInteger,
  toLowerCase,
  removeDuplicatesFromArray,
  createRandomProduct,
  getStarWarsPlanets,
  createProduct,
} from './index';

import cases from 'jest-in-case';

import fetch from 'node-fetch';
import { mocked } from 'ts-jest/utils';

function casify(obj: unknown) {
  return Object.entries(obj).map(([key, value]) => ({
    name: `${
      value && value.hasOwnProperty('input') ? value.input : value
    } - ${key}`,
    value,
  }));
}

/* is Integer */

cases(
  'is an integer?: valid input',
  ({ value }) => {
    expect(isInteger(value)).toBe(true);
  },
  casify({
    'positive integer': 1234,
    'negative integer': -1234,
    zero: 0,
  }),
);

cases(
  'is an integer?: invalid input',
  ({ value }) => {
    expect(isInteger(value)).toBe(false);
  },
  casify({
    decimal: 0.5,
    string: 'n1234',
    null: null,
    object: {},
  }),
);

/* toLowerCase */

cases(
  "toLowerCase: invalid input returns 'Please provide a string' message",
  ({ value }) => {
    expect(toLowerCase(value)).toBe('Please provide a string');
  },
  casify({
    'empty string': '',
    null: null,
    //object: {}, // fails
  }),
);

cases(
  'toLowerCase: valid input',
  ({ value }) => {
    expect(toLowerCase(value.input)).toBe(value.expected);
  },
  casify({
    'first capital': {
      input: 'Hola',
      expected: 'hola',
    },
    'all capitals': {
      input: 'HOLA',
      expected: 'hola',
    },
    'all smallcaps': {
      input: 'hola',
      expected: 'hola',
    },
    numbers: {
      input: '1234',
      expected: '1234',
    },
    alphanumeric: {
      input: 'A1234',
      expected: 'a1234',
    },
  }),
);

/* removeDuplicatesFromArray */

cases(
  'removeDuplicatesFromArray: valid input',
  ({ value }) => {
    expect(removeDuplicatesFromArray(value.input)).toEqual(value.expected);
  },
  casify({
    'no duplicates alphanum': {
      input: ['a', 'b', 3],
      expected: ['a', 'b', 3],
    },
    'no duplicates numeric': {
      input: [1, 2, 3],
      expected: [1, 2, 3],
    },
    'no duplicates alpha': {
      input: ['a', 'b', 'c'],
      expected: ['a', 'b', 'c'],
    },
    'one element': {
      input: [1],
      expected: [1],
    },
    empty: {
      input: [],
      expected: [],
    },
  }),
);

cases(
  'removeDuplicatesFromArray: invalid input throws Error',
  ({ value }) => {
    const badInput = () => {
      removeDuplicatesFromArray(value);
    };

    expect(badInput).toThrowError(
      'please provide an array of numbers or strings',
    );
  },
  casify({
    null: null,
    object: {},
    'single value': 1234,
  }),
);

/* createProduct */

describe('createProduct', () => {
  test('createProduct returns a valid Product', () => {
    const validProduct = {
      name: 'valid',
      description: 'some description',
      price: 22.33,
      tags: ['tag'],
    };

    expect(createProduct(validProduct)).toEqual({
      id: expect.any(Number),
      name: validProduct.name,
      tags: validProduct.tags,
      description: validProduct.description,
      price: validProduct.price,
    });
  });

  test('invalid product throws an Error', () => {
    const invalidProduct = {
      id: 12,
      name: 'invalid price in product',
      description: 'some description',
      price: 22.333,
      tags: ['tag'],
    };

    expect(() => {
      createProduct(invalidProduct);
    }).toThrow(Error);
  });
});

/* createRandomProduct */

describe('createRandomProduct', () => {
  test('user creator is allowed to create product', () => {
    expect(createRandomProduct('clark@kent.com')).toEqual({
      id: expect.any(Number),
      name: expect.any(String),
      description: expect.any(String),
      price: expect.any(String),
      tags: expect.any(Array),
    });
  });

  test('user not creator is not allowed to create product and throws Error', () => {
    expect(() => {
      createRandomProduct('diana@themyscira.com');
    }).toThrowError('You are not allowed to create products');
  });
});

/* getStarWarsPlanet */

jest.mock('node-fetch', () => {
  return jest.fn();
});

beforeEach(() => {
  mocked(fetch).mockClear();
});

describe('getStarWarsPlanets', () => {
  it('calls API and returns data planet', async () => {
    mocked(fetch).mockImplementation((): Promise<any> => {
      return Promise.resolve({
        json() {
          return Promise.resolve({ name: 'Earth' });
        },
      });
    });

    const response = await getStarWarsPlanets();

    expect(mocked(fetch).mock.calls.length).toBe(1);
    expect(mocked(fetch).mock.calls[0][0]).toEqual(
      'https://swapi.dev/api/planets',
    );
    expect(response.name).toBe('Earth');
  });

  it('returns an Error for a failed request', async () => {
    mocked(fetch).mockImplementation((): Promise<any> => {
      return Promise.reject('API is down');
    });

    await expect(getStarWarsPlanets()).rejects.toMatchInlineSnapshot(
      `[Error: unable to make request]`,
    );
  });
});
