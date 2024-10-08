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

  it("should support values", async () => {
    await _(postgresSql);
    await _(postgresLiteSql as typeof postgresSql);
    async function _(sql: typeof postgresSql) {
      expect(await sql`select ${1}`).toEqual([{ "?column?": "1" }]);
      expect(await sql`select ${"hello"}`).toEqual([{ "?column?": "hello" }]);
      expect(await sql`select ${true}::boolean`).toEqual([{ bool: true }]);
    }
  });

  it("should act as identifier", async () => {
    await _(postgresSql);
    await _(postgresLiteSql as typeof postgresSql);
    async function _(sql: typeof postgresSql) {
      await expect(sql`select * from ${sql("pg_class")}`).resolves.toBeTruthy();
    }
  });
});
