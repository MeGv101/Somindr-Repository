export const AuthTokenTypes = {
  VERIFY_EMAIL: "VERIFY_EMAIL",
  RESET_PASSWORD: "RESET_PASSWORD",
} as const;

export type AuthTokenType =
  (typeof AuthTokenTypes)[keyof typeof AuthTokenTypes];

  export interface MailUser {
  id: number;
  nombre: string;
  email: string;
}