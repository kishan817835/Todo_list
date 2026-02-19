import transporter from "../utils/mailer.js";
import Task from "../models/task.model.js";
import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {OTP} from "../models/otp.model.js";


export const sendCustomMail = async (req, res) => {
  try {
    const { to, subject, text } = req.body;

    if (!to || !subject || !text) {
      return res.status(400).json({ 
        success: false, 
        error: "To, subject, and text are required" 
      });
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    });

    res.json({ success: true, message: "Custom mail sent successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
 

export const OTPMail = async(req,res)=>{

  const {email}=req.body;
 try{
  const validEmail = await userModel.findOne({email});
  if(!validEmail){
    return res.status(400).json({ success: false, error: "Invalid email" });
  }
  if(!email){
    return res.status(400).json({ success: false, error: "Email is required" });
  }
  const otp = Math.floor(100000 + Math.random() * 900000);
  const hashedOtp = await bcrypt.hash(otp.toString(), 10);



   await transporter.sendMail({

  from: `"Upsoma Consultancy" <${process.env.EMAIL_USER}>`,

  to: email,

  subject: "ToDo List Password Change — Upsoma Consultancy",

  html: `

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body style="margin:0; padding:0; background:#f0f4f3; font-family:Arial, sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0" style="
background:#ffffff;
margin:40px auto;
border-radius:12px;
overflow:hidden;
box-shadow:0 4px 15px rgba(0,0,0,0.08);
">

<!-- HEADER -->
<tr>
<td align="center" style="
background:linear-gradient(90deg,#cfe8dc,#b7d8c8);
padding:25px;
">

<img src="http://todo-list-steel-phi.vercel.app/public/logo.png"
alt="Upsoma Logo"
width="60"
style="margin-bottom:10px;">

<h2 style="
margin:0;
color:#1b4332;
">
Upsoma Consultancy
</h2>

<p style="
margin:5px 0 0;
color:#2d6a4f;
font-size:14px;
">
Secure Password Reset
</p>

</td>
</tr>


<!-- BODY -->
<tr>
<td style="padding:30px; text-align:center;">

<p style="font-size:16px; color:#333;">
Hello,
</p>

<p style="font-size:16px; color:#555;">
Use the OTP below to change your ToDo List account password:
</p>


<!-- OTP BOX -->
<div style="
font-size:36px;
letter-spacing:8px;
font-weight:bold;
color:#2d6a4f;
background:#e6f4ea;
padding:15px 25px;
border-radius:8px;
margin:25px auto;
display:inline-block;
border:1px solid #b7d8c8;
">

${otp}

</div>


<p style="color:#666; font-size:14px;">
This OTP is valid for <b>5 minutes</b>.
</p>

<p style="color:#888; font-size:13px;">
For security reasons, please do not share this OTP.
</p>


</td>
</tr>


<!-- FOOTER -->
<tr>
<td align="center" style="
background:#f8f9fa;
padding:20px;
font-size:12px;
color:#777;
">

© 2026 Upsoma Consultancy  
<br>
Web Development Services

</td>
</tr>


</table>

</td>
</tr>
</table>

</body>
</html>

`

});


    const otpDoc = new OTP({
      email,
      otp: hashedOtp
    });
    await otpDoc.save();

     res.json({ success: true, message: "OTP sent successfully " });


 }catch(err){
  res.status(500).json({ success: false, error: err.message });
 }
}
export const verifyEmailOTp = async (req, res) => {

  const { email, otp, newPassword } = req.body;

  try {

    if (!email || !otp || !newPassword) {

      return res.status(400).json({
        success: false,
        error: "Email, OTP and newPassword required"
      });

    }


    const otpDoc = await OTP.findOne({ email });

    if (!otpDoc) {

      return res.status(400).json({
        success: false,
        error: "OTP not found"
      });

    }
    if (new Date(otpDoc.expire).getTime() < Date.now()) {

      await OTP.deleteOne({ email });

      return res.status(400).json({
        success: false,
        error: "OTP expired"
      });

    }

    if (otpDoc.attempts >= 3) {

      await OTP.deleteOne({ email });

      return res.status(400).json({
        success: false,
        error: "Maximum attempts reached. Request new OTP"
      });

    }


    const isMatch = await bcrypt.compare(
      otp.toString(),
      otpDoc.otp
    );


    if (!isMatch) {

      otpDoc.attempts += 1;

      await otpDoc.save();
      if (otpDoc.attempts >= 3) {

        await OTP.deleteOne({ email });

        return res.status(400).json({
          success: false,
          error: "OTP failed 3 times. Deleted."
        });

      }


      return res.status(400).json({
        success: false,
        error: `Invalid OTP. Attempts left: ${3 - otpDoc.attempts}`
      });

    }

    const user = await userModel.findOne({ email });

    if (!user) {

      return res.status(400).json({
        success: false,
        error: "User not found"
      });

    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();


    // ✅ delete otp after success

    await OTP.deleteOne({ email });


    return res.json({

      success: true,
      message: "Password changed successfully"

    });


  }

  catch (err) {

    res.status(500).json({
      success: false,
      error: err.message
    });

  }

};







