/**
 * Raw parameter type, used by connectors to fetch data from user
 *
 * Don't instantiate this directly, connectors only check for a predefined set of constants
 */

export class RawParameterType<Type> {
  /**
   * Placeholder value, only used for type-safety
   */
  public placeholder: Type;

  public constructor(placeholder: Type) {
    this.placeholder = placeholder;
  }
}

/**
 * Parameter can either be required, non-required, or non-required with default value
 *
 * In first and third case, command handler can and should expect argument to always be present and never be
 * `undefined` (unless parameter specifically allows that), while in the second case handler functions should expect to
 * possibly be `undefined`
 */
export type CommandRequirementOptions<T> =
  | CommandParameterOptionsRequired
  | CommandParameterOptionsNonRequired
  | CommandParameterOptionsDefault<T>;

export type CommandParameterOptionsRequired = {
  required: true;
};
export type CommandParameterOptionsNonRequired = {
  required: false;
};
export type CommandParameterOptionsDefault<T> = {
  defaultValue: T;
};
/**
 * Base options allowed by all parameters
 */
export type CommandParameterOptions<T> = CommandRequirementOptions<T> | object;

/**
 * Helper function to check if options allow creation of `undefined`-able parameter return value
 *
 * Connectors should assume that parameter is required unless specified otherwise, so we can just check for case when
 * parameter is required but does not have default
 */
export type IsParameterRequiredOrHasDefault<T extends CommandParameterOptions<unknown>> =
  T extends CommandParameterOptionsNonRequired
    ? T extends CommandParameterOptionsDefault<unknown>
      ? true
      : false
    : true;

export type ParameterEnumValue<Value, RawValue> = {
  name: string;
  value: Value;
  raw: RawValue;
};

/**
 * Command parameter class, used to interact between raw data returned by the connector and data required by the system
 */
export abstract class CommandParameter<
  Name extends string,
  Options extends CommandParameterOptions<ReturnType>,
  ReturnType,
  RawType
> {
  public readonly name: Name;
  public readonly description: string;
  public readonly options?: Options;
  /**
   * Enum parameter, used by connectors to dictate, which values are allowed in this variable
   */
  public readonly enum: ParameterEnumValue<ReturnType, RawType>[];

  constructor(name: Name, description: string, options?: Options) {
    this.name = name;
    this.description = description;
    this.options = options;
    this.enum = this.fillEnum();
  }

  abstract getRawType(): RawParameterType<RawType>;

  abstract getValue(rawValue: RawType): ReturnType;

  /**
   * fills {@link CommandParameter.enum} with valid options
   *
   * This method is called only once, in class constructor. Default implementation doesn't dictate any enumeration
   * options for the parameter
   * @returns enumerations options, or an empty array if enumeration is not present for this parameter
   */
  protected fillEnum(): ParameterEnumValue<ReturnType, RawType>[] {
    return [];
  }
}

export type UnknownCommandParameter = CommandParameter<string, CommandParameterOptions<unknown>, unknown, unknown>;
