import { PGlite } from "@electric-sql/pglite";
import { sql } from "@electric-sql/pglite/template";

export default function postgresLite() {
  const pg = new PGlite();

  function sqlFunction<T>(strings: TemplateStringsArray, ...values: any[]) {
    const template = sql(strings, ...values);

    template.then = (
      resolve: (value: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void
    ) =>
      pg
        .sql(strings, ...values)
        .then(({ rows }) => resolve(rows as T))
        .catch(reject);

    return template;
  }

  sqlFunction.end = () => pg.close();

  return sqlFunction;
}
