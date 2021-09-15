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
import cases from 'jest-in-case';

test('Testing time!', () => {
  console.log('welcome');
});

function casify(obj: Object) {
  return Object.entries(obj).map(([description, value]) => ({
    name: `${
      value.hasOwnProperty('argument') ? value.argument : value
    } - ${description} as argument`,
    value,
  }));
}

cases(
  'isInteger: valid integers',
  ({ value }) => {
    expect(isInteger(value)).toBe(true);
  },
  casify({
    integer: 10,
    'integer negative': -10,
  }),
);

cases(
  'isInteger: invalid integers',
  ({ value }) => {
    expect(isInteger(value)).toBe(false);
  },
  casify({
    'floating point': 10.12,
    NaN: NaN,
    Infinity: Infinity,
    String: '10',
  }),
);

cases(
  'toLowerCase: non-empty string',
  ({ value }) => {
    expect(toLowerCase(value.argument)).toMatch(value.expected);
  },
  casify({
    'capital letter': {
      argument: 'LOWERCASE',
      expected: 'lowercase',
    },
    lowercase: {
      argument: 'lowercase',
      expected: 'lowercase',
    },
    numeric: {
      argument: '12345',
      expected: '12345',
    },
    alphanumeric: {
      argument: '11LoweRCasE22',
      expected: '11lowercase22',
    },
  }),
);

cases(
  'toLowerCase: empty string',
  ({ value }) => {
    expect(toLowerCase(value.argument)).toMatch(value.expected);
  },
  casify({
    'empty string': {
      argument: '',
      expected: 'Please provide a string',
    },
  }),
);

cases(
  'removeDuplicatesFromArray: invalid input',
  ({ value }) => {
    const wrapperFunction = () => {
      removeDuplicatesFromArray(value.argument);
    };
    expect(wrapperFunction).toThrow(Error);
  },
  casify({
    'wrong argument type': { key: 123 } as any,
  }),
);

cases(
  'removeDuplicatesFromArray: valid inputs',
  ({ value }) => {
    expect(removeDuplicatesFromArray(value.argument)).toEqual(value.expected);
  },
  casify({
    'single element': {
      argument: ['a'],
      expected: ['a'],
    },
    'many duplicates': {
      argument: ['a', 1, 'b', 'b', 2, 2],
      expected: ['a', 1, 'b', 2],
    },
    'without duplicates': {
      argument: ['a', 1, 'b', 2, 'c', 3],
      expected: ['a', 1, 'b', 2, 'c', 3],
    },
  }),
);

describe('checking createProduct function', () => {
  const rigthSchema = {
    name: 'Avocado',
    description: 'It is a fruit rich in fiber',
    tags: ['fruit'],
    price: 5.5,
  };

  const wrongSchema = {
    name: 'A',
    description: 'The avocado is a fruit rich in fiber and healthy fats',
    tags: ['fruit', 'vegetable'],
    price: 5.543,
  };

  it('should return a new product if we pass an object with right schema as argument', () => {
    const result = createProduct(rigthSchema);
    const expected = {
      id: expect.any(Number),
      name: rigthSchema.name,
      description: rigthSchema.description,
      tags: rigthSchema.tags,
      price: rigthSchema.price,
    };

    expect(result).toEqual(expected);
  });
  it('should throw an error if we pass a object with wrong schema as argument', () => {
    const wrapperFunction = () => {
      createProduct(wrongSchema);
    };
    expect(wrapperFunction).toThrow(Error);
  });
});

describe('checking createRandomProduct function', () => {
  it('should return an new product if the user email passed has role equal to creator', () => {
    const result = createRandomProduct('clark@kent.com');
    const expected = {
      id: expect.any(Number),
      name: expect.any(String),
      description: expect.any(String),
      tags: expect.any(Array),
      price: expect.any(String),
    };
    expect(result).toEqual(expected);
  });

  it('should throw an error if the user email passed has not role equal to creator', () => {
    const wrapperFunction = () => {
      createProduct(createRandomProduct('bruce@wayne.com'));
    };
    expect(wrapperFunction).toThrow(Error);
  });
});

jest.mock('node-fetch', () => {
  return jest.fn();
});

beforeEach(() => {
  mocked(fetch).mockClear;
});

describe('checking getStarWarsPlanets function', () => {
  it('should return the first entry of star wars planets API', async () => {
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

    expect(mocked(fetch)).toHaveBeenCalledWith('https://swapi.dev/api/planets');
    expect(mocked(fetch)).toHaveBeenCalledTimes(1);
    expect(planets.results[0].name).toBe('Tatooine');
  });

  it('should fail if the fetch to API is rejected', async () => {
    mocked(fetch).mockImplementation((): Promise<any> => {
      return Promise.reject();
    });

    const wrapperFunction = async () => {
      await getStarWarsPlanets();
    };

    await expect(wrapperFunction).rejects.toThrow();
  });
});
