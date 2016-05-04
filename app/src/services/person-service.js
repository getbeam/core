"use strict";

const Service = require("../../lib/service");
const ConflictError = require("../../lib/errors/conflict");
const PersonController = require("../controllers/person-controller");

/** Service for Person Routes */
class PersonService extends Service {
  get() {
    PersonController.byId(this.param("id"))
      .then(person => {
        this.json(person);
      }).catch(ex => {
        this.next(ex);
      });
  }

  post() {
    const userData = {
      name: this.body("name"),
      email: this.body("email")
    };

    PersonController
      .findOne({
        where: { emailAddress: userData.email }
      })
      .then(existingPerson => {
        if (!existingPerson) {
          return null;
        }

        throw new ConflictError(
          "The user could not be created. emailAddress is already created",
          "email"
        );
      })
      .then(() => {
        return PersonController.create(userData);
      })
      .then(newPerson => {
        this.status(201).json(newPerson);
      })
      .catch(ex => {
        this.next(ex);
      });
  }
}

module.exports = PersonService;
