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
    expect(isInteger(2)).toBe(true);
  });

  it('should be a string', () => {
    expect(isInteger('hello')).toBe(false);
  });
});

describe('toLowerCase', () => {
  it('should fail if it is an empty word', () => {
    expect(toLowerCase('')).toBe('Please provide a string');
  });

  it('should return a lower case word', () => {
    expect(toLowerCase('HELLO')).toBe('hello');
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
    expect(removeDuplicatesFromArray(shortArray)).toBe(shortArray);
  });

  it('should remove duplicates', () => {
    const longArray = ['hello', 'bye', 'hello', 'good', 'hello'];
    const result = removeDuplicatesFromArray(longArray);

    expect(result.length).toBe(3);
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
    ).toThrow(Error);
  });

  it('should create a new product', () => {
    const product = {
      name: 'product',
      description: 'rechicken',
      price: 12,
      tags: ['food'],
    };

    const result = createProduct(product);

    expect(result).toHaveProperty('id');
    expect(typeof result).toBe('object');
  });
});

describe('createRandomProduct', () => {
  it('should fail if permissions are wrong', () => {
    expect(() => createRandomProduct('bruce@wayne.com')).toThrow(Error);
  });

  it('should create a fake product', () => {
    expect(createRandomProduct('clark@kent.com')).toHaveProperty('id');
    expect(createRandomProduct('clark@kent.com')).toBeDefined();
  });
});

describe('getStarWarsPlanets', () => {
  it('should throw an error if the API request fails', async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockRejectedValueOnce(
      new Response(JSON.stringify({})),
    );

    await expect(getStarWarsPlanets()).rejects.toThrow(Error);
  });

  it('should response with the correct data', async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockReturnValueOnce(
      new Response(JSON.stringify({ id: 1 })),
    );

    const result = await getStarWarsPlanets();

    expect(typeof result).toBe('object');
    expect(result).toHaveProperty('id');
  });
});
