import {
  isInteger,
  toLowerCase,
  removeDuplicatesFromArray,
  createRandomProduct,
  getStarWarsPlanets,
  createProduct,
  createFakeProduct,
} from './index';
import { mocked } from 'ts-jest/utils';
import fetch from 'node-fetch';

test('Testing time!', () => {
  console.log('welcome');
});

describe('isInteger function test', () => {
  it('should return true with positive number', () => {
    expect(isInteger(1)).toBe(true);
  });
  it('should return true with negative number', () => {
    expect(isInteger(-1)).toBe(true);
  });
  it('should return false with string', () => {
    expect(isInteger('1')).toBe(false);
  });
  it('should return false with decimal', () => {
    expect(isInteger(1.2)).toBe(false);
  });
  it('should return false with NaN', () => {
    expect(isInteger(NaN)).toBe(false);
  });
});

describe('toLowerCase function test', () => {
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

describe('removeDuplicatesFromArray function test', () => {
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

describe('createProduct function test', () => {
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

describe('createFakeProduct function test', () => {
  it('return a fake product', () => {
    expect(createFakeProduct()).toMatchObject(fakeProduct);
  });
});

describe('createRandomProduct function test', () => {
  it('should return a fake product', () => {
    expect(createRandomProduct('clark@kent.com')).toMatchObject(fakeProduct);
  });
  it('should return an error message', () => {
    expect(() => createRandomProduct('bruce@wayne.com')).toThrowError(
      'You are not allowed to create products',
    );
  });
});

const expectedResponse = {
  count: 60,
  next: 'https://swapi.dev/api/planets/?page=2',
  previous: null,
  results: expect.any(Array),
};

// const originalGetStarWarsPlanets = getStarWarsPlanets;
// getStarWarsPlanets = jest.fn(()=>{
//   throw new Error('unable to make request');
// })
// const mockedStarWars = jest.fn(getStarWarsPlanets);

jest.mock('node-fetch');
describe('getStarWarsPlanets function test', async () => {
  it('should return the star wars planets', async () => {
    // mocked(fetch).mockClear()
    // const getStarWarsPlanets = mockedStarWars;

    mocked(fetch).mockImplementationOnce((): Promise<any> =>
      Promise.resolve({
        json: () => Promise.resolve(expectedResponse),
      }));

    // expect(fetch).toHaveBeenCalledWith('https://swapi.dev/api/planets')
    await expect(getStarWarsPlanets()).resolves.toMatchObject(expectedResponse);
  }, 7000);

  it('the fetch fails with an error', async () => {
    // const fetchMock = jest.spyOn(window, 'fetch');
    // fetchMock.mockImplementationOnce((): Promise<any> =>
    //   Promise.resolve({
    //     json: () => Promise.reject('unable to make request'),
    //   }));

    // mocked(fetch).mockImplementationOnce((): Promise<any> =>
    //   Promise.resolve({
    //     json: () => Promise.reject('unable to make request'),
    //   }));
    await expect(getStarWarsPlanets()).rejects.toThrow('unable to make request');
  });
});
