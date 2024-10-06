import postgres from "postgres";
import postgresLite from "./index";

describe("postgres-lite", () => {
  const postgresSql = postgres();
  afterAll(async () => postgresSql.end());

  const postgresLiteSql = postgresLite();
  afterAll(async () => postgresLiteSql.end());

  it("should be awaitable", async () => {
    expect(await postgresSql`select 1`).toEqual(await postgresLiteSql`select 1`);
  });

  it("should work as a fragment", async () => {
    await _(postgresSql);
    await _(postgresLiteSql as typeof postgresSql);
    async function _(sql: typeof postgresSql) {
      const fragment = sql`select 1`;
      expect(await sql`select (${fragment})`).toEqual([{ "?column?": 1 }]);
    }
  });
});
