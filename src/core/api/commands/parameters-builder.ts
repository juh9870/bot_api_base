import type { TuplePush } from "../../helpers";
import type {
  CommandParameter,
  CommandParameterOptions,
  IsParameterRequiredOrHasDefault,
  UnknownCommandParameter,
} from "./parameters";
import type { Compute } from "ts-toolbelt/out/Any/Compute";
import type { ForceSimplify } from "@davecode/types";
import type { List } from "ts-toolbelt";

// type SimpleCommandParameterConstructor<
//   Name extends string,
//   T,
//   Options extends EnumerableCommandParameterOptions<T>,
//   ReturnType extends ExtractTypeFromEnumerableOptions<Options, T> = ExtractTypeFromEnumerableOptions<Options, T>
// > = {
//   new (name: Name, description: string, options?: Options): CommandParameter<Name, Options, ReturnType, ReturnType>;
// };

export class ParametersBuilder<T extends UnknownCommandParameter[] = []> {
  // public string = this.simple<string>(StringCommandParameter);
  // public integer = this.simple<number>(IntegerCommandParameter);
  // public number = this.simple<number>(NumberCommandParameter);
  private parameters: UnknownCommandParameter[] = [];

  // public boolean = this.simple<boolean>(BooleanCommandParameter);
  public param<Name extends string, Options extends CommandParameterOptions<VariableType>, VariableType, RawType>(
    param: CommandParameter<NameValidator<Name, T>, Options, VariableType, RawType>
  ): ParametersBuilder<TuplePush<T, CommandParameter<Name, Compute<Options>, VariableType, RawType>>> {
    this.parameters.push(param);
    return this as unknown as ParametersBuilder<
      TuplePush<T, CommandParameter<Name, Compute<Options>, VariableType, RawType>>
    >;
  }

  public getParametersList(): T {
    return this.parameters as T;
  }

  // private simple<BaseType>(
  //   ctor: SimpleCommandParameterConstructor<string, BaseType, EnumerableCommandParameterOptions<unknown>>
  // ): <
  //   Name extends string,
  //   Options extends EnumerableCommandParameterOptions<BaseType> = CommandParameterOptionsRequired
  // >(
  //   name: NameValidator<Name, T>,
  //   description: string,
  //   options?: Options
  // ) => ParametersBuilder<
  //   TuplePush<
  //     T,
  //     SimpleCommandParameter<
  //       Name,
  //       Options,
  //       ExtractTypeFromEnumerableOptions<Options, BaseType>,
  //       ExtractTypeFromEnumerableOptions<Options, BaseType>
  //     >
  //   >
  // > {
  //   return <
  //     Name extends string,
  //     Options extends EnumerableCommandParameterOptions<BaseType> = CommandParameterOptionsRequired
  //   >(
  //     name: NameValidator<Name, T>,
  //     description: string,
  //     options?: Options
  //   ) => {
  //     this.parameters.push(new ctor(name, description, options));
  //     return this as unknown as ParametersBuilder<
  //       TuplePush<
  //         T,
  //         SimpleCommandParameter<
  //           Name,
  //           Options,
  //           ExtractTypeFromEnumerableOptions<Options, BaseType>,
  //           ExtractTypeFromEnumerableOptions<Options, BaseType>
  //         >
  //       >
  //     >;
  //   };
  // }
}

type ExtractValues<T extends Record<number, UnknownCommandParameter>> = {
  [k in keyof T as T[k] extends CommandParameter<infer Name, CommandParameterOptions<unknown>, unknown, unknown>
    ? Name
    : never]: T[k] extends CommandParameter<string, infer O, infer R, unknown>
    ? IsParameterRequiredOrHasDefault<O> extends true
      ? R
      : R | undefined
    : null;
};

type UsedNames<T extends [...UnknownCommandParameter[]]> = {
  [k in keyof T]: T[k] extends CommandParameter<infer Name, CommandParameterOptions<unknown>, unknown, unknown>
    ? Name
    : never;
}[number];

type NameValidator<Name extends string, T extends [...UnknownCommandParameter[]]> = Name extends UsedNames<T>
  ? `Parameter with the name '${Name}' already exists`
  : Name;

export type ArgumentMap<T extends [...UnknownCommandParameter[]]> = ForceSimplify<ExtractValues<List.ObjectOf<T>>>;
