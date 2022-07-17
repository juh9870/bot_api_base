import { IntegerCommandParameter } from "./core/api/commands/predefined-parameters";
import { ArgumentMap, ParametersBuilder } from "./core/api/commands/parameters-builder";

const builder = new ParametersBuilder()
  .param(new IntegerCommandParameter("tested", "", { enum: { a: 5, b: 3 } }))
  .getParametersList();

type map = ArgumentMap<typeof builder>;
