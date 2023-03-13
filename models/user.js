//Schema shows model how to structure the data, model allows us to use mongoose methods and functionality that lets us talk to the database
const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
//using the crypto feature that is part of node.js
const crypto = require('crypto');
//all caps = something that will never change
///ASK WHAT SALT ROUNDS DOES?
const SALT_ROUNDS = 6;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    //trim = blank space before or after we will ignore
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: true,
    },
    password: { type: String, trim: true, minLength: 7, required: true },
    bookmarks: [{ type: Schema.Types.ObjectId, ref: "Bookmark" }],
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        //not print out the password so we delete the password
        delete ret.password;
        //ret=return. so this deletes the password and returns all the rest of the document return info
        return ret;
      },
    },
  }
);
// preehook need more information on this?
userSchema.pre("save", async function (next) {
  //every time the password is the same, return the password
  if (!this.isModified("password")) return next();
  //if the password changed then use bcrypt to has the password and I'm not sure what salt rounds do
  //extra excryption. Needs to understand createHmac and sha 256 more
  const password = crypto.createHmac('sha256', process.env.SECRET).update(this.password).split('').reverse().join('')
  //this binds the password to the schema
  //bcrypt is how we encrypt the password
  this.password = await bcrypt.hash(password, SALT_ROUNDS);
});

//salt round = With "salt round" they actually mean the cost factor. 
//The cost factor controls how much time is needed to calculate a single BCrypt hash.
//The higher the cost factor, the more hashing rounds are done.

module.exports = model('User', userSchema)