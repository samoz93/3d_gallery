import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { DbErrors } from 'src/utils';

@Injectable()
export class DbService {
  _db: typeof mongoose;
  constructor() {
    this.initconnection();
  }

  async initconnection() {
    try {
      this._db = await mongoose.connect('mongodb://mongo:27017', {
        auth: {
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
        },
        dbName: 'mainDB',
      });
    } catch (error) {
      throw new DbErrors('connection', error);
    }
  }
}
