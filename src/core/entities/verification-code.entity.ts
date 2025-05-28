export class VerificationCodeEntity {
  id!: string;
  code!: string;
  attempts!: number;
  expirationInMinutes!: number;
}
