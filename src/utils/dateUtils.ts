import { TEST_DATE, USE_TEST_DATE } from './testConfig';

export function getCurrentDate(): Date {
  return USE_TEST_DATE ? TEST_DATE : new Date();
}