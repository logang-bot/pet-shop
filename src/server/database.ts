import mongoose from 'mongoose';

const db: string = process.env.DATABASE_LOCAL as string;

const connect = async () => {
  const dbData = await mongoose.connect(db);
  console.log(`Database ${dbData.connection.name} connected`);
};
export default connect;
