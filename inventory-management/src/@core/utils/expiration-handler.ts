export class ExpirationHandler {
  public static calculateExpirationDate(minutes: number): Date {
    const date = new Date();
    date.setMinutes(date.getMinutes() + minutes);
    return date;
  }

  public static isExpired(date: Date): boolean {
    return date < new Date();
  }

  public static transformTimeInSeconds(date: Date): number {
    return Math.floor((date.getTime() - new Date().getTime()) / 1000);
  }
}
