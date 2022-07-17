import type { Object as O, Union } from "ts-toolbelt";

export type AbstractType<T, Args extends Array<unknown> = never[]> = abstract new (...args: Args) => T;
export type Type<T, Args extends Array<unknown> = never[]> = new (...args: Args) => T;

/**
 * Utility type to either append `Value` to `MaybeTuple`, or create new tuple with `Value` as the only element if
 * `MaybeTuple` isn't a tuple
 */
export type TuplePush<MaybeTuple, Value> = MaybeTuple extends [...infer R] ? [...R, Value] : [Value];

/**
 * Makes all fields, whose value undefinable, into optional fields
 */
export type MakeUndefinedFieldsOptional<T extends O.Object> = O.Pick<T, Union.Exclude<keyof T, O.UndefinableKeys<T>>> &
  O.Partial<O.Pick<T, O.UndefinableKeys<T>>>;

// export const keys: <T>(obj: T) => (keyof T)[] = Object.getOwnPropertyNames as <T>(obj: T) => (keyof T)[];

// export const values: <T>(obj: T) => T[keyof T][] = <T>(obj: T) => {
//   const values: T[keyof T][] = [];
//   for (const key of keys(obj)) {
//     values.push(obj[key]);
//   }
//   return values;
// };
