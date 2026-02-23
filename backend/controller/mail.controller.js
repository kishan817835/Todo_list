import transporter from "../utils/mailer.js";
import Task from "../models/task.model.js";
import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {OTP} from "../models/otp.model.js";

const sentEmailsToday = new Set();

// Email Queue System - FIFO
class EmailQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
    this.processingInterval = null;
  }

  // Add emails to queue
  add(emails, task) {
    console.log(`📥 Adding ${emails.length} emails to queue for task: ${task.title}`);
    
    for (const email of emails) {
      this.queue.push({
        email,
        task,
        timestamp: new Date(),
        taskId: task._id,
        taskTitle: task.title
      });
    }
    
    console.log(`📊 Queue size: ${this.queue.length} emails`);
    
    // Start processing if not already running
    if (!this.isProcessing) {
      this.startProcessing();
    }
  }

  // Start processing queue
  async startProcessing() {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    console.log(`🚀 Starting email queue processing...`);
    
    // Process 1 email every second
    this.processingInterval = setInterval(async () => {
      if (this.queue.length === 0) {
        this.stopProcessing();
        return;
      }
      
      const emailItem = this.queue.shift(); // FIFO - First In First Out
      await this.sendEmail(emailItem);
    }, 1000); // 1 second delay
  }

  // Send individual email
  async sendEmail(emailItem) {
    try {
      console.log(`📧 Sending to: ${emailItem.email} (Queue: ${this.queue.length} remaining)`);
      
      await transporter.sendMail({
        from: '"Upsoma Consultancy" <noreply@upsoma.in>',
        to: emailItem.email,
        subject: `Task Reminder: ${emailItem.taskTitle} — Upsoma Consultancy`,
        replyTo: 'support@upsoma.in',
        headers: {
          'X-Priority': '3',
          'X-Mailer': 'Upsoma Consultancy Mailer',
          'List-Unsubscribe': '<mailto:unsubscribe@upsoma.in>'
        },
        html: this.generateEmailTemplate(emailItem.task)
      });
      
      console.log(`✅ Email sent to: ${emailItem.email}`);
      
    } catch (error) {
      console.error(`❌ Failed to send to ${emailItem.email}:`, error.message);
    }
  }

  // Generate email template
  generateEmailTemplate(task) {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Task Reminder - Upsoma Consultancy</title>
</head>

<body style="margin:0;padding:20px;background:linear-gradient(135deg,#f0f9f0 0%,#ffffff 100%);font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" align="center"
style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.1);">

<tr>
<td style="background:linear-gradient(135deg,#d4f1d4 0%,#a8d5a8 100%);padding:40px 30px;text-align:center;">

<h1 style="color:#2d5016;font-size:28px;margin:0 0 8px 0;font-weight:700;">
Upsoma Consultancy
</h1>

<p style="color:#4a7c59;font-size:16px;margin:0;font-weight:300;">
Task Reminder Service
</p>

</td>
</tr>

<tr>
<td style="padding:50px 40px;text-align:center;">

<h2 style="font-size:24px;color:#2d3748;margin:0 0 20px 0;font-weight:600;">
Task Reminder ⏰
</h2>

<div style="background:#f0f9f0;border:2px solid #a8d5a8;border-radius:15px;padding:30px;margin:35px auto;max-width:500px;text-align:left;">

<h3 style="color:#2d5016;font-size:20px;margin:0 0 15px 0;font-weight:600;">
${task.title}
</h3>

<p style="color:#4a5568;font-size:16px;margin:0 0 20px 0;line-height:1.6;">
${task.description || 'No description provided'}
</p>

<table style="width:100%;border-collapse:collapse;">
<tr>
<td style="padding:10px 0;border-bottom:1px solid #e2e8f0;">
<strong style="color:#4a7c59;">Priority:</strong> 
<span style="color:#2d3748;">${task.priority || 'Medium'}</span>
</td>
</tr>
<tr>
<td style="padding:10px 0;border-bottom:1px solid #e2e8f0;">
<strong style="color:#4a7c59;">Due Date:</strong> 
<span style="color:#2d3748;">${task.dueDate || 'Not set'}</span>
</td>
</tr>
${task.deadlineTime ? `
<tr>
<td style="padding:10px 0;border-bottom:1px solid #e2e8f0;">
<strong style="color:#4a7c59;">Time:</strong> 
<span style="color:#2d3748;">${task.deadlineTime}</span>
</td>
</tr>
` : ''}
${task.days ? `
<tr>
<td style="padding:10px 0;">
<strong style="color:#28a745;">Days Remaining:</strong> 
<span style="color:#28a745;font-weight:600;">${task.days} day${task.days !== 1 ? 's' : ''}</span>
</td>
</tr>
` : ''}
</table>

</div>

<p style="color:#718096;font-size:14px;margin:20px 0 0 0;">
Don't forget to complete your task on time! 🚀
</p>

</td>
</tr>

<tr>
<td style="background:#f0f9f0;padding:30px;text-align:center;">

<p style="color:#4a7c59;font-size:14px;margin:0;">
© 2024 Upsoma Consultancy
</p>
<p style="color:#6c757d;margin:5px 0 0 0;font-size:11px;">
This is an automated reminder. Please reply if you have any questions.
</p>

</td>
</tr>

</table>

</body>

</html>`;
  }

  // Stop processing
  stopProcessing() {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
    this.isProcessing = false;
    console.log(`⏹️ Email queue processing stopped. Queue empty.`);
  }

  // Get queue status
  getStatus() {
    return {
      queueLength: this.queue.length,
      isProcessing: this.isProcessing,
      nextEmail: this.queue[0] ? this.queue[0].email : null
    };
  }
}

// Global email queue instance
const emailQueue = new EmailQueue();

const resetEmailTracking = () => {
  const now = new Date();
  const istNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  
  const midnight = new Date(istNow);
  midnight.setHours(24, 0, 0, 0);
  const msUntilMidnight = midnight - istNow;
  
  setTimeout(() => {
    sentEmailsToday.clear();
    console.log("🔄 Email tracking reset for new day");
    resetEmailTracking();
  }, msUntilMidnight);
};

resetEmailTracking();


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
 
export const OTPMail = async (req, res) => {

  const { email } = req.body;

  try {

    if (!email) {

      return res.status(400).json({
        success: false,
        error: "Email is required"
      });

    }

    const otp = Math.floor(
      100000 + Math.random() * 900000,
    );

    const hashedOtp = await bcrypt.hash(
      otp.toString(),
      10
    );

    await OTP.deleteMany({ email });

    await transporter.sendMail({

      from: '"Upsoma Consultancy" <noreply@upsoma.in>',

      to: email,

      subject:
        "ToDo List Password Change — Upsoma Consultancy",

      html: `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Password Reset OTP - Upsoma Consultancy</title>
</head>

<body style="margin:0;padding:20px;background:linear-gradient(135deg,#f0f9f0 0%,#ffffff 100%);font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" align="center"
style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.1);">

<tr>

<td style="background:linear-gradient(135deg,#d4f1d4 0%,#a8d5a8 100%);padding:40px 30px;text-align:center;">

<h1 style="color:#2d5016;font-size:28px;margin:0 0 8px 0;font-weight:700;">
Upsoma Consultancy
</h1>

<p style="color:#4a7c59;font-size:16px;margin:0;font-weight:300;">
Secure Password Reset Service
</p>

</td>

</tr>

<tr>

<td style="padding:50px 40px;text-align:center;">

<h2 style="font-size:24px;color:#2d3748;margin:0 0 20px 0;font-weight:600;">
Hello! 👋
</h2>

<p style="font-size:16px;color:#4a5568;margin:0 0 35px 0;line-height:1.8;">

We received a request to reset your password for your ToDo List account.

Use the verification code below:

</p>

<div style="background:#f0f9f0;border:2px solid #a8d5a8;border-radius:15px;padding:30px;margin:35px auto;max-width:400px;">

<div style="font-size:14px;color:#4a7c59;text-transform:uppercase;letter-spacing:1px;margin-bottom:15px;font-weight:600;">

Your Verification Code

</div>

<div style="font-size:42px;font-weight:800;letter-spacing:12px;color:#4a7c59;margin:20px 0;font-family:'Courier New',monospace;">

${otp}

</div>

<div style="font-size:14px;color:#4a7c59;margin-top:20px;">

⏰ This code expires in 5 minutes

</div>

</div>

</td>

</tr>

<tr>

<td style="background:#f0f9f0;padding:30px;text-align:center;">

<p style="color:#4a7c59;font-size:14px;margin:0;">

© 2026 Upsoma Consultancy

</p>

</td>

</tr>

</table>

</body>

</html>`

    });

    const otpDoc = new OTP({

      email,

      otp: hashedOtp,

      expire: Date.now() + 5 * 60 * 1000,

      attempts: 0

    });

    await otpDoc.save();

    res.json({

      success: true,

      message: "OTP sent successfully"

    });

  }

  catch (err) {

    res.status(500).json({

      success: false,

      error: err.message

    });

  }

};
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
export const remainderSendOnEmail = async (req, res) => {

  console.log("📧 Email reminder check started...");

  const now = new Date();

  const istNow = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );

  const date = istNow.toISOString().split("T")[0];

  const currentMinutes = istNow.getHours() * 60 + istNow.getMinutes();

  // Send email only at exact time, not before or after
  const tasks = await Task.find({
    status: "pending",
    deadlineTime: { $ne: "" }
  }).populate("createdBy");

  let emailsSent = 0;

  for (const task of tasks) {

    const taskDate = task.dueDate.toISOString().split("T")[0];

    if (taskDate !== date) {
      continue;
    }

    const [hour, minute] = task.deadlineTime.split(":").map(Number);

    const taskMinutes = hour * 60 + minute;

    // Send email only at exact time (no range)
    if (taskMinutes === currentMinutes) {

      const taskKey = `${task._id}_${date}`;
      
      if (sentEmailsToday.has(taskKey)) {
        continue;
      }

      // Send to owner
      await transporter.sendMail({
        from: '"Upsoma Consultancy" <noreply@upsoma.in>',
        to: task.createdBy.email,
        subject: `Task Reminder: ${task.title} — Upsoma Consultancy`,
        html: `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Task Reminder - Upsoma Consultancy</title>
</head>

<body style="margin:0;padding:20px;background:linear-gradient(135deg,#f0f9f0 0%,#ffffff 100%);font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" align="center"
style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.1);">

<tr>
<td style="background:linear-gradient(135deg,#d4f1d4 0%,#a8d5a8 100%);padding:40px 30px;text-align:center;">

<h1 style="color:#2d5016;font-size:28px;margin:0 0 8px 0;font-weight:700;">
Upsoma Consultancy
</h1>

<p style="color:#4a7c59;font-size:16px;margin:0;font-weight:300;">
Task Reminder Service
</p>

</td>
</tr>

<tr>
<td style="padding:50px 40px;text-align:center;">

<h2 style="font-size:24px;color:#2d3748;margin:0 0 20px 0;font-weight:600;">
Task Reminder ⏰
</h2>

<div style="background:#f0f9f0;border:2px solid #a8d5a8;border-radius:15px;padding:30px;margin:35px auto;max-width:500px;text-align:left;">

<h3 style="color:#2d5016;font-size:20px;margin:0 0 15px 0;font-weight:600;">
${task.title}
</h3>

<p style="color:#4a5568;font-size:16px;margin:0 0 20px 0;line-height:1.6;">
${task.description || 'No description provided'}
</p>

<table style="width:100%;border-collapse:collapse;">
<tr>
<td style="padding:10px 0;border-bottom:1px solid #e2e8f0;">
<strong style="color:#4a7c59;">Date:</strong> 
<span style="color:#2d3748;">${taskDate}</span>
</td>
</tr>
<tr>
<td style="padding:10px 0;">
<strong style="color:#4a7c59;">Time:</strong> 
<span style="color:#2d3748;">${task.deadlineTime}</span>
</td>
</tr>
</table>

</div>

<p style="color:#718096;font-size:14px;margin:20px 0 0 0;">
Don't forget to complete your task on time! 🚀
</p>

</td>
</tr>

<tr>
<td style="background:#f0f9f0;padding:30px;text-align:center;">

<p style="color:#4a7c59;font-size:14px;margin:0;">
© 2026 Upsoma Consultancy
</p>

</td>
</tr>

</table>

</body>

</html>`

      });

      // Send to multiple emails if exist - ADD TO QUEUE
      if (task.multipleEmails && task.multipleEmails.length > 0) {
        console.log(`� Adding ${task.multipleEmails.length} emails to queue for task: ${task.title}`);
        
        // Add all emails to queue - FIFO system will handle them
        emailQueue.add(task.multipleEmails, task);
      }

      sentEmailsToday.add(taskKey);
      emailsSent++;

    } 

  }

  if (res) {
    const queueStatus = emailQueue.getStatus();
    res.json({ 
      success: true, 
      message: `Email reminder check completed. ${emailsSent} emails sent directly. ${queueStatus.queueLength} emails in queue.`,
      queueStatus: queueStatus
    });
  }

};
