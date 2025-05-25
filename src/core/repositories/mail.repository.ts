import { MailEntity } from '../entities/mail.entity';

export interface IMailRepository {
  sendEmailVerificationCode(req: MailEntity): Promise<void>;
}
