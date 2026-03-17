export abstract class ValueObject<TValue> {
  protected readonly value: TValue;

  protected constructor(value: TValue) {
    this.value = value;
  }

  public equals(other: ValueObject<TValue>): boolean {
    return JSON.stringify(this.value) === JSON.stringify(other.value);
  }

  public unwrap(): TValue {
    return this.value;
  }
}
