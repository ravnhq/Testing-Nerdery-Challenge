import cases from 'jest-in-case'
import {
  isInteger,
  toLowerCase,
  removeDuplicatesFromArray,
  createRandomProduct,
  getStarWarsPlanets,
  createProduct,
} from './index';


describe('isInteger',()=>{
  cases('should return',
  (opts) => {
    expect(isInteger(opts.value)).toBe(opts.result)
  },
  [
    {name:'true evaluating a number', value:123, result:true},
    {name:'true evaluating a negative number', value:-123, result:true},
    {name:'false evaluating a string', value:'1', result:false},
    {name:'false evaluating a float', value:1.25, result:false},
  ])
})

describe('toLowerCase',()=>{

  cases(`should return`,
  (opts) => {
    expect(toLowerCase(opts.value)).toEqual(opts.result)
  },
  [
    {name:'prueba when PrueBa is given', value:'PrueBa', result:'prueba'},
    {name:'the same string when a lowercase string is given', value:'lowercase', result:'lowercase'},
    {name:'return error when passing null or an empty string', value:null, result:'Please provide a string'},
  ])
})

describe('removeDuplicatesFromArray',()=>{

  cases(`should return`,
  (opts) => {
    expect(removeDuplicatesFromArray(opts.value)).toEqual(opts.result)
  },
  [
    {name:'[1,2,3] when [1,2,2,3,1] is evaluated', value:[1,2,2,3,1], result:[1,2,3]},
    {name:`['1','2','3'] when ['1','2','2','3','1'] is evaluated`, value:['1','2','2','3','1'], result:['1','2','3']},
    {name:'the same array when the array only has one element', value:['one'], result:['one']},
  ])

  cases('should throw an error',(opts)=>{
    expect(()=>removeDuplicatesFromArray(opts.value as any))
      .toThrowError(opts.result)
  },
  [
    {name: 'when there is no an array given', value:{}, result:'please provide an array of numbers or strings'}
  ])
})

describe('createRandomProduct', ()=>{

  it('should return a random product when giving a creator role email',()=>{
    const creatorEmail = 'clark@kent.com'
    expect(()=> createRandomProduct(creatorEmail)).not.toBeNull()
  })

  it('should throw an error when user does not have creator role', ()=>{
    const noCreatorUser = 'diana@themyscira.com'
    expect(()=> createRandomProduct(noCreatorUser))
      .toThrowErrorMatchingInlineSnapshot(`"You are not allowed to create products"`)
  })

  it('should throw an error when passing an invalid email', ()=>{
    const invalidEmail = 'invalidemail@fake.com'
    expect(()=> createRandomProduct(invalidEmail))
      .toThrowErrorMatchingInlineSnapshot(`"Cannot read properties of undefined (reading 'role')"`)
  })

})





