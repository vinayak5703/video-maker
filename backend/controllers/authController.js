const User = require('../models/User');
const bcrypt = require('bcryptjs');

// REGISTER USER
exports.register = async (req, res) => {
  try {
    // 1. Terminal me print karo ki Frontend ne kya bheja
    console.log("Received Data from Frontend:", req.body);

    const { username, email, password } = req.body;

    // 2. Validation: Kya sab kuch bheja hai?
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields (Username, Email, Password)" });
    }

    // 3. Duplicate Check
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      console.log("Error: Email already exists");
      return res.status(400).json({ message: "This Email is already registered!" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log("Error: Username already exists");
      return res.status(400).json({ message: "This Username is already taken!" });
    }

    // 4. Password Encrypt & Save
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    console.log("Success: User Created!");
    res.status(200).json(user);

  } catch (err) {
    console.log("Server Error:", err);
    res.status(500).json({ message: "Server Error", error: err });
  }
};

// LOGIN USER
exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json({ message: "Wrong password" });

    // Send user info including ID
    res.status(200).json({ _id: user._id, username: user.username, email: user.email });
  } catch (err) {
    res.status(500).json(err);
  }
};