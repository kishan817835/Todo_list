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

  from: `"Upsoma Consultancy" <onboarding@resend.dev>`,

  to: email,

  subject: "ToDo List Password Change — Upsoma Consultancy",

  html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset OTP - Upsoma Consultancy</title>
</head>
<body style="margin: 0; padding: 20px; background: linear-gradient(135deg, #f0f9f0 0%, #ffffff 100%); font-family: Arial, sans-serif;">
    
    <table width="100%" cellpadding="0" cellspacing="0" align="center" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <tr>
            <td style="background: linear-gradient(135deg, #d4f1d4 0%, #a8d5a8 100%); padding: 40px 30px; text-align: center;">
                <h1 style="color: #2d5016; font-size: 28px; margin: 0 0 8px 0; font-weight: 700;">Upsoma Consultancy</h1>
                <p style="color: #4a7c59; font-size: 16px; margin: 0; font-weight: 300;">Secure Password Reset Service</p>
            </td>
        </tr>
        
        <!-- Body -->
        <tr>
            <td style="padding: 50px 40px; text-align: center;">
                <h2 style="font-size: 24px; color: #2d3748; margin: 0 0 20px 0; font-weight: 600;">Hello! 👋</h2>
                <p style="font-size: 16px; color: #4a5568; margin: 0 0 35px 0; line-height: 1.8;">
                    We received a request to reset your password for your ToDo List account. 
                    Use the verification code below to proceed with creating your new password.
                </p>
                
                <!-- OTP Container -->
                <div style="background: #f0f9f0; border: 2px solid #a8d5a8; border-radius: 15px; padding: 30px; margin: 35px auto; max-width: 400px;">
                    <div style="font-size: 14px; color: #4a7c59; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; font-weight: 600;">Your Verification Code</div>
                    <div style="font-size: 42px; font-weight: 800; letter-spacing: 12px; color: #4a7c59; margin: 20px 0; font-family: 'Courier New', monospace;">${otp}</div>
                    <div style="font-size: 14px; color: #4a7c59; margin-top: 20px;">
                        ⏰ This code expires in <strong>5 minutes</strong>
                    </div>
                </div>
                
                <!-- Security Note -->
                <div style="background: #f0f9f0; border-left: 4px solid #4a7c59; padding: 15px 20px; margin: 30px 0; border-radius: 8px; font-size: 14px; color: #2d5016; text-align: left;">
                    <strong style="color: #2d5016;">🔒 Security Reminder:</strong> For your protection, never share this verification code 
                    with anyone. Our team will never ask for your OTP via email, phone, or chat.
                </div>
                
                <p style="font-size: 16px; color: #4a5568; margin: 0 0 35px 0; line-height: 1.8;">
                    If you didn't request this password reset, you can safely ignore this email. 
                    Your account remains secure.
                </p>
            </td>
        </tr>
        
        <!-- Footer -->
        <tr>
            <td style="background: #f0f9f0; padding: 30px; text-align: center; border-top: 1px solid #a8d5a8;">
                <p style="color: #4a7c59; font-size: 14px; margin: 0 0 10px 0;">
                    © 2026 Upsoma Consultancy | Web Development Services
                </p>
                <div style="display: flex; justify-content: center; gap: 20px; margin-top: 15px; flex-wrap: wrap;">
                    <a href="https://www.upsoma.in/" style="color: #4a7c59; text-decoration: none; font-size: 13px; font-weight: 600;">Visit Our Website</a>
                    <a href="#" style="color: #4a7c59; text-decoration: none; font-size: 13px;">Privacy Policy</a>
                    <a href="#" style="color: #4a7c59; text-decoration: none; font-size: 13px;">Terms of Service</a>
                    <a href="#" style="color: #4a7c59; text-decoration: none; font-size: 13px;">Contact Support</a>
                </div>
                <p style="color: #4a7c59; font-size: 12px; margin: 15px 0 0 0; font-style: italic;">
                    Powered by ToDo List App - Upsoma Consultancy
                </p>
            </td>
        </tr>
        
    </table>
    
</body>
</html>`

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







