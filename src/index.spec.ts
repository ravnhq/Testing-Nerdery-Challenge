import cases from 'jest-in-case';
import {
  isInteger,
  toLowerCase,
  removeDuplicatesFromArray,
  createRandomProduct,
  getStarWarsPlanets,
  createProduct,
} from './index';

function casify(subcases) {
  return Object.entries(subcases).map(([testName, testValue]) => {
    return {
      name: `${testValue} - ${testName}`,
      testValue,
    };
  });
}

function functionResultOrError(aFunction, argument) {
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
    const inLowerCase = toLowerCase(str);
    expect(inLowerCase).toMatchInlineSnapshot(`"Please provide a string"`);
  });

  test(`returns lowercase if string has length`, () => {
    const str = 'A Message';
    const inLowerCase = toLowerCase(str);
    expect(inLowerCase).toBe('a message');
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
    const array = ['1'];
    const removed = removeDuplicatesFromArray(array);
    expect(removed).toEqual(array);
  });

  cases(
    `returns number array without duplicates`,
    (subcase) =>
      expect(removeDuplicatesFromArray(subcase.testValue)).toEqual([1, 2, 3]),
    casify({
      uniques: [1, 2, 3],
      duplicated: [1, 1, 2, 2, 3, 3],
    }),
  );

  cases(
    `returns string array without duplicates`,
    (subcase) =>
      expect(removeDuplicatesFromArray(subcase.testValue)).toEqual(['a', 'b', 'c']),
    casify({
      uniques: ['a', 'b', 'c'],
      duplicated: ['a', 'a', 'b', 'b', 'c', 'c'],
    }),
  );
});

describe(`createProduct`, () => {
  test(`throw error if not a valid schema product`, () => {
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
  test(`throw error if user's role is not allowed`, () => {
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
  test(`returns body if request success or throw error if fails`, async () => {
    try {
      const response = await getStarWarsPlanets();
      expect(response).toMatchSnapshot();
    } catch (e) {
      expect(e).toMatchInlineSnapshot(`[Error: unable to make request]`);
    }
  });
});
