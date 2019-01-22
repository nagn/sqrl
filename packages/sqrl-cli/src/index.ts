/**
 * Copyright 2018 Twitter, Inc.
 * Licensed under the Apache License, Version 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 */
// tslint:disable:no-console

import { docopt } from "docopt";
import { cliMain, CliDoc, getCliOutput } from "./cli/CliMain";
import { promiseFinally } from "sqrl-common";
import { CloseableGroup } from "./jslib/Closeable";
import { FunctionRegistry } from "sqrl";

export function run(registerFunctions?: (registry: FunctionRegistry) => void) {
  const args = docopt(CliDoc, {
    version: 0.1
  });

  const output = getCliOutput(args);
  const closeables = new CloseableGroup();
  let exitCode = 1;

  promiseFinally(
    cliMain(args, closeables, { registerFunctions, output })
      .catch(err => {
        output.compileError(err);
      })
      .then(() => {
        exitCode = 0;
      }),
    () => {
      closeables.close();
      process.exit(exitCode);
    }
  );
}
