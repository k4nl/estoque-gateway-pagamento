import { ValueObject } from './value-object.vo';

export class Description extends ValueObject<string> {
  constructor(value: string) {
    super(value);
    this.isValid();
  }

  private isValid(): void {
    if (this.value.length < 3) {
      throw new Error('Description must be at least 3 characters long ');
    }

    if (this.value.length > 255) {
      throw new Error('Description must be at most 255 characters long');
    }
  }
}
