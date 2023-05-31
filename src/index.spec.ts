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
import { createProductSchema } from './utils/product.schema';

jest.mock('node-fetch');

describe('isIntegerTest', () => {
  test('isInteger function with an integer parameter should return true', () => {
    const parameter: number = 4;
    const expected: boolean = true;

    const result = isInteger(parameter);

    expect(result).toBe(expected);
  });
  test('isInteger function with a non integer parameter should return false', () => {
    const parameter: string = '4';
    const expected: boolean = false;

    const result: boolean = isInteger(parameter);

    expect(result).toBe(expected);
  });
});

describe('toLowerCaseTest', () => {
  test('toLowerCase function with a string parameter should return the parameter in lowercase', () => {
    const parameter: string = 'SOMETHING';
    const expected: string = parameter.toLowerCase();

    const result: string = toLowerCase(parameter);

    expect(result).toBe(expected);
  });
  test('toLowerCase function with null as parameter should return a message', () => {
    const parameter: any = null;
    const expected: string = 'Please provide a string';

    const result: string = toLowerCase(parameter);

    expect(result).toBe(expected);
  });
});

describe('removeDuplicatesFromArrayTest', () => {
  test('removeDuplicatesFromArrayTest function with a non array parameter should throw an error', () => {
    const parameter: any = 'something';

    expect(() => removeDuplicatesFromArray(parameter)).toThrowError(
      Error('please provide an array of numbers or strings'),
    );
  });
  test('removeDuplicatesFromArrayTest function with an array of a unique element as parameter should return the same array', () => {
    const parameter: number[] = [3];
    const expected: number[] = [3];

    const result: (string | number)[] = removeDuplicatesFromArray(parameter);

    expect(result).toEqual(expected);
  });
  test('removeDuplicateFromArrayTest function with an array of strings as parameter should return the array without duplicates', () => {
    const parameter: string[] = ['one', 'two', 'three', 'two'];
    const expected: string[] = ['one', 'two', 'three'];

    const result: (string | number)[] = removeDuplicatesFromArray(parameter);

    expect(result).toEqual(expected);
  });
  test('removeDuplicateFromArrayTest function with an array of numbers as parameter should return the array without duplicates', () => {
    const parameter: number[] = [1, 2, 3, 2];
    const expected: number[] = [1, 2, 3];

    const result: (string | number)[] = removeDuplicatesFromArray(parameter);

    expect(result).toEqual(expected);
  });
});

describe('createRandomProductTest', () => {
  test('createRandomProduct function should throw an error when the user role is not allowed to create products', () => {
    const email: string = 'bruce@wayne.com';

    const result: () => unknown = () => {
      createRandomProduct(email);
    };

    expect(result).toThrowError(
      Error('You are not allowed to create products'),
    );
  });
  cases(
    'createRandomProduct function should return a fake product with its properties',
    (options) => {
      const email: string = 'clark@kent.com';

      const result = createRandomProduct(email);

      expect(result).toHaveProperty(options.property);
    },
    {
      'product has id property': { property: 'id' },
      'product has name property': { property: 'name' },
      'product has description property': { property: 'description' },
      'product has price property': { property: 'price' },
      'product has tags property': { property: 'tags' },
    },
  );
});

describe('getStarWarsPlanetsTest', () => {
  test('getStarWarsPlanets should return the fetched data', async () => {
    const data = { planets: ['Tatooine', 'Alderaan', 'Naboo'] };
    const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;
    mockedFetch.mockImplementation(
      (): Promise<any> =>
        Promise.resolve({
          json: () => Promise.resolve(data),
        }),
    );

    const result = await getStarWarsPlanets();

    expect(result).toEqual(data);
  });
  test('getStarWarsPlanets should throw an error when the API call fails', async () => {
    const errorMessageExpected = 'unable to make request';
    const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;
    mockedFetch.mockImplementationOnce(() => Promise.reject());

    const response = () => getStarWarsPlanets();

    await expect(response).rejects.toThrow(errorMessageExpected);
  });
});

describe('createProductTest', () => {
  test('createProduct should throw an error when the object parameter is not valid', () => {
    const product: any = {};
    const expected = createProductSchema.validate(product);

    const result = () => createProduct(product);

    expect(result).toThrowError(JSON.stringify(expected.error.details));
  });
  test('createProduct should return the object parameter with an id added', () => {
    const product = {
      name: 'product',
      description: 'description',
      price: 20.0,
      tags: ['blue'],
    };

    const result = createProduct(product);

    expect(result).toMatchObject({
      ...product,
      id: expect.any(Number),
    });
  });
});
