import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

/**
 * #### Contains all types of mail
 *
 * ## Types
 *
 *  #### Welcome
 * Sent when the user signed in with social api, so email is already verified
 *
 *
 * #### Verify
 * Sent when the user used normal signup. Welcome won't be sent
 *
 *
 * #### Deleted
 * Sent when the account has been deleted
 *
 *
 * #### PasswordChange
 * Sent when account's password has been changed
 *
 *
 * #### PublishNew
 * Sent when account created a new publication
 *
 *
 * #### PublishWarn
 * Sent when some publication is about to expire
 *
 *
 * #### PublishExpired
 * Sent when some publication has expired
 *
 *
 * #### Google
 * Sent when the account has been linked with google
 *
 *
 * #### Facebook
 * Sent when the account has been linked with Facebook
 *
 *
 * #### Buyier
 * Sent when someone is trying to buy a publication
 *
 *
 * #### PrivateMessage
 * Sent when the user has received a private message
 *
 *
 * @return Name of the file which contains the mail's
 */
export enum MailType {
  /**
   * Sent when the user signed in with social api, so email is already verified
   *
   * ### Placeholders
   * All placeholders must be preceded by a `%` token
   * ##### Example: `Hello %name, be welcome to our family`
   *
   * - name - Full user name
   *      'Serenity Blue Young'
   *
   *
   * - nameLast - Full user name, starting with lastname
   *      'Young, Serenity Blue'
   *
   *
   * - firstname - User's first name
   *      'Serenity Blue'
   *
   *
   * - lastname - User's last name
   *      'Young'
   *
   *
   * - today - Current date
   *      '15 of July of 2019'
   *
   *
   * @return Name of the file which contains the mail's
   */
  Welcome = 'welcome',

  /**
   * Sent when the user used normal signup. Welcome won't be sent
   *
   * ### Placeholders
   * All placeholders must be preceded by a `%` token
   * ##### Example: `Hello %name, be welcome to our family`
   *
   * - name - Full user name
   *      'Serenity Blue Young'
   *
   *
   * - nameLast - Full user name, starting with lastname
   *      'Young, Serenity Blue'
   *
   *
   * - firstname - User's first name
   *      'Serenity Blue'
   *
   *
   * - lastname - User's last name
   *      'Young'
   *
   *
   * - today - Current date
   *      '15 of July of 2019'
   *
   *
   * - verifyUrl - Url to forward the user
   *      'https://.../verify?token=super_secret'
   *
   *
   * @return Name of the file which contains the mail's
   */
  Verify = 'verify',

  /**
   * Sent when the account has been deleted
   *
   * ### Placeholders
   * All placeholders must be preceded by a `%` token
   * ##### Example: `Hello %name, be welcome to our family`
   *
   * - name - Full user name
   *      'Serenity Blue Young'
   *
   *
   * - nameLast - Full user name, starting with lastname
   *      'Young, Serenity Blue'
   *
   *
   * - firstname - User's first name
   *      'Serenity Blue'
   *
   *
   * - lastname - User's last name
   *      'Young'
   *
   *
   * - today - Current date
   *      '15 of July of 2019'
   *
   *
   * @return Name of the file which contains the mail's
   */
  Deleted = 'deleted',

  /**
   * Sent when account's password has been changed
   *
   * ### Placeholders
   * All placeholders must be preceded by a `%` token
   * ##### Example: `Hello %name, be welcome to our family`
   *
   * - name - Full user name
   *      'Serenity Blue Young'
   *
   *
   * - nameLast - Full user name, starting with lastname
   *      'Young, Serenity Blue'
   *
   *
   * - firstname - User's first name
   *      'Serenity Blue'
   *
   *
   * - lastname - User's last name
   *      'Young'
   *
   *
   * - today - Current date
   *      '15 of July of 2019'
   *
   *
   * @return Name of the file which contains the mail's
   */
  PasswordChange = 'pwdChange',

  /**
   * Sent when account created a new publication
   *
   * ### Placeholders
   * All placeholders must be preceded by a `%` token
   * ##### Example: `Hello %name, be welcome to our family`
   *
   * - name - Full user name
   *      'Serenity Blue Young'
   *
   *
   * - nameLast - Full user name, starting with lastname
   *      'Young, Serenity Blue'
   *
   *
   * - firstname - User's first name
   *      'Serenity Blue'
   *
   *
   * - lastname - User's last name
   *      'Young'
   *
   *
   * - today - Current date
   *      '15 of July of 2019'
   *
   *
   * - unsubscribe - Link to unsubscribe from the newsletter
   *      'https://.../unsubscribe'
   *
   *
   * - publishName - The publication's Title
   *      'Blue Jumper M/X/XL'
   *
   *
   * - publishUrl - A link redirecting to the publication
   *      'https://.../blue-jumper-332'
   *
   *
   * - publishDuration - The remaining duration (in days) of the publication
   *      '60'
   *
   *
   * @return Name of the file which contains the mail's
   */
  PublishNew = 'pubNew',

  /**
   * Sent when some publication is about to expire
   *
   * ### Placeholders
   * All placeholders must be preceded by a `%` token
   * ##### Example: `Hello %name, be welcome to our family`
   *
   * - name - Full user name
   *      'Serenity Blue Young'
   *
   *
   * - nameLast - Full user name, starting with lastname
   *      'Young, Serenity Blue'
   *
   *
   * - firstname - User's first name
   *      'Serenity Blue'
   *
   *
   * - lastname - User's last name
   *      'Young'
   *
   *
   * - today - Current date
   *      '15 of July of 2019'
   *
   *
   * - unsubscribe - Link to unsubscribe from the newsletter
   *      'https://.../unsubscribe'
   *
   *
   * - publishName - The publication's Title
   *      'Blue Jumper M/X/XL'
   *
   *
   * - publishUrl - A link redirecting to the publication
   *      'https://.../blue-jumper-332'
   *
   *
   * - publishDuration - The remaining duration (in days) of the publication
   *      '60'
   *
   *
   * @return Name of the file which contains the mail's
   */
  PublishWarn = 'pubWarn',

  /**
   * Sent when some publication has expired
   *
   * ### Placeholders
   * All placeholders must be preceded by a `%` token
   * ##### Example: `Hello %name, be welcome to our family`
   *
   * - name - Full user name
   *      'Serenity Blue Young'
   *
   *
   * - nameLast - Full user name, starting with lastname
   *      'Young, Serenity Blue'
   *
   *
   * - firstname - User's first name
   *      'Serenity Blue'
   *
   *
   * - lastname - User's last name
   *      'Young'
   *
   *
   * - today - Current date
   *      '15 of July of 2019'
   *
   *
   * - unsubscribe - Link to unsubscribe from the newsletter
   *      'https://.../unsubscribe'
   *
   *
   * - publishName - The publication's Title
   *      'Blue Jumper M/X/XL'
   *
   *
   * - publishUrl - A link redirecting to the publication
   *      'https://.../blue-jumper-332'
   *
   *
   * @return Name of the file which contains the mail's
   */
  PublishExpired = 'pubExpired',

  /**
   * Sent when the account has been linked with google
   *
   * ### Placeholders
   * All placeholders must be preceded by a `%` token
   * ##### Example: `Hello %name, be welcome to our family`
   *
   * - name - Full user name
   *      'Serenity Blue Young'
   *
   *
   * - nameLast - Full user name, starting with lastname
   *      'Young, Serenity Blue'
   *
   *
   * - firstname - User's first name
   *      'Serenity Blue'
   *
   *
   * - lastname - User's last name
   *      'Young'
   *
   *
   * - today - Current date
   *      '15 of July of 2019'
   *
   *
   * @return Name of the file which contains the mail's
   */
  Google = 'google',

  /**
   * Sent when the account has been linked with Facebook
   *
   * ### Placeholders
   * All placeholders must be preceded by a `%` token
   * ##### Example: `Hello %name, be welcome to our family`
   *
   * - name - Full user name
   *      'Serenity Blue Young'
   *
   *
   * - nameLast - Full user name, starting with lastname
   *      'Young, Serenity Blue'
   *
   *
   * - firstname - User's first name
   *      'Serenity Blue'
   *
   *
   * - lastname - User's last name
   *      'Young'
   *
   *
   * - today - Current date
   *      '15 of July of 2019'
   *
   *
   * @return Name of the file which contains the mail's
   */
  Facebook = 'facebook',

  /**
   * Sent when someone is trying to buy a publication
   *
   * ### Placeholders
   * All placeholders must be preceded by a `%` token
   * ##### Example: `Hello %name, be welcome to our family`
   *
   * - name - Full user name
   *      'Serenity Blue Young'
   *
   *
   * - nameLast - Full user name, starting with lastname
   *      'Young, Serenity Blue'
   *
   *
   * - firstname - User's first name
   *      'Serenity Blue'
   *
   *
   * - lastname - User's last name
   *      'Young'
   *
   *
   * - today - Current date
   *      '15 of July of 2019'
   *
   *
   * - unsubscribe - Link to unsubscribe from the newsletter
   *      'https://.../unsubscribe'
   *
   *
   * - publishName - The publication's Title
   *      'Blue Jumper M/X/XL'
   *
   *
   * - publishUrl - A link redirecting to the publication
   *      'https://.../blue-jumper-332'
   *
   *
   * - publishDuration - The remaining duration (in days) of the publication
   *      '60'
   *
   *
   * - buyierName - Full Name of the buyier
   *      'Elma Grain'
   *
   *
   * - buyierMail - E-mail of the buyier
   *      'elma74@gmail.com'
   *
   * @return Name of the file which contains the mail's
   */
  Buyier = 'buyier',

  /**
   * Sent when the user has received a private message
   *
   * ### Placeholders
   * All placeholders must be preceded by a `%` token
   * ##### Example: `Hello %name, be welcome to our family`
   *
   * - name - Full user name
   *      'Serenity Blue Young'
   *
   *
   * - nameLast - Full user name, starting with lastname
   *      'Young, Serenity Blue'
   *
   *
   * - firstname - User's first name
   *      'Serenity Blue'
   *
   *
   * - lastname - User's last name
   *      'Young'
   *
   *
   * - today - Current date
   *      '15 of July of 2019'
   *
   *
   * - unsubscribe - Link to unsubscribe from the newsletter
   *      'https://.../unsubscribe'
   *
   *
   * - senderName - Full Name of who sent the message
   *      'Elma Grain'
   *
   *
   * - senderMail - E-mail of who sent the message
   *      'elma74@gmail.com'
   *
   *
   * - message - The message sent
   *      'Hey! Just saw you are ...'
   *
   *
   * - conversation - A link to the current conversation
   *      'https://.../chat/15/31#6'
   *
   *
   * @return Name of the file which contains the mail's
   */
  PrivateMessage = 'privMsg'
}

export interface Placeholders {
  [placeholder: string]: string;
  firstname: string;
  lastname: string;
}

interface MyMail {
  subject: string;
  html: string;
  text?: string;
  htmlPlaceholders: { [placeholder: string]: { from: number; to: number }[] };
  textPlaceholders?: { [placeholder: string]: { from: number; to: number }[] };
}

function getMail(type: MailType): MyMail {
  return null;
}

let transporter: Mail;

export function setup() {
  // https://nodemailer.com/smtp/oauth2/#oauth-3lo
  transporter = createTransport({
    pool: true,
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: process.env.GOOGLE_MAIL,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: 'Need to get this',
      refreshToken: 'Need to get this',
      accessToken: 'Need to get this',
      expires: 1484314697598
    }
  });

  transporter.verify(err => {
    if (err) console.log('EP08:', err);
    else console.log('Server is ready to send mails');
  });
}

export function sendMail(target: string, type: MailType, placeholders: Placeholders) {
  const mail = getMail(type);
  for (const placeholder of Object.keys(mail.htmlPlaceholders))
    if (placeholders[placeholder]) {
      const replacement = placeholders[placeholder];
      for (const idx of mail.htmlPlaceholders[placeholder])
        mail.html = mail.html
          .substring(0, idx.from)
          .concat(replacement)
          .concat(mail.html.substring(idx.to));
    }

  if (mail.text && mail.textPlaceholders)
    for (const placeholder of Object.keys(mail.textPlaceholders))
      if (placeholders[placeholder]) {
        const replacement = placeholders[placeholder];
        for (const idx of mail.textPlaceholders[placeholder])
          mail.text = mail.text
            .substring(0, idx.from)
            .concat(replacement)
            .concat(mail.html.substring(idx.to));
      }

  transporter.sendMail(
    {
      from: `Avisos Entre Ríos <${process.env.GOOGLE_MAIL}>`,
      to: target,
      subject: mail.subject,
      html: mail.html,
      text: mail.text
    },
    err => console.log('EP09:', err)
  );
}
