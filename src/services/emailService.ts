export default new (class EmailService {
  /**
   * Defuscate
   * @param value
   */
  public defuscate(value: string) {
    return atob(value.split('').reverse().join(''))
      .split('')
      .reverse()
      .join('');
  }

  /**
   *
   * @param value Obfuscate
   * @returns
   */
  public obfuscate(value: string) {
    return btoa(value.split('').reverse().join(''))
      .split('')
      .reverse()
      .join('');
  }

  /**
   * Defuscate email
   * @param text
   * @returns
   */
  public defuscateEmail(text: string | undefined) {
    if (!text) return text;
    let mailToMatch = '';
    text = text.replace(/mailto:([^\\"?]*)/, (mtm) => {
      mailToMatch = this.defuscate(mtm.replace('mailto:', ''));
      return 'mailto:' + mailToMatch;
    });

    text = text.replace(/>([^\\?]*)<\/a/, () => {
      return `>${mailToMatch}</a`;
    });

    text = text.replace('obfEmail', '');

    return text;
  }

  /**
   *
   * @param text Obfuscate emails from text
   * @returns
   */
  public obfuscateEmailsFromText(text: string): string {
    return text.replace(
      /<a[^>]+href=\\"mailto:([^\\">?]+)(\?[^?\\">]+)?\\"[^>]*>(.*?)<\/a>/g,
      (match) => {
        match = match.replace(/mailto:([^\\?]*)/, (mailToMatch) => {
          return 'mailto:' + this.obfuscate(mailToMatch.replace('mailto:', ''));
        });

        match = match.replace(/>([^\\?]*)<\/a/, (anchorTextToMatch) => {
          const email = anchorTextToMatch.replace('>', '').replace('</a', '');

          const emailParts = email.split('@');

          const truncatedEmail =
            this.truncateEmail(emailParts[0], 2) + '@' + emailParts[1];

          return ` class='obfEmail'>${truncatedEmail}</a`;
        });

        return match;
      }
    );
  }

  private truncateEmail(str: string, length: number) {
    if (str.length > length) {
      return str.slice(0, length) + '...';
    } else return str;
  }
})();
