import {
  isInteger,
  toLowerCase,
  removeDuplicatesFromArray,
  createRandomProduct,
  getStarWarsPlanets,
  createProduct 
} from './index';

describe('isInteger',()=>{
  it('should return true if the value is integer',()=>{
    const expected = true;
    const value = 1;
    const result = isInteger(value);
    expect(result).toBe(expected);
  })
  it('should be string',()=>{
    const expected = false;
    const value = "1";
    const result = isInteger(value);
    expect(result).toBe(expected);
  })
})

describe('toLowerCase', ()=>{
  it('should return deaulft message if the value is an empty string', ()=>{
    const defaultMessage = 'Please provide a string';
    const result = toLowerCase("");
    const expected = defaultMessage;
    expect(result).toBe(expected);
  })
  it('should return a message in lower case', ()=>{
    const result = toLowerCase("MeSsAgE 2022");
    const expected = "message 2022"
    expect(result).toBe(expected);
  })
})

describe('removeDuplicatesFromArray',()=>{
  it('should return the same array if the size is one', ()=>{
    const value = [1];
    const result = removeDuplicatesFromArray(value);
    const expected = [1];
    expect(result).toStrictEqual(expected);
  })
  it('should return the array without duplicates elements', ()=>{
    const value = [1, 2, 3, "cuatro", 2, 4];
    const result = removeDuplicatesFromArray(value);
    const expected = [1, 2, 3, "cuatro", 4];
    expect(result).toStrictEqual(expected);
  })
  it('should return an error if the value is not an array', ()=>{
    const value = {} as any;
    const result = () => removeDuplicatesFromArray(value);
    const expected = "please provide an array of numbers or strings";
    expect(result).toThrow(expected);
  })
})

describe('createProduct',() => {
  const value = {
    name: 'productName',
    description: 'description product',
    tags: ['tag'],
    price: 1.11,
  };

  const result = createProduct(value);
  const expected = {
    id: expect.any(Number),
    ...value,
  }

  it('should return valid Product', () => {
    expect(result).toEqual(expected);
  });

  it('should return an error if name is not valid', () => {
    const invalidProduct = value;
    invalidProduct.name = "Lorem ipsum dolor sit amet. Ex eveniet odio qui fugit incidunt ea praesentium mollitia ut quibusdam obcaecati qui explicabo minima."
    const result = ()=> createProduct(invalidProduct);
    expect(result).toThrow();
  });

  it('should return an error if description is not valid', () => {
    const invalidProduct = value;
    invalidProduct.description = "Lorem ipsum dolor sit amet. Ex eveniet odio qui fugit incidunt ea praesentium mollitia ut quibusdam obcaecati qui explicabo minima."
    const result = ()=> createProduct(invalidProduct);
    expect(result).toThrow();
  });

  it('should return an error if tag is not valid', () => {
    const invalidProduct = value;
    invalidProduct.tags = [];
    const result = ()=> createProduct(invalidProduct);
    expect(result).toThrow();
  });  

  it('should return an error if tag is not valid', () => {
    const invalidProduct = value;
    invalidProduct.tags = [];
    const result = ()=> createProduct(invalidProduct);
    expect(result).toThrow();
  });

  it('should return an error if price is not valid', () => {
    const invalidProduct = value;
    invalidProduct.price = -12.3;
    const result = ()=> createProduct(invalidProduct);
    expect(result).toThrow();
  });

})

/* describe('createFakeProduct', () => {
  const expected = {
    id: expect.any(Number),
    name: expect.any(String),
    description: expect.any(String),
    tags: expect.any(Array),
    price: expect.any(String),
  }
  
  it('should return a valid product', () => {
    const result = createFakeProduct();
    expect(result).toEqual(result);
  })
}) */

describe('createRandomProduct', () => {
  it('should return a product of creator user', () => {
    const expected = {
      id: expect.any(Number),
      name: expect.any(String),
      description: expect.any(String),
      tags: expect.any(Array),
      price: expect.any(String),
    }
    const value = 'clark@kent.com'
    const result = createRandomProduct(value);
    expect(result).toEqual(expected);
  })

  it('should return an exception if the user is not a creator', () => {
    const defaultMessage = "You are not allowed to create products";
    const value = "bruce@wayne.com";
    const result = ()=> createRandomProduct(value);
    const expected = defaultMessage;
    expect(result).toThrow(expected);
  })
})

describe('getStarWarsPlanets', ()=>{
  it('should return a list of planets in JSON format', async ()=>{
    const result = await getStarWarsPlanets();
    const expected = {
      count: 60,
      next: 'https://swapi.dev/api/planets/?page=2', 
      previous: null, 
      results: expect.any(Array),
    }
    expect(result).toEqual(expected);
  });
  
})
