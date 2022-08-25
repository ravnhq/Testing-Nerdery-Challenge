import cases from 'jest-in-case';
import fetch, { Response } from 'node-fetch';
import {
  isInteger,
  toLowerCase,
  removeDuplicatesFromArray,
  createRandomProduct,
  getStarWarsPlanets,
  createProduct,
} from './index';

jest.mock('node-fetch', () => {
  const module = jest.requireActual('node-fetch');
  return {
    __esModule: true,
    ...module,
    default: jest.fn(module.default),
  };
});

function casify(subcases: {}) {
  return Object.entries(subcases).map(([testName, testValue]) => {
    return {
      name: `${testValue} - ${testName}`,
      testValue,
    };
  });
}

function functionResultOrError(aFunction: Function, argument) {
  try {
    return aFunction(argument);
  } catch (e) {
    return e;
  }
}

describe(`isInteger`, () => {
  cases(
    `returns true if integer`,
    (subcase) => expect(isInteger(subcase.testValue)).toBe(true),
    casify({
      postive: 3,
      negative: -3,
      '.0 decimal': 3.0,
    }),
  );

  cases(
    `returns false if not integer`,
    (subcase) => expect(isInteger(subcase.testValue)).toBe(false),
    casify({
      string: '3',
      decimal: 3.1,
    }),
  );
});

describe(`toLowerCase`, () => {
  test(`requires non empty string`, () => {
    const str = '';
    expect(toLowerCase(str)).toMatchInlineSnapshot(`"Please provide a string"`);
  });

  test(`returns lowercase if string has length`, () => {
    const str = 'A Message';
    expect(toLowerCase(str)).toBe('a message');
  });
});

describe(`removeDuplicatesFromArray`, () => {
  test(`returns error if not an array`, () => {
    const array = 3;
    const error = functionResultOrError(removeDuplicatesFromArray, array);
    expect(error).toMatchInlineSnapshot(
      `[Error: please provide an array of numbers or strings]`,
    );
  });

  test(`returns identity if just one element`, () => {
    const stringArray = ['a'];
    const numberArray = [1];
    expect(removeDuplicatesFromArray(stringArray)).toEqual(stringArray);
    expect(removeDuplicatesFromArray(numberArray)).toEqual(numberArray);
  });

  cases(
    `returns array without duplicates if many elements`,
    (subcase) => {
      if (typeof subcase.testValue[0] === 'string') {
        expect(removeDuplicatesFromArray(subcase.testValue)).toEqual([
          'a',
          'b',
          'c',
        ]);
      } else if (typeof subcase.testValue[0] === 'number') {
        expect(removeDuplicatesFromArray(subcase.testValue)).toEqual([1, 2, 3]);
      }
    },
    casify({
      stringUniques: ['a', 'b', 'c'],
      stringDuplicated: ['a', 'a', 'b', 'b', 'c', 'c'],
      numberUniques: [1, 2, 3],
      numberDuplicated: [1, 1, 2, 2, 3, 3],
    }),
  );
});

describe(`createProduct`, () => {
  test(`throws error if not a valid schema product`, () => {
    const product = {};
    const error = functionResultOrError(createProduct, product);
    expect(error).toMatchInlineSnapshot(
      `[Error: [{"message":"\\"name\\" is required","path":["name"],"type":"any.required","context":{"label":"name","key":"name"}}]]`,
    );
  });

  test(`returns a product if schema is valid`, () => {
    const product = {
      name: 'MegaPic',
      description: 'A new robot model',
      price: 33,
      tags: ['new'],
    };
    const newProduct = createProduct(product);
    expect(newProduct).toEqual({
      id: expect.any(Number),
      ...product,
    });
  });
});

describe(`createRandomProduct`, () => {
  test(`throws error if user's role is not allowed`, () => {
    const email = 'bruce@wayne.com';
    const error = functionResultOrError(createRandomProduct, email);
    expect(error.message).toMatchInlineSnapshot(
      `"You are not allowed to create products"`,
    );
  });

  test(`returns a new product if user's role is allowed`, () => {
    const email = 'clark@kent.com';
    const newRandomProduct = createRandomProduct(email);
    expect(newRandomProduct).toEqual({
      id: expect.any(Number),
      name: expect.any(String),
      description: expect.any(String),
      price: expect.any(String),
      tags: expect.any(Array),
    });
  });
});

describe(`getStarWarsPlanets`, () => {  
  test(`original is managed correctly`, async () => {
    try {
      const response = await getStarWarsPlanets();
      expect(response).toMatchSnapshot();
    } catch (e) {
      expect(e).toMatchInlineSnapshot(`[Error: unable to make request]`);
    }
  }, 10000);

  describe(`mocked`, () => {
    const mockFetch = fetch as jest.MockedFunction<any>; //cast because of ts (static types)

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test(`returns result if success response`, async () => {
      const body = JSON.stringify({
        count: 60,
        next: 'https://swapi.dev/api/planets/?page=2&format=api',
        previous: null,
        results: [],
      });
      const response = new Response(body, {status: 200});
      mockFetch.mockResolvedValueOnce(response);

      const result = await getStarWarsPlanets();
      expect(result).toMatchSnapshot();
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith('https://swapi.dev/api/planets');
    });

    test(`returns error if failure response`, async () => {
      const response = new Promise((_, reject) => {
        reject(new Error(`unable to make request`));
      });
      mockFetch.mockImplementationOnce(() => response);

      try {
        await getStarWarsPlanets();
      } catch (e) {
        expect(e.message).toMatchInlineSnapshot(`"unable to make request"`);
        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(mockFetch).toHaveBeenCalledWith('https://swapi.dev/api/planets');
      }
    });
  });
});
