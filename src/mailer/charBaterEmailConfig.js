const express = require("express");
const sendEmail = require("./emailSender");

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Simulate saving the user to a database
    const {fullName, phoneNumber, password, email} = req.body

    // Send welcome email
    const emailContent = `
      <h1>Welcome to Our App, ${fullName}!</h1>
      <p>Thank you for registering. We're thrilled to have you on board.</p>
      <p>If you have any questions, feel free to reply to this email.</p>
      <p>Best regards,<br/>Your App Team</p>
    `;
    await sendEmail(email, "Welcome to Our App!", emailContent);

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Error during registration: ", error);
    res.status(500).json({ message: "Registration failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
