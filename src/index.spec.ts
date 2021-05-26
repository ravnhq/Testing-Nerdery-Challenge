import {
  isInteger,
  toLowerCase,
  removeDuplicatesFromArray,
  createRandomProduct,
  createFakeProduct,
  getStarWarsPlanets,
  createProduct,
} from './index';

import faker from 'faker';
import fetch from 'node-fetch';
import { mocked } from 'ts-jest/utils';

jest.mock('node-fetch', () => {
  return jest.fn();
});

// Test isInteger()

describe('checking if it is integer', () => {
  it('should return true if we pass a number', () => {
    expect(isInteger(8)).toBe(true);
  });
  it('should return true if we pass a  negative number', () => {
    expect(isInteger(-2)).toBe(true);
  });
  it('should return false if we pass a string', () => {
    expect(isInteger('10')).toBe(false);
  });
  it('should return false if we pass a decimal number', () => {
    expect(isInteger(20.45)).toBe(false);
  });
  it('should return false if we pass NaN', () => {
    expect(isInteger(NaN)).toBe(false);
  });
  it('should return false if we pass infinity', () => {
    expect(isInteger(Infinity)).toBe(false);
  });
});

// Test toLowerCase()
describe('turn a string into lowercase', () => {
  it('should return a lowercase string  if we pass capital letters', () => {
    expect(toLowerCase('MMMM')).toMatch(/mmm/);
  });
  it('should return a lowercase string if we pass lowercase letters', () => {
    expect(toLowerCase('mmm')).toMatch(/mmm/);
  });
  it('fails if we dont pass any string', () => {
    expect(toLowerCase('')).toBe('Please provide a string');
  });
});

// Test removeDuplicatesFromArray()

describe('remove duplicates from Array', () => {
  it('return one item if we pass an array with one item', () => {
    expect(removeDuplicatesFromArray([2])).toEqual([2]);
  });

  it('return the same array if we pass an array with unique elements', () => {
    const myArray = ['a', 1, 'M'];
    expect(removeDuplicatesFromArray(myArray)).toEqual(['a', 1, 'M']);
  });

  it('remove duplicates numbers or string form an array', () => {
    const myArray = ['a', 1, 1, 'a', 3];
    expect(removeDuplicatesFromArray(myArray)).toEqual(['a', 1, 3]);
  });
  it('fails if we pass a wrong argument type', () => {
    const props = { item: 2 };
    const testFunction = () => {
      removeDuplicatesFromArray(props as any);
    };
    expect(testFunction).toThrow(Error);
  });
});

// test create a product
const productRigthSchema = {
  name: 'Asparagus',
  tags: ['vegetable'],
  description: 'Asparagus with ham',
  price: 18.95,
};

const productOtherSchema = {
  name: 'Brown eggs',
  tags: ['dairy', 'breakfast'],
  description: 'Raw organic brown eggs in a basket',
  price: 28.1,
};

describe('verify a product', () => {
  it('return a product with id if we pass a  product with the right schema', () => {
    expect(createProduct(productRigthSchema)).toEqual({
      id: expect.any(Number),
      name: 'Asparagus',
      tags: ['vegetable'],
      description: 'Asparagus with ham',
      price: 18.95,
    });
  });
  it('fails if we pass a product with different schema', () => {
    expect(() => createProduct(productOtherSchema)).toThrow(Error);
  });
});

// test  createFakeProduct()

describe('validate a product', () => {
  it('return a fake product', () => {
    expect(createFakeProduct()).toMatchInlineSnapshot(`
      Object {
        "description": "Asparagus with ham",
        "id": 105,
        "name": "Asparagus",
        "price": 18.95,
        "tags": Array [
          "vegetable",
          "green",
        ],
      }
    `);
  });
});

faker.datatype.number = jest.fn(() => 105);
faker.commerce.productName = jest.fn(() => 'Asparagus');
faker.commerce.productMaterial = jest.fn(() => 'vegetable');
faker.commerce.color = jest.fn(() => 'green');
faker.commerce.productDescription = jest.fn(() => 'Asparagus with ham');
faker.commerce.price = jest.fn(() => 18.95);

describe('get a fake product', () => {
  const myProductfake = {
    id: 105,
    name: 'Asparagus',
    tags: ['vegetable', 'green'],
    description: 'Asparagus with ham',
    price: 18.95,
  };

  it('return a fake product', () => {
    expect(createFakeProduct()).toEqual(myProductfake);
  });
});

// test  createRandomProduct()
describe('verify if the user can create a product', () => {
  it('should return a product if the email passed belong to a creator', () => {
    expect(createRandomProduct('clark@kent.com')).toMatchInlineSnapshot(`
      Object {
        "description": "Asparagus with ham",
        "id": 105,
        "name": "Asparagus",
        "price": 18.95,
        "tags": Array [
          "vegetable",
          "green",
        ],
      }
    `);
  });

  it('fails if the email passed does not belong to a creator user', () => {
    expect(() => createRandomProduct('diana@themyscira.com')).toThrow(
      'You are not allowed to create products',
    );
  });
});

// test getplanets()

describe('verify getplanets', () => {
  it('get all the planet', async () => {
    mocked(fetch).mockImplementation(
      (): Promise<any> =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              count: 3,
              results: [
                {
                  name: 'Tatooine',
                  rotation_period: '23',
                  orbital_period: '304',
                },
                {
                  name: 'Yavin IV',
                  rotation_period: '24',
                  orbital_period: '4818',
                },
                {
                  name: 'Hoth',
                  rotation_period: '23',
                  orbital_period: '549',
                },
              ],
            }),
        }),
    );

    const planets = await getStarWarsPlanets();

    expect(fetch).toBeCalledWith('https://swapi.dev/api/planets');
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(planets.results[0].name).toBe('Tatooine');
  });

  it('fail if fetch is rejected', async () => {
    try {
      mocked(fetch).mockImplementation(
        (): Promise<any> =>
          Promise.resolve({
            json: () => Promise.reject(),
          }),
      );
      await getStarWarsPlanets();
    } catch (e) {
      expect(e).toMatchInlineSnapshot(`[Error: unable to make request]`);
    }
  });
});
