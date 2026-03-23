/**
 * Welcome email template
 */

import { sendEmail } from '../sender';

/**
 * Send welcome email after successful email verification
 */
export async function sendWelcomeEmail(
  email: string,
  username: string
): Promise<boolean> {
  const subject = 'Welcome to Newtype Decks!';
  const text = `
Welcome ${username}!

Your email has been verified and your account is now active.

You can now:
- Build and save unlimited decks
- Manage your card collection
- Share decks with the community

Start building your deck: ${process.env.NEXTAUTH_URL}/decks

Best regards,
Newtype Decks
  `.trim();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #28a745;">Welcome to Newtype Decks!</h2>
      <p>Welcome ${username}!</p>
      <p>Your email has been verified and your account is now active.</p>
      <h3 style="color: #333;">You can now:</h3>
      <ul>
        <li>Build and save unlimited decks</li>
        <li>Manage your card collection</li>
        <li>Share decks with the community</li>
      </ul>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${process.env.NEXTAUTH_URL}/decks"
           style="background-color: #28a745; color: white; padding: 12px 24px;
                  text-decoration: none; border-radius: 4px; display: inline-block;">
          Start Building Decks
        </a>
      </div>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">
        Best regards,<br>
        Newtype Decks
      </p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject,
    text,
    html,
  });
}
