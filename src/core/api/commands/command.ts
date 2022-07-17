import type { Awaitable } from "@davecode/types";
import type { UnknownCommandParameter } from "./parameters";
import type { ArgumentMap, ParametersBuilder } from "./parameters-builder";

type CommandCreationArgs<T extends UnknownCommandParameter[]> = {
  name: string;
  description: string;
  params: ParametersBuilder<T>;
  handle: (args: ArgumentMap<T>) => Awaitable<void>;
};

export class Command<T extends UnknownCommandParameter[]> {
  public name: string;
  public description: string;
  public params: ParametersBuilder<T>;
  public handle: (args: ArgumentMap<T>) => Awaitable<void>;

  constructor(args: CommandCreationArgs<T>) {
    this.name = args.name;
    this.description = args.description;
    this.params = args.params;
    this.handle = args.handle;
  }
}

// new Command({
//   name: "test",
//   description: "test",
//   params: new ParametersBuilder()
//     .string("test1", "test")
//     .number("test2", "test", { required: false })
//     .boolean("test3", "test", { defaultValue: false })
//     .param(new TrueIntegerCommandParameter("test4", "")),
//
//   handle: (args) => {
//     console.log(args.test1);
//     console.log(args.test2);
//     console.log(args.test3);
//     console.log(args.test4);
//   },
// });
