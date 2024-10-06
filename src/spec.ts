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
});
