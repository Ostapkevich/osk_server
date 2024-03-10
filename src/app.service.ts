import { Injectable } from '@nestjs/common';
import { Global } from '@nestjs/common';
import POOLOPTIONS from 'src/common/pool-options';
import { Pool, createPool } from 'mysql2/promise';


@Global()
@Injectable()
export class AppService {
  private connection: Pool = createPool(POOLOPTIONS);;
  constructor() { }

  async query(...queries: string[]) {
    const data = await Promise.all(queries.map(query => this.connection.query(query)));
    return data;
  }

  async execute(sql: string, params: any) {
    const data = await this.connection.execute(sql, params);
    return data;
  }
 
 

  async executeMultiple(bodyData: any[] ,...queries: string[]) {
    const data = await Promise.all(queries.map((query, index) => this.connection.execute(query, bodyData[index])));
   
    return data;
 
  }
}
