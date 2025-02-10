import { validate } from 'uuid';
import { ValueObject } from './value-object.vo';
import { v4 as uuidv4 } from 'uuid';

export class Uuid extends ValueObject<string> {
  constructor(value?: string) {
    super(value || uuidv4());
    this.isValid();
  }

  private isValid(): void {
    if (!validate(this.value)) {
      throw new Error('Invalid UUID');
    }
  }
}
