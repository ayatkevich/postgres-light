import { PGlite } from "@electric-sql/pglite";
// @ts-ignore
import { identifier, sql } from "@electric-sql/pglite/template";

export default function postgresLite() {
  const pg = new PGlite();

  function sqlFunction<T>(
    ...args: [strings: TemplateStringsArray, ...values: any[]] | [identifier: string]
  ) {
    if (args.length === 1 && typeof args[0] === "string") {
      return identifier`${args[0]}`;
    }

    args = args as [strings: TemplateStringsArray, ...values: any[]];

    const template = sql(...args);

    template.then = (
      resolve: (value: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void
    ) =>
      pg
        .sql(...args)
        .then(({ rows }) => resolve(rows as T))
        .catch(reject);

    return template;
  }

  sqlFunction.end = () => pg.close();

  return sqlFunction;
}
