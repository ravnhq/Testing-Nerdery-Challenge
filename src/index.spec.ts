import { enableFetchMocks } from 'jest-fetch-mock'
enableFetchMocks()
import mock from "jest-fetch-mock"
import {
  isInteger,
  toLowerCase,
  removeDuplicatesFromArray,
  createRandomProduct,
  getStarWarsPlanets,
  createProduct,
} from './index';
import faker from 'faker';
import users from './utils/users';


describe('#isInteger', () => {
  it('should return true when value is a number', () => {
    const integer = isInteger(faker.datatype.number());

    expect(integer).toBe(true);
  });

  it("should return false when value isn't number", () => {
    const values = [
      faker.datatype.string(),
      NaN,
      undefined,
      null,
      faker.datatype.json(),
    ];

    const randomIndex = Math.floor(Math.random() * values.length);
    const item = values[randomIndex];

    const result = isInteger(item);

    expect(result).toBe(false);
  });
});

describe('#toLowerCase', () => {
  it('should return a string lowercase when value is string', () => {
    const value = faker.name.firstName();

    const result = toLowerCase(value);

    expect(result).toEqual(value.toLowerCase());
  });

  it("should return a message when value isn't a string", () => {
    const message = 'Please provide a string';

    expect(toLowerCase('')).toBe(message);
    expect(toLowerCase(null as any)).toBe(message);
  });
});

describe('#removeDuplicatesFromArray', () => {
  it("should return an error when value isn't an array of numbers", () => {
    const value = faker.datatype.number() as any;

    expect(() => removeDuplicatesFromArray(value)).toThrow(
      new Error('please provide an array of numbers or strings'),
    );
  });

  it('should return an array with one value', () => {
    const value = [1];
    const received = [1];

    const result = removeDuplicatesFromArray(value);

    expect(result).toEqual(received);
  });

  it('should return an array with numbers uniques', () => {
    const values = [1, 2, 4, 5, 5, 6, 6, 7, 77];
    const received = [1, 2, 4, 5, 6, 7, 77];

    const result = removeDuplicatesFromArray(values);

    expect(result).toEqual(received);
  });
});

describe('#createRandomProduct', () => {
  it("should return and error message when role isn't a creator", () => {
    const userNotCreator = users.filter((item) => item.role !== 'creator');

    const randomIndex = Math.floor(Math.random() * userNotCreator.length);
    const user = userNotCreator[randomIndex];

    expect(() => createRandomProduct(user.email)).toThrow(
      new Error('You are not allowed to create products'),
    );
  });

  it('should create a random product when email user has a create role', () => {
    const userCreator: any = users.find((item) => item.role === 'creator');

    const result = createRandomProduct(userCreator?.email);

    expect(result).toHaveProperty('id', result.id);
    expect(result).toHaveProperty('name', result.name);
    expect(result).toHaveProperty('description', result.description);
    expect(result).toHaveProperty('price', result.price);
    expect(result).toHaveProperty('tags', result.tags);
  });
});

describe('#createProduct', () => {
  it('should create a product when object is validate', () => {
    const productCreate: any = {
      name: 'PS4',
      description: 'Game Console',
      tags: ['Slim'],
      price: parseInt(faker.commerce.price()),
    };

    const result = createProduct(productCreate);

    expect(result).toHaveProperty('id', result.id);
    expect(result).toHaveProperty('description', result.description);
    expect(result).toHaveProperty('tags', result.tags);
    expect(result).toHaveProperty('price', result.price);
  });

  it("should return an error when object isn't validate", () => {
    const productCreate: any = {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      adjetive: faker.commerce.productAdjective(),
    };

    expect(() => createProduct(productCreate)).toThrow();
  });
});

describe('#getStarWarsPlanets', () => {
  beforeEach(() => {
    mock.resetMocks()
  });

  it('should return an array of planets when request GET is ok', async () => {
    mock.dontMock()
    
    const result = await getStarWarsPlanets();

    expect(result).toBeDefined();
    expect(result).toHaveProperty('count',result.count)
    expect(result).toHaveProperty('previous',result.previous)
    expect(result).toHaveProperty('next',result.next)
    expect(Array.isArray(result.results)).toBe(true)
    expect(result).toHaveProperty('results')

  });

  it('should an error when proccess is failed', async () => {

    await expect(getStarWarsPlanets()).rejects.toThrow(new Error('unable to make request'));

    expect(mock).toHaveBeenCalledWith('https://swapi.dev/api/planets');

  });
});
