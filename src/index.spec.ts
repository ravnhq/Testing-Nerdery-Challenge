import {
  isInteger,
  toLowerCase,
  removeDuplicatesFromArray,
  createRandomProduct,
  getStarWarsPlanets,
  createProduct,
} from './index';

import fetch from 'node-fetch';

describe('Test isInteger() function', () => {
  test('Should return true', () => {
    expect(isInteger(123)).toBe(true);
  });

  test('Should return false', () => {
    expect(isInteger('str')).toBe(false);
  });
});

describe('Test toLowerCase() function', () => {
  test('Should return a string in lowercase', () => {
    expect(toLowerCase('sTrInGyWoRd')).toEqual('stringyword');
  });

  test('Should return an error message', () => {
    expect(toLowerCase('')).toBe('Please provide a string');
  });
});

describe('Test removeDuplicatesFromArray() function', () => {
  test('Should return an error', () => {
    expect(() => removeDuplicatesFromArray(null as any)).toThrowError();
  });

  test('Should return the same array when length is 1', () => {
    expect(removeDuplicatesFromArray(['stringArray'])).toEqual(['stringArray']);
  });

  test('Should return the array without duplicates', () => {
    expect(removeDuplicatesFromArray([1, 1, 2, 1, 3])).toEqual([1, 2, 3]);
  });
});

describe('Test createProduct() function', () => {
  test('Should return an error', () => {
    expect(() =>
      createProduct({
        name: 'Eleanore IV',
        description: 'Imported Odorant Cologne',
        price: 140.21,
        tags: ['odorant'],
      }),
    ).toThrowError();
  });

  test('Should return the same product with an added id', () => {
    expect(
      createProduct({
        name: 'EleanoreIV',
        description: 'Imported Odorant Cologne',
        price: 140.21,
        tags: ['odorant'],
      }),
    ).toHaveProperty('id');
  });
});

describe('Test createRandomProduct() function', () => {
  test("Should throw error when email doesn't exist", () => {
    expect(() => createRandomProduct('test@test.com')).toThrowError();
  });

  test('Should throw error when user is not a creator', () => {
    expect(() => createRandomProduct('bruce@wayne.com')).toThrowError();
    expect(() => createRandomProduct('diana@themyscira.com')).toThrowError();
  });

  test('Should return a random product', () => {
    const randomProduct = createRandomProduct('clark@kent.com');
    expect(randomProduct).toHaveProperty('id');
    expect(randomProduct).toHaveProperty('name');
    expect(randomProduct).toHaveProperty('description');
    expect(randomProduct).toHaveProperty('price');
    expect(randomProduct).toHaveProperty('tags');
  });
});

jest.mock('node-fetch');
describe('Test getStarWarsPlanets() function', () => {
  test('Should fetch a response eeven without internet', async () => {
    const mock = fetch as jest.MockedFunction<typeof fetch>;
    mock.mockImplementationOnce(
      (): Promise<any> =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              count: 60,
              next: 'https://swapi.dev/api/planets/?page=2',
              previous: null,
              results: [],
            }),
        }),
    );

    const response = await getStarWarsPlanets();
    expect(response).toHaveProperty('count');
    expect(response).toHaveProperty('next');
    expect(response).toHaveProperty('previous');
    expect(response).toHaveProperty('results');
  });

  test('Should throw an error if the fetch fails', async () => {
    expect(getStarWarsPlanets()).rejects.toThrow('unable to make request');
  });
});
