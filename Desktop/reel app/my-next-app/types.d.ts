import { Connection } from "mongoose";

declare global {
 var mongoose: {
    conn: connection | null;
    promise: Promise<Connection> | null;
  };
}

// if (!global.mongoose) {
//     global.mongoose = {
//         conn: connection | null,
//         promise: Promise<Connection> | null
//     };
//   }
export {};
