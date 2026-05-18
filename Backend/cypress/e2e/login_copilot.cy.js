/// <reference types="cypress" />

describe('Formulario de login - Pruebas automatizadas', () => {
  const selectors = {
    email: 'input[type="email"], input[name="email"], input[placeholder*="correo" i], input[placeholder*="email" i]',
    password: 'input[type="password"], input[name="password"], input[placeholder*="contraseña" i], input[placeholder*="password" i]',
    submit: 'button[type="submit"], button:contains("Entrar"), button:contains("Iniciar sesión"), button:contains("Login"), button:contains("Acceder")'
  };

  beforeEach(() => {
    cy.visit('/');
  });

  it('TC-01 - Login exitoso con credenciales válidas', () => {
    cy.intercept('POST', '/api/auth/login').as('loginRequest');

    cy.get(selectors.email)
      .first()
      .clear()
      .type('socio_formador@talk.com')
      .should('have.value', 'socio_formador@talk.com');

    cy.get(selectors.password)
      .first()
      .clear()
      .type('socio_formador123')
      .should('have.value', 'socio_formador123');

    cy.get(selectors.submit)
      .first()
      .click();

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);

    cy.contains(/dashboard|bienvenido|panel|sesión iniciada|sesion iniciada|acceso exitoso|usuario autenticado/i, {
      timeout: 10000
    }).should('be.visible');
  });

  it('TC-02 - Login fallido con credenciales incorrectas', () => {
    cy.intercept('POST', '/api/auth/login').as('loginRequest');

    cy.get(selectors.email)
      .first()
      .clear()
      .type('usuario_incorrecto@talk.com')
      .should('have.value', 'usuario_incorrecto@talk.com');

    cy.get(selectors.password)
      .first()
      .clear()
      .type('passwordIncorrecto123')
      .should('have.value', 'passwordIncorrecto123');

    cy.get(selectors.submit)
      .first()
      .click();

    cy.wait('@loginRequest').then((interception) => {
      expect(interception.response).to.exist;
      expect(interception.response.statusCode).to.be.oneOf([400, 401, 403]);
    });

    cy.contains(/no se pudo iniciar sesión|usuario o contraseña incorrectos|credenciales inválidas|error de autenticación|acceso denegado/i, {
      timeout: 10000
    }).should('be.visible');
  });

  it('TC-03 - Login con campos vacíos', () => {
    cy.intercept('POST', '/api/auth/login', () => {
      throw new Error('No se debe enviar la petición de login con campos vacíos');
    }).as('loginRequest');

    cy.get(selectors.submit)
      .first()
      .click();

    cy.contains(/campo requerido|correo requerido|contraseña requerida|obligatorio|ingresa tu correo|ingresa tu contraseña|no puede estar vacío/i, {
      timeout: 10000
    }).should('be.visible');
  });
});
