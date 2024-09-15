export const emailConfig = {
  from: process.env.EMAIL_SENDER,
};

export const mailtrapConfig = {
  host: process.env.MAILTRAP_EMAIL_HOST || '',
  port: 587,
  auth: {
    user: process.env.MAILTRAP_USERNAME,
    pass: process.env.MAILTRAP_PASSWORD,
  },
};

export enum EMAILSUBJECT {
  WELCOME = 'Simplists - Vérification de votre email',
  LISTINVITATION = 'Simplists - Vous avez été invité(e) à une liste',
}
