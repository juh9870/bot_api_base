/**
 *  Default raw parameters, supported by all connectors
 */
import { CommandParameter, CommandParameterOptions, ParameterEnumValue, RawParameterType } from "./parameters";

export const stringParameterType = new RawParameterType<string>("");
export const integerParameterType = new RawParameterType<number>(0);
export const numberParameterType = new RawParameterType<number>(0);
export const booleanParameterType = new RawParameterType<boolean>(false);

/**
 * Dictates which options are allowed by the parameter
 */
export type CommandParameterEnum<T> = {
  enum?: OptionsEnum<T>;
};
export type OptionsEnum<T> = { [Value in T as string]: Value };

export type ExtractTypeFromEnumerableOptions<T, Fallback> = T extends CommandParameterEnum<infer R>
  ? unknown extends R
    ? Fallback
    : R
  : Fallback;

export type EnumerableCommandParameterOptions<T> = CommandParameterEnum<T> & CommandParameterOptions<T>;

export abstract class SimpleCommandParameter<
  Name extends string,
  Options extends EnumerableCommandParameterOptions<ReturnType>,
  ReturnType extends RawType,
  RawType
> extends CommandParameter<Name, Options, ReturnType, RawType> {
  getValue(rawValue: RawType): ReturnType {
    return rawValue as ReturnType;
  }

  protected override fillEnum(): ParameterEnumValue<ReturnType, RawType>[] {
    const data = this.options?.enum;
    if (!data) return [];
    const options: ParameterEnumValue<ReturnType, RawType>[] = [];
    for (const name of Object.getOwnPropertyNames(data)) {
      options.push({
        name: name,
        value: data[name],
        raw: data[name],
      });
    }
    return options;
  }
}
export class IntegerCommandParameter<
  T extends number,
  ReturnType extends ExtractTypeFromEnumerableOptions<Options, T>,
  Name extends string,
  Options extends EnumerableCommandParameterOptions<T> = object
> extends SimpleCommandParameter<Name, Options, ReturnType, number> {
  getRawType(): RawParameterType<number> {
    return integerParameterType;
  }

  protected override fillEnum(): ParameterEnumValue<ReturnType, number>[] {
    const data = super.fillEnum();
    for (const entry of data) {
      if (Math.trunc(entry.raw) !== entry.raw) {
        throw new Error(`Got decimal number ${entry.raw} where integer was expected`);
      }
    }
    return data;
  }
}

// export class NumberCommandParameter<
//   T extends number,
//   Options extends EnumerableCommandParameterOptions<T>,
//   ReturnType extends ExtractTypeFromEnumerableOptions<Options, T>,
//   Name extends string
// > extends SimpleCommandParameter<Name, Options, ReturnType, number> {
//   getRawType(): RawParameterType<number> {
//     return numberParameterType;
//   }
// }
//
// export class StringCommandParameter<
//   T extends string,
//   Options extends EnumerableCommandParameterOptions<T>,
//   ReturnType extends ExtractTypeFromEnumerableOptions<Options, T>,
//   Name extends string
// > extends SimpleCommandParameter<Name, Options, ReturnType, string> {
//   getRawType(): RawParameterType<string> {
//     return stringParameterType;
//   }
// }
//
// export class BooleanCommandParameter<
//   T extends boolean,
//   Options extends EnumerableCommandParameterOptions<T>,
//   ReturnType extends ExtractTypeFromEnumerableOptions<Options, T>,
//   Name extends string
// > extends SimpleCommandParameter<Name, Options, ReturnType, boolean> {
//   getRawType(): RawParameterType<boolean> {
//     return booleanParameterType;
//   }
// }
