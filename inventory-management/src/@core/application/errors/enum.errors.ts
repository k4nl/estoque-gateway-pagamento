export class EnumErrors {
  static handleNotFound<T>(_enum: Record<string, any>, value: string): string {
    return `Value ${value} not found in ${Object.values<T>(_enum).join(', ')}.`;
  }
}
