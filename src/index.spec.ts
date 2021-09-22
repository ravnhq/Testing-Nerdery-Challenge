import { enableFetchMocks } from 'jest-fetch-mock';
import fetchMock from 'jest-fetch-mock';
enableFetchMocks();
import {
  isInteger,
  toLowerCase,
  removeDuplicatesFromArray,
  createRandomProduct,
  getStarWarsPlanets,
  createProduct,
} from './index';

describe('isInteger', () => {

  it('should return true with positive number', () => {
    expect(isInteger(1)).toEqual(true);
  });

  it('should return true with negative number', () => {
    expect(isInteger(-1)).toEqual(true);
  });

  it('should return false with string', () => {
    expect(isInteger('1')).toEqual(false);
  });

  it('should return false with decimal', () => {
    expect(isInteger(1.2)).toEqual(false);
  });

  it('should return false with NaN', () => {
    expect(isInteger(NaN)).toEqual(false);
  });
});

describe('toLowerCase', () => {

  it('should return the same string', () => {
    expect(toLowerCase('a')).toMatch(/a/);
  });

  it('should return a lowercase letter', () => {
    expect(toLowerCase('A')).toMatch(/a/);
  });

  it('should return a lowercase phrase', () => {
    expect(toLowerCase('This is Testing')).toMatch(/this is testing/);
  });

  it('should return an error message', () => {
    expect(toLowerCase(undefined)).toBe('Please provide a string');
  });
});

describe('removeDuplicatesFromArray', () => {

  it('should return the same array if it has a length of 1', () => {
    expect(removeDuplicatesFromArray([1])).toEqual([1]);
  });

  it('should return the same array if there are no duplicates', () => {
    expect(removeDuplicatesFromArray([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
  });

  it('should remove the repeated element of the array', () => {
    expect(removeDuplicatesFromArray([1, 2, 3, 4, 4, 5])).toEqual([
      1, 2, 3, 4, 5,
    ]);
  });

  it('should remove all the repeated elements of the array', () => {
    expect(removeDuplicatesFromArray([1, '4', '4', '4', 5, 5])).toEqual([
      1,
      '4',
      5,
    ]);
  });

  it('should return an error message', () => {
    expect(() => removeDuplicatesFromArray(undefined)).toThrowError(
      'please provide an array of numbers or strings',
    );
  });
});

const products = [
  {
    name: 'egg',
    tags: ['dairy'],
    description: 'Raw organic brown eggs',
    price: 28.1,
  },
  {
    id: 2,
    name: 'Sweet fresh stawberry',
    tags: ['fruit', 'red'],
    description: 'Sweet fresh stawberry on the wooden table',
    price: 29.45,
  },
];

describe('createProduct', () => {

  it('should return a product', () => {
    expect(createProduct(products[0])).toEqual({
      id: expect.any(Number),
      name: 'egg',
      tags: ['dairy'],
      description: 'Raw organic brown eggs',
      price: 28.1,
    });
  });

  it('should throw an error when schema is not valid', () => {
    expect(() => createProduct(products[1])).toThrow(Error);
  });
});

const fakeProduct = {
  id: expect.any(Number),
  name: expect.any(String),
  tags: [expect.any(String), expect.any(String)],
  description: expect.any(String),
  price: expect.any(String),
};


describe('createRandomProduct', () => {

  it('should return a fake product', () => {
    expect(createRandomProduct('clark@kent.com')).toMatchObject(fakeProduct);
  });

  it('should return an error message', () => {
    expect(() => createRandomProduct('bruce@wayne.com')).toThrow(
      new Error('You are not allowed to create products'),
    );
  });
});

const expectedResponse = {
  count: 60,
  next: 'https://swapi.dev/api/planets/?page=2',
  previous: null,
  results: expect.any(Array),
};

const mockedResponse = {
  json: () =>
    Promise.resolve({
      count: 60,
      next: 'https://swapi.dev/api/planets/?page=2',
      previous: null,
      results: [
        {
          name: 'Geonosis',
          rotation_period: '30',
          orbital_period: '256',
          diameter: '11370',
          climate: 'temperate, arid',
          gravity: '0.9 standard',
          terrain: 'rock, desert, mountain, barren',
          surface_water: '5',
        },
      ],
    }),
};

describe('getStarWarsPlanets', () => {

  fetchMock.mockResolvedValueOnce(Promise.resolve(mockedResponse) as any);
  it('should return the star wars planets', async () => {
    const response = await getStarWarsPlanets();
    expect(response).toMatchObject(mockedResponse.json())
    expect(fetchMock).toHaveBeenCalledWith('https://swapi.dev/api/planets');
  });

  fetchMock.mockRejectedValueOnce(Promise.reject());
  it('the fetch fails with an error', async () => {
    await expect(getStarWarsPlanets()).rejects.toThrow(
      new Error('unable to make request'),
    );
    expect(fetchMock).toHaveBeenCalledWith('https://swapi.dev/api/planets');
  });
});
