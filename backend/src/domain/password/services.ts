import bcrypt from "bcrypt";

export class PasswordService {
  public async hashPassword(password: string) {
    const salt = bcrypt.genSaltSync(10);
    return await bcrypt.hash(password, salt);
  }

  public async checkCredentials(enteredPassword: string, passwordFromDB: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, passwordFromDB);
  }
}
