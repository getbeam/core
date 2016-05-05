"use strict";

const Service = require("../../lib/service");
const { ConflictError, NotFoundError } = require("../../lib/errors");
const PersonController = require("../controllers/person-controller");

/** Service for Person Routes */
class PersonService extends Service {
  /**
   * HTTP GET resource/:id
   */
  get() {
    PersonController.byId(this.param("id"))
      .then(person => {
        if (!person) {
          return this.next(new NotFoundError("User could not be found."));
        }
        return this.json(person);
      }).catch(ex => {
        return this.next(ex);
      });
  }

  /**
   * HTTP POST resource/
   */
  post() {
    const userData = {
      name: this.body("name"),
      email: this.body("email")
    };

    // Check if Person with emailAddress is already registered.
    // If not, create new Person and respond with it.
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
