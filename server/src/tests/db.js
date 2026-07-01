import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod;

export const connect = async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  console.log('Test MongoDB connected');
};

export const closeDatabase = async () => {
  if (mongoose.connection.readyState) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod?.stop();
    console.log('Test MongoDB connection closed');
  }
};

export const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  await Promise.all(Object.values(collections).map(collection => collection.deleteMany({})));
  console.log('Test MongoDB collections cleared');
};