import fetch from 'node-fetch';

import {
  isInteger,
  toLowerCase,
  removeDuplicatesFromArray,
  createRandomProduct,
  getStarWarsPlanets,
  createProduct,
} from './index';

jest.mock('node-fetch');
const { Response } = jest.requireActual('node-fetch');

test('Testing time!', () => {
  console.log('welcome');
});

describe('isInteger', () => {
  it('should be an integer', () => {
    expect(isInteger(2)).toEqual(true);
  });

  it('should be a string', () => {
    expect(isInteger('hello')).toEqual(false);
  });
});

describe('toLowerCase', () => {
  it('should fail if it is an empty word', () => {
    expect(toLowerCase('')).toEqual('Please provide a string');
  });

  it('should return a lower case word', () => {
    expect(toLowerCase('HELLO')).toEqual('hello');
  });
});

describe('removeDuplicatesFromArray', () => {
  it('should throw an error if arg is not an array', () => {
    expect(() => {
      removeDuplicatesFromArray(undefined as any);
    }).toThrow('please provide an array of numbers or strings');
  });

  it('should return array unmodified if there is a single element', () => {
    const shortArray = ['hello'];
    expect(removeDuplicatesFromArray(shortArray)).toEqual(shortArray);
  });

  it('should remove duplicates', () => {
    const longArray = ['hello', 'bye', 'hello', 'good', 'hello'];
    const result = removeDuplicatesFromArray(longArray);

    expect(result.length).toEqual(3);
    expect(result).toEqual(['hello', 'bye', 'good']);
  });
});

describe('createProduct', () => {
  it('should throw an error when product is invalid (name length)', () => {
    expect(() =>
      createProduct({
        name: 'p',
        description: 'rechicken',
        price: 12,
        tags: ['food'],
      }),
    ).toThrow(
      '[{"message":"\\"name\\" length must be at least 3 characters long","path":["name"],"type":"string.min","context":{"limit":3,"value":"p","label":"name","key":"name"}}]',
    );
  });

  it('should create a new product', () => {
    const product = {
      name: 'product',
      description: 'rechicken',
      price: 12,
      tags: ['food'],
    };

    const result = createProduct(product);

    expect(result).toMatchObject(product);
    expect(typeof result).toEqual('object');
  });
});

describe('createRandomProduct', () => {
  it('should fail if permissions are wrong', () => {
    const email = 'bruce@wayne.com';

    expect(() => createRandomProduct(email)).toThrow(
      'You are not allowed to create products',
    );
  });

  it('createRandomProduct should return a valid product object', () => {
    // Arrange
    const email = 'clark@kent.com';

    const fakeProduct = {
      id: expect.any(Number),
      name: expect.any(String),
      description: expect.any(String),
      price: expect.any(String),
      tags: [expect.any(String), expect.any(String)],
    };

    // Act
    const result = createRandomProduct(email);

    // Assert
    expect(result).toMatchObject(fakeProduct);
  });
});

describe('getStarWarsPlanets', () => {
  it('should throw an error if the API request fails', async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockRejectedValueOnce(
      new Error(JSON.stringify({})),
    );

    await expect(getStarWarsPlanets()).rejects.toThrow(
      'unable to make request',
    );
  });

  it('should response with the correct data', async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue(
      new Response(JSON.stringify({ id: 1 })),
    );

    const result = await getStarWarsPlanets();

    expect(typeof result).toEqual('object');
    expect(result).toMatchObject({ ...result, id: expect.any(Number) });
  });
});
