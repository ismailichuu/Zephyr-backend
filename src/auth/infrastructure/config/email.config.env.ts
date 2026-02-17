export type EmailConfig = {
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_USER: string;
  SMTP_PASS: string;
  EMAIL_FROM: string;
};

export function loadEmailConfig(): EmailConfig {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM } =
    process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !EMAIL_FROM) {
    throw new Error('Email Configuration are missing');
  }

  return {
    SMTP_HOST,
    SMTP_PORT: Number(SMTP_PORT),
    SMTP_PASS,
    SMTP_USER,
    EMAIL_FROM,
  };
}
