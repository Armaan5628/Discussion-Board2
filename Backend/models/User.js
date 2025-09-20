const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  phone: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        // North American Numbering Plan: (123) 456-7890 or 123-456-7890 or 1234567890
        return /^(\+1[-\s]?)?\(?[2-9][0-9]{2}\)?[-\s]?[0-9]{3}[-\s]?[0-9]{4}$/.test(v);
      },
      message: props => `${props.value} is not a valid North American phone number!`
    }
  },
  password: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
