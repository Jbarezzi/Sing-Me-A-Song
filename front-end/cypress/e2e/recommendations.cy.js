before(() => {
  cy.seedDb();
});

describe("Visit, render and verify GETS", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("should downvote and exclude recommendation when score -6", () => {
    cy.intercept("GET", "/recommendations").as("renderSongs");
    cy.intercept("DELETE", "");
    cy.get(':nth-child(4) > :nth-child(3) > [data-cy="downvote"]').click();
    cy.wait("@renderSongs");
    cy.get("body")
      .find("article")
      .then((recommendation) => {
        expect(recommendation.length).to.be.lessThan(10);
      });
  });

  it("should enter home page and render 10 or less recommendations then create recommendation", () => {
    cy.get("body").find("article").should("have.length", 9);
    cy.get('[data-cy="name"]').type("Eating Like Kings - Shawn James");
    cy.get('[data-cy="youtubeLink"]').type(
      "https://www.youtube.com/watch?v=dNm7wo9xi20"
    );
    cy.intercept("GET", "/recommendations").as("renderSongs");
    cy.get('[data-cy="create"]').click();
    cy.wait("@renderSongs");
    cy.get("body")
      .find("article")
      .then((recommendation) => {
        expect(recommendation.length).to.be.lessThan(11);
      });
  });

  it("should enter top page and render 10 or less recommendations", () => {
    cy.get('[data-cy="top"]').click();
    cy.url().should("include", "/top");
    cy.get("body")
      .find("article")
      .then((recommendation) => {
        expect(recommendation.length).to.be.lessThan(11);
      });
  });

  it("should enter 'random' page and render 1 recommendation", () => {
    cy.get('[data-cy="random"]').click();
    cy.url().should("include", "/random");
    cy.get("body").find("article").should("have.length", 1);
  });

  it("should return to home", () => {
    cy.get('[data-cy="random"]').click();
    cy.get('[data-cy="home"]').click();
    cy.url().should("include", "/");
  });
});

after(() => {
  cy.resetDb();
});
