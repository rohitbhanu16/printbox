const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")

const userSchema =  mongoose.Schema({
  name: { type: String, required: true },
  username: {type:String, unique: true, required:true},
  email: { type: String, required: true },
  password: {type: String},
  googleId: {type:String},
  githubId: {type:String},
},
{timestamps: true}
);

userSchema.pre('save', async function(next) {
  if(!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
})

module.exports = mongoose.model("User", userSchema);