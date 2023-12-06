
import { PoolOptions } from 'mysql2';
import { config } from 'dotenv';
config();
const POOLOPTIONS: PoolOptions = {
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  waitForConnections: true,//Если значение установлено в true, то запросы, поступающие во время отсутствия доступных соединений в пуле, будут ожидать освобождения соединения.
  connectionLimit: 10,
  maxIdle: 10, //  максимальное количество неактивных (idle) соединений, которые могут быть сохранены в пуле соединений.
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,//Максимальное количество запросов, которые могут быть поставлены в очередь, когда все соединения в пуле заняты
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};
export default POOLOPTIONS;
