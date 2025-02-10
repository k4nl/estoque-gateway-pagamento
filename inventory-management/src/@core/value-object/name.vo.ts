import { ValueObject } from './value-object.vo';

export class Name extends ValueObject<string> {
  constructor(value: string) {
    super(value);
    this.isValid();
  }

  private isValid(): void {
    if (this.value.length < 3) {
      throw new Error('Name must be at least 3 characters long');
    }

    if (this.value.length > 100) {
      throw new Error('Name must be at most 100 characters long');
    }
  }
}
