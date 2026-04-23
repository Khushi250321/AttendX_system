const nodemailer = require('nodemailer');

// Fire-and-forget email sender — never crashes your app if email fails
const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const recipients = Array.isArray(to) ? to.join(',') : to;
    await transporter.sendMail({
      from: `"AttendX" <${process.env.EMAIL_USER}>`,
      to: recipients,
      subject,
      html,
    });
    console.log('✅ Email sent to:', recipients);
  } catch (err) {
    console.error('❌ Email failed (app still works):', err.message);
  }
};

// ── Email HTML Templates ───────────────────────────────────────────────────

const announcementEmail = (teacherName, title, content, isPinned) => `
<div style="font-family:sans-serif;max-width:580px;margin:0 auto;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0">
  <div style="background:#6366f1;padding:24px;text-align:center">
    <h2 style="color:#fff;margin:0">📢 New Announcement</h2>
    ${isPinned ? '<div style="margin-top:8px"><span style="background:#f59e0b;color:#fff;font-size:12px;padding:3px 10px;border-radius:20px;font-weight:700">📌 PINNED</span></div>' : ''}
  </div>
  <div style="padding:28px;background:#fff">
    <h3 style="color:#1e293b;margin-top:0">${title}</h3>
    <p style="color:#4b5563;line-height:1.7;font-size:15px">${content}</p>
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0"/>
    <p style="color:#9ca3af;font-size:13px">Posted by <strong>${teacherName}</strong> · AttendX</p>
  </div>
</div>`;

const attendanceEmail = (studentName, subject, date, status) => `
<div style="font-family:sans-serif;max-width:580px;margin:0 auto;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0">
  <div style="background:${status === 'Present' ? '#22c55e' : '#ef4444'};padding:24px;text-align:center">
    <h2 style="color:#fff;margin:0">${status === 'Present' ? '✅ Marked Present' : '⚠️ Marked Absent'}</h2>
  </div>
  <div style="padding:28px;background:#fff">
    <p style="color:#4b5563;font-size:15px">Hi <strong>${studentName}</strong>,</p>
    <p style="color:#4b5563;font-size:15px">Your attendance has been recorded:</p>
    <div style="background:#f8fafc;border-radius:8px;padding:16px;margin:16px 0">
      <p style="margin:6px 0;color:#1e293b"><strong>Subject:</strong> ${subject}</p>
      <p style="margin:6px 0;color:#1e293b"><strong>Date:</strong> ${new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      <p style="margin:6px 0;color:${status === 'Present' ? '#16a34a' : '#dc2626'}"><strong>Status:</strong> ${status}</p>
    </div>
    ${status === 'Absent' ? '<p style="color:#ef4444;font-size:14px">⚠️ Please maintain at least 75% attendance.</p>' : ''}
    <p style="color:#9ca3af;font-size:13px">AttendX Notification</p>
  </div>
</div>`;

const assignmentEmail = (studentName, title, description, dueDate) => `
<div style="font-family:sans-serif;max-width:580px;margin:0 auto;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0">
  <div style="background:#f59e0b;padding:24px;text-align:center">
    <h2 style="color:#fff;margin:0">📝 New Assignment Posted</h2>
  </div>
  <div style="padding:28px;background:#fff">
    <p style="color:#4b5563;font-size:15px">Hi <strong>${studentName}</strong>,</p>
    <p style="color:#4b5563;font-size:15px">A new assignment has been posted for you:</p>
    <div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:8px;padding:16px;margin:16px 0">
      <p style="margin:4px 0;font-size:17px;font-weight:700;color:#1e293b">${title}</p>
      <p style="margin:8px 0;color:#4b5563;font-size:14px">${description}</p>
      <p style="margin:4px 0;color:#d97706;font-weight:600">📅 Due: ${new Date(dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
    </div>
    <p style="color:#9ca3af;font-size:13px">AttendX Notification</p>
  </div>
</div>`;

module.exports = { sendEmail, announcementEmail, attendanceEmail, assignmentEmail };
