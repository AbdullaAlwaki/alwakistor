// توسيع واجهة NodeJS.Global لإضافة mongoose
import { Connection, Mongoose } from 'mongoose';

declare namespace NodeJS {
  interface Global {
    mongoose: {
      conn: Connection | null;
      promise: Promise<Mongoose> | null;
    };
  }
}