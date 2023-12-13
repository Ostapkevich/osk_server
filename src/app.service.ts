import { Injectable } from '@nestjs/common';
import { Global } from '@nestjs/common';
import POOLOPTIONS from 'src/common/pool-options';
import { Pool, createPool } from 'mysql2/promise';


@Global()
@Injectable()
export class AppService {
  connection: Pool = createPool(POOLOPTIONS);;
  constructor() { }

  async getData(...queries: string[]) {
    const data = await Promise.all(queries.map(query => this.connection.query(query)));
    return data;
  }

}
