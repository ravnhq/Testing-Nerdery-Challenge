import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';
enableFetchMocks();
import {
  isInteger,
  toLowerCase,
  removeDuplicatesFromArray,
  createRandomProduct,
  getStarWarsPlanets,
  createProduct,
} from './index';

test('Testing time!', () => {
  console.log('welcome');
});

describe('isInteger test', () => {
  it('should return true with positive integer', () => {
    expect(isInteger(5)).toBeTruthy();
  });
  it('should return true with negative integer', () => {
    expect(isInteger(-5)).toBeTruthy();
  });
  it('should return true with 0', () => {
    expect(isInteger(0)).toBeTruthy();
  });
  it('should return true with -0', () => {
    expect(isInteger(-0)).toBeTruthy();
  });
  it('should return false with decimal number', () => {
    expect(isInteger(0.5)).toBeFalsy();
  });
  it('should return false with negative decimal number', () => {
    expect(isInteger(-0.5)).toBeFalsy();
  });
});

describe('toLowerCase test', () => {
  it('should return abc with ABC', () => {
    expect(toLowerCase('ABC')).toMatch(/abc/);
  });
  it('should return 23hF with 23HF', () => {
    expect(toLowerCase('23HF')).toMatch(/23hf/);
  });
  it('should return 23hF with 23hf', () => {
    expect(toLowerCase('23hf')).toMatch(/23hf/);
  });
  it('should return abc with abc', () => {
    expect(toLowerCase('abc')).toMatch(/abc/);
  });
  it('should return Please provide a string with empty string', () => {
    expect(toLowerCase('')).toBe('Please provide a string');
  });
});

describe('removeDuplicatesFromArray test', () => {
  it('should return [1] with [1]', () => {
    expect(removeDuplicatesFromArray([1])).toEqual([1]);
  });
  it('should return [1,"a",3] with [1,"a",3]', () => {
    expect(removeDuplicatesFromArray([1, 'a', 3])).toEqual([1, 'a', 3]);
  });
  it('should return [1,2,3] with [1,2,3,2]', () => {
    expect(removeDuplicatesFromArray([1, 2, 3, 2])).toEqual([1, 2, 3]);
  });
  it('should return Error with any type diferent to string[] or number[]', () => {
    const testFunction = () => {
      removeDuplicatesFromArray({} as any);
    };
    expect(testFunction).toThrow(Error);
  });
});

describe('createProduct test', () => {
  it('should return a product with a objetc verified with joi', () => {
    const product1 = {
      name: 'Browneggs',
      tags: ['dairy'],
      description: 'Raw organic brown eggs',
      price: 28.1,
    };
    const resp = {
      id: expect.any(Number),
      name: 'Browneggs',
      tags: ['dairy'],
      description: 'Raw organic brown eggs',
      price: 28.1,
    };
    expect(createProduct(product1)).toEqual(resp);
  });
  it('should return Error when object doesnt verified with joi', () => {
    const product2 = {
      name: 'Brown eggs',
      tags: ['dairy'],
      description: 'Raw organic brown eggs',
      price: 28.1,
    };
    const product3 = {
      name: 'Brown eggs',
      tags: {} as any,
      description: 'Raw organic brown eggs',
      price: 28.1,
    };
    const product4 = {
      name: 'Brown eggs',
      tags: ['dairy'],
      description: 'Raw organic brown eggs this is extra text for this field',
      price: 28.1,
    };
    const product5 = {
      name: 'Brown eggs',
      tags: ['dairy'],
      description: 'Raw organic brown eggs',
      price: 1,
    };
    const testFunction2 = () => {
      createProduct(product2);
    };
    const testFunction3 = () => {
      createProduct(product3);
    };
    const testFunction4 = () => {
      createProduct(product4);
    };
    const testFunction5 = () => {
      createProduct(product5);
    };
    expect(testFunction2).toThrow(Error);
    expect(testFunction3).toThrow(Error);
    expect(testFunction4).toThrow(Error);
    expect(testFunction5).toThrow(Error);
  });
});

describe('createRandomProduct test', () => {
  it('should return a product with correct email', () => {
    expect(createRandomProduct('clark@kent.com')).toMatchObject({
      id: expect.anything(),
      name: expect.anything(),
      description: expect.anything(),
      price: expect.anything(),
      tags: expect.anything(),
    });
  });
  it('should return Error with a email without create rol', () => {
    const createWithAdmin = () => {
      createRandomProduct('bruce@wayne.com');
    };
    const createWithUser = () => {
      createRandomProduct('diana@themyscira.com');
    };
    const createWithEmpty = () => {
      createRandomProduct('');
    };
    expect(createWithAdmin).toThrow(Error);
    expect(createWithUser).toThrow(Error);
    expect(createWithEmpty).toThrow(Error);
  });
});

describe('getStarWarsPlanets function test', () => {
  const response = {
    count: 60,
    next: 'https://swapi.dev/api/planets/',
    previous: null,
    results: expect.any(Array),
  };

  const mockedResponse = {
    json: () =>
      Promise.resolve({
        count: 60,
        next: 'https://swapi.dev/api/planets/',
        previous: null,
        results: [
          {
            name: 'Tatooine',
            rotation_period: '23',
            orbital_period: '304',
            diameter: '10465',
            climate: 'arid',
            gravity: '1 standard',
            terrain: 'desert',
            surface_water: '1',
            population: '200000',
            residents: [
              'https://swapi.dev/api/people/1/',
              'https://swapi.dev/api/people/2/',
              'https://swapi.dev/api/people/4/',
              'https://swapi.dev/api/people/6/',
              'https://swapi.dev/api/people/7/',
              'https://swapi.dev/api/people/8/',
              'https://swapi.dev/api/people/9/',
              'https://swapi.dev/api/people/11/',
              'https://swapi.dev/api/people/43/',
              'https://swapi.dev/api/people/62/',
            ],
            films: [
              'https://swapi.dev/api/films/1/',
              'https://swapi.dev/api/films/3/',
              'https://swapi.dev/api/films/4/',
              'https://swapi.dev/api/films/5/',
              'https://swapi.dev/api/films/6/',
            ],
            created: '2014-12-09T13:50:49.641000Z',
            edited: '2014-12-20T20:58:18.411000Z',
            url: 'https://swapi.dev/api/planets/1/',
          },
        ],
      }),
  };
  it('should return the star wars planets using the api url', async () => {
    fetchMock.mockImplementation(
      async (): Promise<any> => Promise.resolve(mockedResponse),
    );
    await expect(getStarWarsPlanets()).resolves.toMatchObject(response);
    expect(fetchMock).toHaveBeenCalledWith('https://swapi.dev/api/planets');
  });

  it('should throw an error when api fail', async () => {
    fetchMock.mockImplementation(async (): Promise<any> => Promise.reject());
    await expect(getStarWarsPlanets()).rejects.toThrow(
      'unable to make request',
    );
    expect(fetchMock).toHaveBeenCalledWith('https://swapi.dev/api/planets');
  });
});
fetchMock.disableMocks();
