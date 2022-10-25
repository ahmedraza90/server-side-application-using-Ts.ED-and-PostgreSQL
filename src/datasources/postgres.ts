
import { registerProvider } from "@tsed/di";
import { Logger } from "@tsed/logger";
import { DataSource } from "typeorm";

export const POSTGRES_DATA_SOURCE = Symbol.for("PostgresDataSource");

export const PostgresDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "admin",
    database: "Blog",
    entities: [__dirname + '/../models/*{.ts,.js}'],
    synchronize: true,
  });   

  registerProvider<DataSource>({
    provide: POSTGRES_DATA_SOURCE,
    type: "typeorm:datasource",
    deps: [Logger],
    async useAsyncFactory(logger: Logger) {
      await PostgresDataSource.initialize();
  
      logger.info("Connected with typeorm to database: Postgres");
  
      return PostgresDataSource;
    },
    hooks: {
      $onDestroy(dataSource) {
        return dataSource.isInitialized && dataSource.close();
      }
    }
  });