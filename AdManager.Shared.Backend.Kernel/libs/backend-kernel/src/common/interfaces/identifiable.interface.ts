```typescript
/**
 * @interface IIdentifiable
 * @description Represents an entity or object that has a unique identifier.
 * @template T - The type of the identifier, defaults to string.
 */
export interface IIdentifiable<T extends string | number = string> {
  /**
   * @property id
   * @description The unique identifier of the object.
   */
  readonly id: T;
}
```