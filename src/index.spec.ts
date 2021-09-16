import { valid } from 'joi';
import {
  isInteger,
  toLowerCase,
  removeDuplicatesFromArray,
  createRandomProduct,
  getStarWarsPlanets,
  createProduct,
} from './index';
import fetch from 'node-fetch';
import { mocked } from 'ts-jest/utils';

 describe('isInteger', () =>{
  test('Return true if we pass a number', () =>{
    expect(isInteger(8)).toBe(true);
  });

  test('Return false if we pass a string', () =>{
    expect(isInteger('hola')).toBe(false);
  });

  test('Return false if we pass a null value', () =>{
    expect(isInteger(null)).toBe(false);
  });

  test('Return true if we pass a negative number', () =>{
    expect(isInteger(-6)).toBe(true);
  });

  test('Return false if we pass NaN', () =>{
    expect(isInteger(NaN)).toBe(false);
  });
});

describe('toLowerCase', () =>{
  const defaultMessage = 'Please provide a string'

  test('Return default message if we dont pass a string', () =>{
    expect(toLowerCase('')).toBe(defaultMessage);
  });

  test('Return default message if we pass null', () =>{
    expect(toLowerCase(null)).toBe(defaultMessage);
  });

  test('Return lowercase if we pass capital letters', () =>{
    expect(toLowerCase('THIS IS A TEST')).toEqual('this is a test');
  });
  
  test('Return lowercase if we pass lowercase string', () => {
    expect(toLowerCase('this is a test')).toEqual('this is a test')
  })
});

describe('removeDuplicatesFromArray', () => {
  const duplicateItemsArray = ['@', '@', 2, 2];
  const uniqueItemsArray = ['this', 'is', 'a', 'test', 1, 2, 3];
  const singleItemArray = [1];
  const emptyArray = [];
  const hashValue = {key: 'value'};
  const nullValue = null

  test('Return removed items array if we pass an array with duplicate items', () => {
    expect(removeDuplicatesFromArray(duplicateItemsArray)).toEqual(['@', 2]);
  });

  test('Return same array if we pass an array with unique items', () => {
    expect(removeDuplicatesFromArray(uniqueItemsArray)).toEqual(uniqueItemsArray);
  });

  test('Return empty array if we pass an empty array', () => {
    expect(removeDuplicatesFromArray(emptyArray)).toEqual(emptyArray);
  });
  
  test('Return same array if we pass an array with a single item', () => {
    expect(removeDuplicatesFromArray(singleItemArray)).toEqual(singleItemArray);
  });

  test('Throw an error when pass invalid value', () => {
    function passEmptyArray(){
      removeDuplicatesFromArray(hashValue as any);
    };
    expect(passEmptyArray).toThrow(Error);
  });

  test('Throw an error when pass invalid value', () => {
    function passEmptyArray(){
      removeDuplicatesFromArray(nullValue as any);
    };
    expect(passEmptyArray).toThrow(Error);
  });
});

describe('createProduct', () => {
  const validProduct = {
    name: 'Eggs',
    tags: ['test tag'],
    description: 'Description about good eggs',
    price: 15.30,
  };
  const invalidProduct = {
    id: 'bad id',
    name: '1234',
    tags: ['dairy'],
    description: 'Raw organic brown eggs in a basket',
    price: 28.1,
  };

  test('Return a valid product if we pass a valid schema', () => {
    expect(createProduct(validProduct)).toEqual({
      id: expect.any(Number),
      name: validProduct.name,
      tags: validProduct.tags,
      description: validProduct.description,
      price: validProduct.price,
    });
  });

  test('Throw an error if we pass an invalid product', () => {
    expect(() => createProduct(invalidProduct as any)).toThrow(Error);
  });
});

describe('createRandomProduct', () => {
  test('Create a product with a correct user role', () => {
    expect(createRandomProduct('clark@kent.com')).toEqual({
      id: expect.any(Number),
      name: expect.any(String),
      description: expect.any(String),
      tags: expect.any(Array),
      price: expect.any(String),
    });
  });

  test('Throws an error with an incorrect user role', () => {
    expect(() => {
      createRandomProduct('diana@themyscira.com');
    }).toThrowError(Error);
  });
});

jest.mock('node-fetch', () => {
  return jest.fn();
});

beforeEach(() => {
  mocked(fetch).mockClear();
});

describe ('getStarWarsPlanets', () => {
  test('Throw an error when fail', async ()=> {
    mocked(fetch).mockImplementation((): Promise<any> => {
      return Promise.resolve({
        json() {
          return Promise.resolve({
            results: [
              {
                name: 'Tatooine',
              },
            ],
          });
        },
      });
    });

    const planets = await getStarWarsPlanets();

    expect(mocked(fetch).mock.calls[0][0]).toEqual('https://swapi.dev/api/planets');
    expect(mocked(fetch).mock.calls.length).toBe(1);
    expect(planets.results[0].name).toBe('Tatooine');
  });

  test('it should throw an error when the API is down', async () => {
    mocked(fetch).mockImplementation((): Promise<any> => {
      return Promise.reject();
    });

    await expect(getStarWarsPlanets()).rejects.toThrowErrorMatchingSnapshot();
  });
})