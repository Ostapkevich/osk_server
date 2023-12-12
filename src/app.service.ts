import { Injectable } from '@nestjs/common';
import { Global } from '@nestjs/common';
import POOLOPTIONS from 'src/common/pool-options';
import { Pool, createPool } from 'mysql2/promise';

@Global()
@Injectable()
export class AppService {
    connection: Pool= createPool(POOLOPTIONS);;
    constructor() {
        //this.connection 
      }
     
}
