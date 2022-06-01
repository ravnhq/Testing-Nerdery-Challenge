import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  isInteger,
  toLowerCase,
  removeDuplicatesFromArray,
  createRandomProduct,
  getStarWarsPlanets,
  createProduct,
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
};
const validProduct = {
  name: 'Asparagus',
  tags: ['vegetable'],
  description: 'Asparagus with ham',
  price: 18.95,
};

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
      toLowerCase(noInput);
    }).toThrow;
  });
  test('Should return an error', () => {
    expect(() => {
      toLowerCase(randomNumber);
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
      removeDuplicatesFromArray(randomString);
    }).toThrowError('please provide an array of numbers or strings');
  });
  test('Should return an error message', () => {
    expect(() => {
      removeDuplicatesFromArray(emptyArray);
    }).toThrow;
  });
});

describe('Takes an email string and throws an error if the email is not authorized, else returns random product', () => {
  test('Should return a product object with ID', () => {
    expect(createRandomProduct('clark@kent.com')).toHaveProperty('id');
    expect(createRandomProduct('clark@kent.com')).toHaveProperty('name');
    expect(createRandomProduct('clark@kent.com')).toHaveProperty('description');
    expect(createRandomProduct('clark@kent.com')).toHaveProperty('price');
    expect(createRandomProduct('clark@kent.com')).toHaveProperty('tags');
  });
  test('Should return an error', () => {
    expect(() => {
      createRandomProduct('bruce@wayne.com');
    }).toThrowError('You are not allowed to create products');
  });
  test('Should return an error', () => {
    expect(() => {
      createRandomProduct('diana@themyscira.com');
    }).toThrowError('You are not allowed to create products');
  });
});

describe('Takes a product object and returns an error if object properties are not valid, else returns the product object with its ID', () => {
  test('Should return an error', () => {
    expect(() => {
      createProduct(invalidProduct);
    }).toThrow();
  });
  test('Should return an error', () => {
    expect(() => {
      createProduct(emptyObject);
    }).toThrow();
  });
  test('Should return a product object with ID', () => {
    expect(createProduct(validProduct)).toHaveProperty('id');
    expect(createProduct(validProduct)).toHaveProperty('name');
    expect(createProduct(validProduct)).toHaveProperty('description');
    expect(createProduct(validProduct)).toHaveProperty('price');
    expect(createProduct(validProduct)).toHaveProperty('tags');
  });
});

const server = setupServer(
  rest.get('https://swapi.dev/api/planets', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        count: 60,
        next: 'https://swapi.dev/api/planets/?page=2',
      }),
    );
    // return res(
    //   ctx.status(400),
    //   ctx.json({
    //     errorMessage: 'unable to make request',
    //   }),
    // );
  }),
);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

describe('Makes a call to an API and returns an error if unable to make request, else returns a json object with star wars planets', () => {
  test('Should return a JSON object with some properties and first page of star wars planets', async () => {
    expect(await getStarWarsPlanets()).toHaveProperty('count', 60);
    expect(await getStarWarsPlanets()).toHaveProperty('next', 'https://swapi.dev/api/planets/?page=2');
  });
  test('Should return an error message', async () => {
    server.use(
      rest.get('https://swapi.dev/api/planets', (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            errorMessage: 'unable to make request',
          }),
        );
      }),
    );
    // await expect(getStarWarsPlanets()).resolves.toEqual({sfhkakhsf: 'aslfkhsaofha'})
   //await expect(getStarWarsPlanets()).resolves.toEqual({errorMessage: 'unable to make request'})
  try {
      return await getStarWarsPlanets();
    } catch (e) {
      return expect(e).toEqual({ message: "error", status: 401 });
    }
  })
});
