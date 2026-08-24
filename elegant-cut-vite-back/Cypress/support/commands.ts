/// <reference types="cypress" />

// Define el comando personalizado
Cypress.Commands.add('loginAs', (role: 'client' | 'barber' | 'admin') => {
  cy.fixture('users').then((users) => {
    const user = users[role];

    cy.visit('/login');
    cy.get('input[name="email"]').type(user.email);
    cy.get('input[name="password"]').type(user.password);
    cy.get('button[type="submit"]').click();
  });
});