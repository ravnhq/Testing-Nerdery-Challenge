### Testing challenge
This challenge was created to help you practicing with some testing exercises.

#### How to use it?
- Download this repo and install its dependecies (npm install)
- Run `yarn start` to build the project
- All the code you need to test is in one single file `index.js`
- To run the tests use the command `yarn test` or `yarn test:watch`
- Run `yarn test:coverage` to generate the coverage report

#### How to test?
- Import the function you want to test from the `index.spect.ts` file, eg: import { isInteger } from './index';
- Some of the functions return an error or can have additional validations, make sure to test those scenarios

#### Notes:
- All the exported functions need to be tested
- You need to get at least 80% of coverage
- Feel free to install additional libraries if needed. Eg. jest-in-case
- The function `getStarWarsPlanets` needs to work even without internet conexion