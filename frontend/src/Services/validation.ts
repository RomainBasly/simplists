export function isValidEmail(email: string): boolean {
  const trimmedEmail = email.trim();
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(trimmedEmail);
}

export function isValidCode(code: string): boolean {
  const codeRegex = /^\d{6}$/;
  return codeRegex.test(code);
}

export function isValidName(name: string): boolean {
  const userNameRegex = /^[^<>&'"/\\]*$/;
  return userNameRegex.test(name);
}

export const validateConnectFormInputs = (
  email: string,
  password: string
): Record<string, string> => {
  const errors: Record<string, string> = {};
  if (!email) {
    errors.email = "Votre email doit être renseigné pour vous connecter";
  } else if (!isValidEmail(email)) {
    errors.email = "L'email renseigné n'est pas valide";
  } else if (!password) {
    errors.password =
      "Votre mot de passe doit être renseigné pour vous connecter";
  }
  return errors;
};

export const validateEmailInput = (email: string): Record<string, string> => {
  const errors: Record<string, string> = {};
  if (!email) {
    errors.email = "L'email doit être renseigné pour continuer";
  } else if (!isValidEmail(email)) {
    errors.email = "L'email renseigné n'est pas valide";
  }
  return errors;
};

export const validateCodeInput = (code: string): Record<string, string> => {
  const errors: Record<string, string> = {};
  if (!code) {
    errors.code = "Vous devez renseigner le code pour valider";
  } else if (!isValidCode(code)) {
    errors.code = "Le code renseigné n'est pas valide";
  }
  return errors;
};

export function isValidPassword(input: string): boolean {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
  return regex.test(input);
}

export function validatePasswordInput(input: string): Record<string, string> {
  const errors: Record<string, string> = {};
  if (input.length < 6) {
    errors.password = "Le mot de passe doit contenir a minima 6 caractères";
  } else if (!isValidPassword(input)) {
    errors.password =
      "Votre mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre";
  }

  return errors;
}
export function validateUserNameInput(input: string): Record<string, string> {
  const errors: Record<string, string> = {};
  if (input.length < 3) {
    errors.username = "Le nom d'utilisateur doit avoir minimum 3 caractères";
  } else if (!isValidName) {
    errors.username =
      "Le nom d'utilisateur ne peut pas détenir les caractères <, >, & ', \", ', / ou \\";
  }
  return errors;
}

export function matchingPasswords(
  prePasswordInput: string,
  passwordInput: string
): Record<string, string> {
  const errors: Record<string, string> = {};
  if (prePasswordInput !== passwordInput) {
    errors.matchingPassword = "Les deux mots de passe ne correspondent pas";
  }
  return errors;
}

export function validateInputAddItemToList(input: string) {
  const errors: Record<string, string> = {};
  if (input.length === 0) {
    errors.itemContent = "Le champ ne peut pas être vide";
  } else if (!isValidRequiredString(input)) {
    errors.itemContent =
      "<, >, ', \", / ou \\ ne sont pas autorisés";
  }
  return errors;
}

export function validateCreateListForm(body: {
  listName: string;
  invitedEmails: string[];
  beneficiaryEmails: string[];
  thematic: string;
  accessLevel: string;
  description: string;
  cyphered: boolean;
}): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!isValidRequiredString(body.listName)) {
    errors.listName =
      "Le nom de la liste contient des caractères interdits ou est vide";
  }

  if (!isValidRequiredString(body.thematic)) {
    errors.thematic =
      "La thématique contient des caractères interdits ou est vide";
  }

  if (!isValidRequiredString(body.accessLevel)) {
    errors.access_level =
      "Vous devez choisir si la liste est privée ou partagée";
  }

  if (!isValidEmailArray(body.invitedEmails)) {
    errors.emailsArray = "Une ou plusieurs adresses email sont invalides";
  }

  if (!isValidNotRequiredString(body.description)) {
    errors.description = "La description contient des caractères interdits";
  }

  return errors;
}

export function validateEditEmails(body: {
  invitedEmails?: { addedEmails: string[]; removedEmails: string[] };
  beneficiaryEmails?: { removedEmails: string[] };
}): Record<string, string> {
  const errors: Record<string, string> = {};
  if (
    body.invitedEmails?.addedEmails &&
    (!isValidEmailArray(body.invitedEmails.addedEmails) ||
      !isValidEmailArray(body.invitedEmails.removedEmails))
  ) {
    errors.emailsArray = "Une ou plusieurs adresses email sont invalides";
  }
  if (
    body.beneficiaryEmails?.removedEmails &&
    !isValidEmailArray(body.beneficiaryEmails.removedEmails)
  ) {
    errors.emailsArray = "Une ou plusieurs adresses email sont invalides";
  }

  return errors;
}

export function validateEditListForm(body: {
  listName: string;
  thematic: string;
  accessLevel: string;
  description: string;
  cyphered: boolean;
}): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!isValidRequiredString(body.listName)) {
    errors.name =
      "Le nom de la liste contient des caractères interdits ou est vide";
  }

  if (!isValidRequiredString(body.thematic)) {
    errors.thematic =
      "La thématique contient des caractères interdits ou est vide";
  }

  if (!isValidRequiredString(body.accessLevel)) {
    errors.access_level =
      "Vous devez choisir si la liste est privée ou partagée";
  }

  if (!isValidNotRequiredString(body.description)) {
    errors.description = "La description contient des caractères interdits";
  }

  return errors;
}

function isValidRequiredString(input: string): boolean {
  const validStringRegex = /^[a-zA-Z0-9âêîôûàèìòùäëïöüçœé'":%\?\s-'&]+$/;
  return validStringRegex.test(input);
}

function isValidNotRequiredString(input: string): boolean {
  const validStringRegex = /^[a-zA-Z0-9âêîôûàèìòùäëïöüçœé'":%\?\s-'&]*$/;
  return validStringRegex.test(input);
}

function isValidEmailArray(emails: string[]): boolean {
  return emails.every((email) => isValidEmail(email));
}
