const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true,"name musn't be empty"],
      trim: true,
      min: [2,"name must be min 2 characters"],
      max: [30,"name must be max 30 characters"],
    },
    surname: {
      type: String,
      required: [true,"surname musn't be empty"],
      trim: true,
      min: [2,"surname must be min 2 characters"],
      max: [30,"surname must be min 2 characters"],
    },
    email: {
      type: String,
      unique: [true,"email must be unique"],
      lowercase: true,
      required: [true,"email is compulsory"],
    },
    password: {
      type: String,
      required: true,
      trim: true,
      min: [3, "password must be min 3 characters"]
    },
  },
//   collection kısmı kaydedilecek olan collection u gösterirken
//  timestamp CreatedAt UpdatedAt otomatik olarak geçsin diye yazılır
  { collection: "users", timestamps: true }
);
// The first argument is the singular name of the collection your model is for. 
// Mongoose automatically looks for the plural, lowercased version of your model name. 
const User = mongoose.model("User", userSchema);

module.exports = {
    User,
}
