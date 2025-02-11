import { EMAIL_EXTRACT_REGEX } from '../constants/base.constant';

function extractMentionedStudents(notification: string): string[] {
  const matches = notification.match(EMAIL_EXTRACT_REGEX);

  return matches ? matches.map((email) => email.substring(1)) : [];
}

export { extractMentionedStudents };
