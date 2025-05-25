export class MailEntity {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  data: Record<string, unknown>;
}
