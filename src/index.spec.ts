import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();
import {
  isInteger,
  toLowerCase,
  removeDuplicatesFromArray,
  createRandomProduct,
  getStarWarsPlanets,
  createProduct,
} from './index';

describe('is integer', () => {
  test("it should return false if the argument isn't a integer", () => {
    const actual1 = '123';
    const actual2 = '';
    const actual3 = null;
    const actual4 = Number.NaN;

    const expected = false;

    expect(isInteger(actual1)).toBe(expected);
    expect(isInteger(actual2)).toBe(expected);
    expect(isInteger(actual3)).toBe(expected);
    expect(isInteger(actual4)).toBe(expected);
  });
  test('it should return true if the argument is a integer', () => {
    const actual = 123;
    const expected = true;

    expect(isInteger(actual)).toBe(expected);
  });
});

describe('to lower case', () => {
  test("it should return a message 'Please provide a string'", () => {
    const expected = 'Please provide a string';

    expect(toLowerCase('')).toBe(expected);
    expect(toLowerCase(null)).toBe(expected);
  });
  test('it should convert sent string to lower case', () => {
    expect(toLowerCase('I <3 JEst')).toBe('i <3 jest');
  });
});

describe('remove duplicates from array', () => {
  test("it should return Error if argument isn't a array", () => {
    const actual: any = 123;

    const expected = Error('please provide an array of numbers or strings');

    const result = () => removeDuplicatesFromArray(actual);

    expect(result).toThrow(expected);
  });

  test('it should return same array if it just has a element', () => {
    const actual = [1];
    const expected = [1];

    const result = removeDuplicatesFromArray(actual);

    expect(result).toStrictEqual(expected);
  });

  test('it should return array without duplicated elements', () => {
    const actual = [1, 1, 2, 3, 4, 4, 4, 5];
    const expected = [1, 2, 3, 4, 5];

    const result = removeDuplicatesFromArray(actual);

    expect(result).toStrictEqual(expected);
  });
});

describe('create product', () => {
  test("it should return Error if the sent object isn't validate", () => {
    const actual1: any = {};
    const actual2 = {
      name: 'chips',
      description: 'snacks',
      price: 2.5,
      tags: ['potato', 'other'],
    };
    const result1 = () => createProduct(actual1);
    const result2 = () => createProduct(actual2);

    expect(result1).toThrow();
    expect(result2).toThrow();
  });

  test('it should return a created product with an ID', () => {
    const actual = {
      name: 'chips',
      description: 'snacks',
      price: 2.5,
      tags: ['potato'],
    };

    const result = createProduct(actual);

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('name', 'chips');
    expect(result).toHaveProperty('description', 'snacks');
    expect(result).toHaveProperty('price', 2.5);
    expect(result).toHaveProperty('tags', ['potato']);
  });
});

describe('create random product', () => {
  test("it should return Error if the sent email's user doesn' exist", () => {
    const actual = 'random@email.com';

    const result = () => createRandomProduct(actual);

    expect(result).toThrow();
  });

  test("it should return Error if the sent email's user don't has creator role", () => {
    const actual = 'bruce@wayne.com';

    const result = () => createRandomProduct(actual);

    expect(result).toThrow();
  });
  test("it should return a random product if the sent email's user has creator role", () => {
    const actual = 'clark@kent.com';

    const result = createRandomProduct(actual);

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('description');
    expect(result).toHaveProperty('price');
    expect(result).toHaveProperty('tags');
  });
});

describe('get Star Wars Planet', () => {
  test('it should return a list of planets', async () => {
    fetchMock.dontMock();

    const result = await getStarWarsPlanets();

    expect(result).toHaveProperty('count', 60);
    expect(result).toHaveProperty(
      'next',
      'https://swapi.dev/api/planets/?page=2',
    );
    expect(result).toHaveProperty('previous', null);
    expect(result).toHaveProperty('results');
  });

  test("it should return Error if there isn't internet connection", async () => {
    fetchMock.resetMocks();
    // fetchMock.mockResponseOnce(() => Promise.reject());

    const expected = new Error('unable to make request');
    await expect(getStarWarsPlanets()).rejects.toThrow(expected);

    expect(fetchMock).toHaveBeenCalledWith('https://swapi.dev/api/planets');
  });
});
