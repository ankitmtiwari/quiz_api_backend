import mongoose from "mongoose";

// const dbUrl = "mongodb://localhost:27017/";

const dbName = "quizzer";

const connectDB = async (dbUrl) => {
  try {
    await mongoose.connect(`${dbUrl}${dbName}`).then(() => {
      console.log("DB Connection Success");
    });

    // await mongoose
    //   .Collection("Question")
    //   .createIndex({ question: 1, level: 1, timeRequired: 1 }, { unique: true })
    //   .catch((err) => {
    //     console.log(err);
    //   });

    // Create compound index

    // console.log("Compound index created successfully!");
  } catch (error) {
    console.log(`Error while connecting to database ${error}`);
    process.exit(1);
  }
};

export default connectDB;
