// Basic end-to-end flow for your portfolio app.

describe("Portfolio App E2E", () => {
  const adminEmail = "admin@portfolio.local";
  const adminPassword = "Admin123!";

  it("redirects anonymous user from /home to /signin", () => {
    // Visiting a protected route without JWT should send us to /signin
    cy.visit("/home");
    cy.url().should("include", "/signin");
  });

  it("logs in as admin and shows admin dashboard", () => {
    cy.visit("/signin");

    cy.get('input[type="email"]').type(adminEmail);
    cy.get('input[type="password"]').type(adminPassword);

    cy.contains(/submit/i).click();

    // After successful login we should be on /home with admin greeting
    cy.url().should("include", "/home");
    cy.contains(/welcome, admin/i).should("be.visible");
    cy.contains(/mission statement/i).should("be.visible");
  });

  it("navigates to About and Projects from navbar", () => {
    // Assumes we are already logged in from previous test.
    cy.contains(/about/i).click();
    cy.contains(/Hung Sheung Wong/i).should("be.visible");
    cy.contains(/View my resume/i).should("be.visible");

    cy.contains(/projects/i).click();
    cy.contains(/Featured Projects/i).should("be.visible");
  });

  it("logs out back to landing page", () => {
    cy.contains(/logout/i).click();

    // Your Navbar sends users to "/" after logout,
    // and MainRouter shows the Landing page when not authenticated.
    cy.url().should("eq", `${Cypress.config("baseUrl")}/`);

    cy.contains(/Welcome! Sign in to see my profile/i).should("be.visible");
  });
});
