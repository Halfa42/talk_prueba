/// <reference types="cypress" />

describe('Flujo de Login - Pruebas funcionales manuales automatizadas', () => {
  const baseUrl = Cypress.config('baseUrl') || 'http://localhost:5173';

  const validUser = {
    email: Cypress.env('LOGIN_EMAIL') || 'socio_formador@talk.com',
    password: Cypress.env('LOGIN_PASSWORD') || 'socio_formador123'
  };

  const invalidUser = {
    email: 'usuario.invalido@correo.com',
    password: 'ContrasenaIncorrecta123'
  };

  const selectors = {
    email: 'input[type="email"], input[name="email"], input[placeholder*="correo" i], input[placeholder*="email" i]',
    password: 'input[type="password"], input[name="password"], input[placeholder*="contraseña" i], input[placeholder*="password" i]',
    submit: 'button[type="submit"], button:contains("Entrar"), button:contains("Iniciar sesión"), button:contains("Login"), button:contains("Acceder")'
  };

  beforeEach(() => {
    cy.visit('/');
  });

  it("TC-01 - Login exitoso con credenciales válidas", () => {
    cy.intercept("POST", "**/api/auth/login").as("loginRequest");

    cy.visit("/");

    cy.get(selectors.email)
      .first()
      .clear()
      .type("socio_formador@talk.com")
      .should("have.value", "socio_formador@talk.com");

    cy.get(selectors.password)
      .first()
      .clear()
      .type("socio_formador123", { parseSpecialCharSequences: false })
      .should("have.value", "socio_formador123");

    cy.wait(500);

    cy.get(selectors.submit)
      .first()
      .click();

    cy.wait("@loginRequest").then((interception) => {
      expect(interception.response, "respuesta del backend").to.exist;
      expect(interception.response.statusCode).to.eq(200);
    });

    cy.contains(/acceso autorizado|dashboard|bienvenido|sesión iniciada|panel/i, {
      timeout: 10000
    }).should("be.visible");
  });

  it('TC-02 - Login rechazado con correo o contraseña inválidos', () => {
    cy.get(selectors.email).first().clear().type(invalidUser.email);
    cy.get(selectors.password).first().clear().type(invalidUser.password, { log: false });
    cy.get(selectors.submit).first().click();

    cy.contains(/correo inválido|contraseña inválida|credenciales inválidas|usuario no encontrado|acceso denegado|error/i, { timeout: 10000 })
      .should('be.visible');
  });

  it('TC-03 - Validación de campos vacíos', () => {
    cy.get(selectors.submit).first().click();

    cy.contains(/campos vacíos|campo requerido|required|ingresa tu correo|ingresa tu contraseña|obligatorio/i, { timeout: 10000 })
      .should('be.visible');
  });
});
