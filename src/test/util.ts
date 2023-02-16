import { Product } from '../index';
import { faker } from '@faker-js/faker';
import { randomInt } from 'crypto';

export function createTestProduct(overrides: Partial<Product> = {}): Product {
  return {
    name: faker.random.alphaNumeric(10),
    description: faker.random.alphaNumeric(10),
    price: randomInt(10),
    tags: ['anything'],
    ...overrides,
  };
}
