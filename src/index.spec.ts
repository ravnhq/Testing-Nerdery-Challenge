import {
  createProduct,
  createRandomProduct,
  getStarWarsPlanets,
  isInteger,
  removeDuplicatesFromArray,
  toLowerCase,
} from './index';
import { faker } from '@faker-js/faker';
import { createTestProduct } from './test/util';
import users from './utils/users';
import fetch from 'node-fetch';

const { Response } = jest.requireActual('node-fetch');
jest.mock('node-fetch');

beforeEach(() => {
  jest.resetAllMocks();
});

describe('Integer validation', () => {
  const integerValues = [[1], [-1], [12451], [34566]];
  test.each(integerValues)('returns true with integer %p', (value) => {
    expect(isInteger(value)).toBe(true);
  });

  const stringValues = [['1'], ['-1'], ['ab'], ['123.3']];
  test.each(stringValues)('returns false with string value %p', (value) => {
    expect(isInteger(value)).toBe(false);
  });

  const decimalValues = [[12.3], [-3.4], [0.999]];
  test.each(decimalValues)('returns false with decimal %p', (value) => {
    expect(isInteger(value)).toBe(false);
  });
});

describe('String to lowercase', () => {
  test('fails with empty string', () => {
    expect(toLowerCase('')).toMatchInlineSnapshot(`"Please provide a string"`);
  });

  const validStringCases = [
    ['HELLO', 'hello'],
    ['ByE', 'bye'],
    ['123', '123'],
    ['abc!de', 'abc!de'],
  ];
  test.each(validStringCases)(
    'works with valid string value %p',
    (value: string, expected: string) => {
      expect(toLowerCase(value)).toBe(expected);
    },
  );
});

describe('Remove duplicates from array', () => {
  test('returns empty array when an empty array is received', () => {
    const result = removeDuplicatesFromArray([]);
    expect(result).toEqual([]);
  });

  const intArrayCases = [
    [[1], [1]],
    [[1, 1], [1]],
    [
      [1, 2, 2, 3, 3],
      [1, 2, 3],
    ],
  ];
  test.each(intArrayCases)('works with int array %p', (array, expected) => {
    expect(removeDuplicatesFromArray(array)).toEqual(expected);
  });

  const stringArrayCases = [
    [['a'], ['a']],
    [['a', 'a'], ['a']],
    [
      ['a', 'b', 'b', 'c', 'c'],
      ['a', 'b', 'c'],
    ],
  ];
  test.each(stringArrayCases)(
    'works with string array %p',
    (array, expected) => {
      expect(removeDuplicatesFromArray(array)).toEqual(expected);
    },
  );
});

describe('create product', () => {
  test('returns the product with its id replaced', () => {
    const product = createTestProduct();
    const updated = createProduct(product);

    expect(product.id).not.toBe(updated.id);
  });

  const productNameOverrides = [[''], ['!%!'], [faker.random.alphaNumeric(31)]];
  test.each(productNameOverrides)(
    'throws an error with invalid product name %p',
    (name) => {
      const product = createTestProduct({ name });
      expect(() => createProduct(product)).toThrow();
    },
  );

  const productDescOverrides = [[''], [faker.random.alphaNumeric(31)]];
  test.each(productDescOverrides)(
    'throws an error with invalid product description %p',
    (description) => {
      const product = createTestProduct({ description });
      expect(() => createProduct(product)).toThrow();
    },
  );

  const productPriceOverrides = [[-10], [-1.453]];
  test.each(productPriceOverrides)(
    'throws an error with with invalid product price %p',
    (price) => {
      const product = createTestProduct({ price });
      expect(() => createProduct(product)).toThrow();
    },
  );

  const productTagsOverrides = [[[]], [['tag1', 'tag2']]];
  test.each(productTagsOverrides)(
    'throws an error with invalid product tags %p',
    (tags: string[]) => {
      const product = createTestProduct({ tags });
      expect(() => createProduct(product)).toThrow();
    },
  );
});

describe('create random product', () => {
  test('fails if no user exists with the provided email', () => {
    const email = 'unperson@users.com';
    expect(() => createRandomProduct(email)).toThrowErrorMatchingInlineSnapshot(
      `"You are not allowed to create products"`,
    );
  });

  test("fails if user doesn't have the creator role", () => {
    const email = users.find((it) => it.role !== 'creator')!!.email;
    expect(() => createRandomProduct(email)).toThrowErrorMatchingInlineSnapshot(
      `"You are not allowed to create products"`,
    );
  });

  test('returns a new product when user is a creator', () => {
    const email = users.find((it) => it.role === 'creator')!!.email;
    const product = createRandomProduct(email);

    expect(product.id).toBeDefined();
    expect(product.name).toBeDefined();
    expect(product.description).toBeDefined();
    expect(product.tags).toBeDefined();
    expect(product.price).toBeDefined();
  });
});

describe('getting Star Wars planets', () => {
  const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;

  test('works when response successfully returns a JSON', async () => {
    const jsonBody = {};
    const body = JSON.stringify(jsonBody);
    const response = new Response(body, { status: 200 });
    mockedFetch.mockResolvedValueOnce(response);

    const receivedJson = await getStarWarsPlanets();

    expect(receivedJson).toEqual(jsonBody);
    expect(mockedFetch).toHaveBeenCalledTimes(1);
    expect(mockedFetch).toHaveBeenCalledWith('https://swapi.dev/api/planets');
  });

  test('throws an error when response fails for HTTP error', async () => {
    const response = new Response('', { status: 400 });
    mockedFetch.mockResolvedValueOnce(response);

    await expect(() => getStarWarsPlanets()).rejects.toMatchInlineSnapshot(
      `[Error: unable to make request]`,
    );
  });

  test('throws an error if received contents are not valid JSON', async () => {
    const response = new Response('hello', { status: 200 });
    mockedFetch.mockResolvedValueOnce(response);

    await expect(() => getStarWarsPlanets()).rejects.toMatchInlineSnapshot(
      `[Error: unable to make request]`,
    );
  });
});
