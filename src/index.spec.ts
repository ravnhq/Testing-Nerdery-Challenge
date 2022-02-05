import {
  isInteger,
  toLowerCase,
  removeDuplicatesFromArray,
  createRandomProduct,
  getStarWarsPlanets,
  createProduct
} from './index';

interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  tags: string[];
}

/* test('Testing time!', () => {
  console.log('welcome');
}); */

describe('isInteger', () => {
  it('should return true if the value is integer', () => {
    const value = 50;

    const result = isInteger(value);

    expect(result).toBe(true);
  });

  it('should return false if the value is string', () => {
    const value = "1";

    const result = isInteger(value);

    expect(result).toBe(false);
  });
});

describe('toLowerCase', () => {
  it('should return the string in lowercase', () => {
    const value = 'THIS IS A SENTENCE';

    const result = toLowerCase(value);

    expect(result).toBe('this is a sentence');
  });

  it('should return a message requesting a string', () => {
    const value = '';

    const result = toLowerCase(value);

    expect(result).toBe('Please provide a string');
  });
});

describe('removeDuplicatesFromArray', () => {
  it('should return the same array', () => {
    const value = [1];

    const result = removeDuplicatesFromArray(value);

    expect(result).toStrictEqual([1]);
  });

  it('should remove all duplicated values from array', () => {
    const value = [1, 3, 3, 5, 7, 9];

    const result = removeDuplicatesFromArray(value);

    expect(result).toStrictEqual([1, 3, 5, 7, 9]);
  });

  it('should return an Error message at trying to pass a string as any', () => {
    const value: any = 'try me';
    const errorMessage = new Error('please provide an array of numbers or strings');

    const result = () => removeDuplicatesFromArray(value);

    expect(result).toThrow(errorMessage);
  });
});

describe('createRandomProduct', () => {
  it('should return an Error message', () => {
    const value = 'bruce@wayne.com'
    const errorMessage = new Error('You are not allowed to create products');

    const result = () => createRandomProduct(value);

    expect(result).toThrow(errorMessage);
  });

  it('should return an object with Product Interface properties', () => {
    const value = 'clark@kent.com'

    const result = createRandomProduct(value);

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('description');
    expect(result).toHaveProperty('price');
    expect(result).toHaveProperty('tags');
  });
});

describe('getStarWarsPlanets', () => {
  it('should return JSON of Star Wars planets', async () => {
    const result = await getStarWarsPlanets();

    expect(result).toHaveProperty('count');
    expect(result).toHaveProperty('next');
    expect(result).toHaveProperty('previous');
    expect(result).toHaveProperty('results');
  });
});

describe('createProduct', () => {
  it('should return a product if its parameters are valid', () => {
    const product = {
      name: 'laptopRTX3090',
      description: 'A laptop with a GPU RTX3090',
      price: 1579.00,
      tags: ['laptop'],
    };

    const result = createProduct(product);

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('description');
    expect(result).toHaveProperty('price');
    expect(result).toHaveProperty('tags');
  });

  it('should return an Error message because the object has incorrect params', () => {
    const product = {
      name: 'iPhone 13',
      description: 'The last iPhone version',
      price: 2500.00,
      tags: ['phone'],
      amount: 4
    };

    const result = () => createProduct(product);

    expect(result).toThrowError();
  });
});


