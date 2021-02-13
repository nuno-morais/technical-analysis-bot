export class AuthorizationContext {
  public accountId: string;
  public scopes: Array<string>;

  constructor(partial: Partial<AuthorizationContext> = null) {
    if (partial != null) {
      Object.assign(this, partial);
    }
  }
}
