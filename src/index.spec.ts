import { rest } from 'msw'
import { server, setupServer } from './mocks/server.js'
import {
  isInteger,
  toLowerCase,
  removeDuplicatesFromArray,
  createRandomProduct,
  getStarWarsPlanets,
  createProduct 
} from './index';

let noInput: any;
const emptyString: string = '';
const emptyArray: any = [];
const emptyObject: any = {};
const randomString: any = 'halsfhals';
const randomNumber: any = 123131;
const invalidProduct = {
  name: 'Raw legums',
  tags: ['vegetable', 'dessert'],
  description: 'Raw legums on the wooden table',
  price: 17.11,
}
const validProduct = {
  name: 'Asparagus',
  tags: ['vegetable'],
  description: 'Asparagus with ham',
  price: 18.95,
}

describe('Takes a number or string and returns a boolean on determining if is integer', () => {
  test('Should return true', () => {
    expect(isInteger(8)).toBe(true);
  });
  test('Should return false', () => {
    expect(isInteger('8')).toBe(false);
  });
  test('Should return false', () => {
    expect(isInteger(emptyString)).toBe(false);
  });
  test('Should return false', () => {
    expect(isInteger(noInput)).toBe(false);
  });
});

describe('Takes a string and returns it with all characters in lowercase', () => {
  test('Should return all characters as lowercase', () => {
    expect(toLowerCase('ABCDEFGHI')).toBe('abcdefghi');
  });
  test('Should return an unmodified string', () => {
    expect(toLowerCase('abcdefghi')).toBe('abcdefghi');
  });
  test('Should return characters with lowercase applied when applicable', () => {
    expect(toLowerCase('I <3 pUnkR0ck!')).toBe('i <3 punkr0ck!');
  });
  test('Should return a message', () => {
    expect(toLowerCase(emptyString)).toBe('Please provide a string');
  });
  test('Should return an error', () => {
    expect(() => { 
      toLowerCase(noInput)
    }).toThrow;
  });
  test('Should return an error', () => {
    expect(() => { 
      toLowerCase(randomNumber)
    }).toThrow;
  });
});

describe('Takes an array of numbers or strings and returns an array without duplicate occurrences', () => {
  test('Should return an array of numbers without duplicates', () => {
    expect(removeDuplicatesFromArray([1, 1, 3, 4, 4, 6])).toEqual([1, 3, 4, 6]);
  });
  test('Should return return the same array', () => {
    expect(removeDuplicatesFromArray([1])).toEqual([1]);
  });
  test('Should return an error message requesting user to enter a valid array', () => {
    expect(() => { 
      removeDuplicatesFromArray(randomString)
    }).toThrowError('please provide an array of numbers or strings');
  });
  test('Should return an error message', () => {
    expect(() => { 
      removeDuplicatesFromArray(emptyArray)
    }).toThrow;
  });
});

describe('Takes an email string and throws an error if the email is not authorized, else returns random product', () => {
  test('Should return an error', () => {
    expect(() => { 
      createRandomProduct('bruce@wayne.com')
    }).toThrowError('You are not allowed to create products');
  });
  test('Should return a product object', () => {
    expect(createRandomProduct('clark@kent.com')).toHaveProperty('id');
  });
  test('Should return an error', () => {
    expect(() => { 
      createRandomProduct('diana@themyscira.com')
    }).toThrowError('You are not allowed to create products');
  });
});

describe('Takes a product object and returns an error if object properties are not valid, else returns the product object with its ID', () => {
  test('Should return an error', () => {
    expect(() => {
      createProduct(invalidProduct)
    }).toThrow()
  });
  test('Should return an error', () => {
    expect(() => {
      createProduct(emptyObject)
    }).toThrow()
  });
  test('Should return a product object with ID', () => {
    expect(createProduct(validProduct)).toHaveProperty('id');
  });
});

const server = setupServer(
  rest.get('https://swapi.dev/api/planets', (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          count: 60,
        }),
      )
    }
  )
)

describe.skip('Makes a call to an API and returns an error if unable to make request, else returns a json object with star wars planets', () => {
});
