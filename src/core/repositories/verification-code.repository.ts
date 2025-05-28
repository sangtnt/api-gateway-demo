export interface IVerificationCodeRepository {
  saveVerificationCode(id: string, code: string, expMin: number): Promise<void>;
  getVerificationCode(id: string): Promise<string | null>;
  deleteVerificationCode(id: string): Promise<void>;
}
