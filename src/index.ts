import faker from 'faker';
import fetch, { Response } from 'node-fetch';
import users from './utils/users';
import { createProductSchema } from './utils/product.schema';

interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  tags: string[];
}
xdescribe;
function isInteger(value: number | string) {
  return Number.isInteger(value);
}

function toLowerCase(str: string) {
  if (!str) return 'Please provide a string';
  return str.toLowerCase();
}

function removeDuplicatesFromArray(arrayOfNumbers: (string | number)[]) {
  if (!Array.isArray(arrayOfNumbers)) {
    throw new Error('please provide an array of numbers or strings');
  }
  if (arrayOfNumbers.length === 1) {
    return arrayOfNumbers;
  }
  return arrayOfNumbers.filter((e, pos) => {
    return arrayOfNumbers.indexOf(e) === pos;
  });
}

const createProduct = (product: Product) => {
  const isValid = createProductSchema.validate(product);

  if (isValid.error) {
    throw new Error(JSON.stringify(isValid.error.details));
  }
  return {
    id: faker.datatype.number(),
    ...product,
  };
};

const createFakeProduct = (): Product => {
  return {
    id: faker.datatype.number(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    tags: [faker.commerce.productMaterial(), faker.commerce.color()],
  };
};

const createRandomProduct = (email: string) => {
  const userRole: string = users.find((user) => user.email === email).role;
  const creatorRoles: string[] = ['creator'];
  if (!creatorRoles.includes(userRole)) {
    throw new Error('You are not allowed to create products');
  }
  return createFakeProduct();
};

const getStarWarsPlanets = async () => {
  try {
    const response = await fetch('https://swapi.dev/api/planets');
    const body = await response.json();
    return body;
  } catch (e) {
    throw new Error('unable to make request');
  }
};

export {
  isInteger,
  toLowerCase,
  removeDuplicatesFromArray,
  createRandomProduct,
  getStarWarsPlanets,
  createProduct,
  createFakeProduct,
};
