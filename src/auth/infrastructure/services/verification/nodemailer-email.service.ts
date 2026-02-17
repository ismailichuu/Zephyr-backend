import nodemailer, { Transporter } from 'nodemailer';
import { EmailConfig } from '../../config/email.config.env';
import { EmailService } from 'src/auth/application/ports/email.service.port';

export class NodemailerEmailService implements EmailService {
  private transporter: Transporter;

  constructor(private readonly emailConfig: EmailConfig) {
    this.transporter = nodemailer.createTransport({
      host: this.emailConfig.SMTP_HOST,
      port: this.emailConfig.SMTP_PORT,
      secure: false,
      auth: {
        user: this.emailConfig.SMTP_USER,
        pass: this.emailConfig.SMTP_PASS,
      },
    });
  }

  async sendEmailSignup(email: string, otp: string): Promise<void> {
    await this.transporter.sendMail({
      from: this.emailConfig.EMAIL_FROM,
      to: email,
      subject: 'Verify your account',
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7fa; padding: 40px 20px;">
              <tr>
                  <td align="center">
                      <!-- Main Container -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                          
                          <!-- Header with Logo -->
                          <tr>
                              <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                                  <img src="https://res.cloudinary.com/dcs1e2fum/image/upload/v1769883250/Blue_and_Black_Minimalist_Brand_Logo_1_nqmxpf.png" 
                                      alt="Logo" 
                                      style="max-width: 180px; height: auto; display: block; margin: 0 auto;">
                              </td>
                          </tr>
                          
                          <!-- Content -->
                          <tr>
                              <td style="padding: 50px 40px; text-align: center;">
                                  <h2 style="color: #333333; font-size: 28px; margin: 0 0 15px 0; font-weight: 600;">
                                      Verify Your Email
                                  </h2>
                                  
                                  <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 0 0 30px 0;">
                                      Please use the following One-Time Password (OTP) to complete your account verification:
                                  </p>
                                  
                                  <!-- OTP Box -->
                                  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; padding: 25px; margin: 30px 0; display: inline-block;">
                                      <h1 style="color: #ffffff; font-size: 42px; margin: 0; letter-spacing: 8px; font-weight: 700;">
                                          ${otp}
                                      </h1>
                                  </div>
                                  
                                  <p style="color: #999999; font-size: 14px; margin: 20px 0 0 0;">
                                      ⏱️ This OTP will expire in <strong style="color: #667eea;">5 minutes</strong>
                                  </p>
                                  
                                  <p style="color: #666666; font-size: 14px; line-height: 22px; margin: 30px 0 0 0;">
                                      If you didn't request this verification, please ignore this email or contact our support team.
                                  </p>
                              </td>
                          </tr>
                          
                          <!-- Footer -->
                          <tr>
                              <td style="background-color: #f8f9fb; padding: 30px 40px; text-align: center; border-top: 1px solid #e8eaed;">
                                  <p style="color: #999999; font-size: 13px; margin: 0; line-height: 20px;">
                                      © ${new Date().getFullYear()} Your Company. All rights reserved.
                                  </p>
                                  <p style="color: #999999; font-size: 13px; margin: 10px 0 0 0;">
                                      This is an automated email. Please do not reply.
                                  </p>
                              </td>
                          </tr>
                          
                      </table>
                  </td>
              </tr>
          </table>
      </body>
      </html>
      `,
    });
  }

  async sendEmailForgot(email: string, otp: string): Promise<void> {
    await this.transporter.sendMail({
      from: this.emailConfig.EMAIL_FROM,
      to: email,
      subject: 'Verify your account',
      html: `
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7fa; padding: 40px 20px;">
        <tr>
            <td align="center">
                <!-- Main Container -->
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    
                    <!-- Header with Logo -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                            <img src="https://res.cloudinary.com/dcs1e2fum/image/upload/v1769883250/Blue_and_Black_Minimalist_Brand_Logo_1_nqmxpf.png" 
                                alt="Logo" 
                                style="max-width: 180px; height: auto; display: block; margin: 0 auto;">
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 50px 40px; text-align: center;">
                            <h2 style="color: #333333; font-size: 28px; margin: 0 0 15px 0; font-weight: 600;">
                                Reset Your Password
                            </h2>
                            
                            <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 0 0 30px 0;">
                                We received a request to reset your password. Please use the following One-Time Password (OTP) to proceed:
                            </p>
                            
                            <!-- OTP Box -->
                            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; padding: 25px; margin: 30px 0; display: inline-block;">
                                <h1 style="color: #ffffff; font-size: 42px; margin: 0; letter-spacing: 8px; font-weight: 700;">
                                    ${otp}
                                </h1>
                            </div>
                            
                            <p style="color: #999999; font-size: 14px; margin: 20px 0 0 0;">
                                ⏱️ This OTP will expire in <strong style="color: #667eea;">5 minutes</strong>
                            </p>
                            
                            <p style="color: #666666; font-size: 14px; line-height: 22px; margin: 30px 0 0 0;">
                                If you didn't request a password reset, please ignore this email or contact our support team immediately.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fb; padding: 30px 40px; text-align: center; border-top: 1px solid #e8eaed;">
                            <p style="color: #999999; font-size: 13px; margin: 0; line-height: 20px;">
                                © ${new Date().getFullYear()} Your Company. All rights reserved.
                            </p>
                            <p style="color: #999999; font-size: 13px; margin: 10px 0 0 0;">
                                This is an automated email. Please do not reply.
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
      `,
    });
  }
}
