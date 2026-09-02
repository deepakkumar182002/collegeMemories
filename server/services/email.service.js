import nodemailer from 'nodemailer';

/**
 * Creates and returns a Nodemailer transporter instance using environment variables
 */
const createTransporter = () => {
  const user = process.env.EMAIL_USER || 'kumar041232@gmail.com';
  const pass = process.env.EMAIL_PASS || 'rfeylnzyzkmbnzxy';

  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  });
};

/**
 * Send an email notification for likes, emoji reactions, and comments
 * @param {Object} data
 * @param {'like'|'reaction'|'comment'} data.type
 * @param {'Chapter'|'Memory'} data.targetType
 * @param {string} data.targetTitle
 * @param {string} data.targetId
 * @param {string} [data.authorName]
 * @param {string} [data.authorAvatar]
 * @param {string} [data.emoji]
 * @param {string} [data.content]
 */
export const sendInteractionNotification = async ({
  type,
  targetType,
  targetTitle,
  targetId,
  authorName = 'Alumni Visitor',
  authorAvatar = '🎓',
  emoji = '❤️',
  content = '',
}) => {
  try {
    const transporter = createTransporter();
    const recipient = process.env.EMAIL_USER || 'kumar041232@gmail.com';
    const siteUrl = process.env.CLIENT_URL || 'https://memories-ochre-ten.vercel.app';

    let actionHeadline = '';
    let badgeColor = '#570000';
    let iconHeader = '🎓';

    if (type === 'comment') {
      actionHeadline = `New Comment from ${authorAvatar} ${authorName}`;
      badgeColor = '#570000';
      iconHeader = '💬';
    } else if (type === 'like') {
      actionHeadline = `New Like received`;
      badgeColor = '#e11d48';
      iconHeader = '❤️';
    } else {
      actionHeadline = `New Emoji Reaction: ${emoji}`;
      badgeColor = '#b45309';
      iconHeader = emoji;
    }

    const subject = `${iconHeader} [AlumniScraps Alert] ${actionHeadline} on ${targetType}: "${targetTitle}"`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #fbf9f5;
      color: #1b1c1a;
      margin: 0;
      padding: 24px;
    }
    .email-container {
      max-width: 580px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      border: 1px solid #e2bfb9;
    }
    .header {
      background: linear-gradient(135deg, #570000 0%, #800000 100%);
      color: #ffffff;
      padding: 28px 24px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 22px;
      letter-spacing: -0.5px;
    }
    .header p {
      margin: 6px 0 0 0;
      opacity: 0.85;
      font-size: 13px;
    }
    .content {
      padding: 24px;
    }
    .badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 20px;
      background-color: ${badgeColor};
      color: #ffffff;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 16px;
    }
    .info-card {
      background: #fbf9f5;
      border: 1px dashed #e2bfb9;
      border-radius: 12px;
      padding: 16px 20px;
      margin: 16px 0;
    }
    .info-row {
      margin-bottom: 8px;
      font-size: 14px;
      line-height: 1.5;
    }
    .info-label {
      font-weight: 700;
      color: #565e77;
    }
    .comment-quote {
      background: #fff8e7;
      border-left: 4px solid #ffdf96;
      border-radius: 4px;
      padding: 14px 18px;
      margin: 16px 0;
      font-size: 15px;
      font-style: italic;
      color: #332500;
    }
    .btn-container {
      text-align: center;
      margin-top: 24px;
    }
    .btn {
      display: inline-block;
      background: #570000;
      color: #ffffff !important;
      text-decoration: none;
      padding: 12px 28px;
      border-radius: 50px;
      font-weight: bold;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .footer {
      background: #f5f3ef;
      padding: 16px;
      text-align: center;
      font-size: 11px;
      color: #8e706c;
      border-top: 1px solid #eae8e4;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>🎓 AlumniScraps Memory Box</h1>
      <p>Nostalgic College Scrapbook Live Notification</p>
    </div>
    <div class="content">
      <div class="badge">${type.toUpperCase()} ALERT</div>
      <h2 style="font-size: 18px; margin: 0 0 12px 0; color: #1b1c1a;">${actionHeadline}</h2>
      
      <div class="info-card">
        <div class="info-row"><span class="info-label">${targetType}:</span> <strong>${targetTitle}</strong></div>
        ${type === 'reaction' ? `<div class="info-row"><span class="info-label">Reaction Emoji:</span> <span style="font-size: 20px;">${emoji}</span></div>` : ''}
        ${authorName ? `<div class="info-row"><span class="info-label">Visitor / Alumni:</span> ${authorAvatar} ${authorName}</div>` : ''}
        <div class="info-row"><span class="info-label">Time:</span> ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })} IST</div>
      </div>

      ${content ? `
        <div style="font-size: 13px; font-weight: bold; color: #565e77; text-transform: uppercase;">Comment Message:</div>
        <div class="comment-quote">
          "${content}"
        </div>
      ` : ''}

      <div class="btn-container">
        <a href="${siteUrl}" class="btn" target="_blank">Open Memory Box →</a>
      </div>
    </div>
    <div class="footer">
      Sent automatically by AlumniScraps Platform • Preserving College Memories Forever
    </div>
  </div>
</body>
</html>
`;

    const mailOptions = {
      from: `"AlumniScraps Notifications" <${recipient}>`,
      to: recipient,
      subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Interaction alert sent successfully: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[Email Service Error] Failed to send email alert:', error.message);
    // Don't throw so user operations succeed even if SMTP fails
    return { success: false, error: error.message };
  }
};
