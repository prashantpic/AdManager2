import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  protected override pageUrl = '/login'; // Or your specific login path

  private get usernameInput(): Cypress.Chainable<JQuery<HTMLElement>> { return cy.getByTestId('username-input'); }
  private get passwordInput(): Cypress.Chainable<JQuery<HTMLElement>> { return cy.getByTestId('password-input'); }
  private get loginButton(): Cypress.Chainable<JQuery<HTMLElement>> { return cy.getByTestId('login-button'); }
  private get errorMessage(): Cypress.Chainable<JQuery<HTMLElement>> { return cy.getByTestId('error-message'); }

  public visit(): void {
    super.visit(this.pageUrl);
  }

  public fillUsername(username: string): void {
    this.usernameInput.should('be.visible').clear().type(username);
  }

  public fillPassword(password: string): void {
    this.passwordInput.should('be.visible').clear().type(password, { log: false });
  }

  public submitLogin(): void {
    this.loginButton.should('be.visible').click();
  }

  public loginAs(username: string, password: string): void {
    this.visit();
    this.fillUsername(username);
    this.fillPassword(password);
    this.submitLogin();
  }

  public getErrorMessageText(): Cypress.Chainable<string> {
    return this.errorMessage.should('be.visible').invoke('text');
  }

  public verifyErrorMessageIsVisible(message?: string): void {
    this.errorMessage.should('be.visible');
    if (message) {
        this.errorMessage.should('contain.text', message);
    }
  }
}