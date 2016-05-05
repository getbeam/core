"use strict";

const Service = require("../../lib/service");
const { ConflictError, NotFoundError } = require("../../lib/errors");
const PersonController = require("../controllers/person-controller");

/** Service for Person Routes */
class PersonService extends Service {
  /**
   * HTTP GET persons/:id
   */
  get() {
    PersonController.byId(this.param("id"))
      .then(person => {
        if (!person) {
          return this.next(new NotFoundError("User could not be found."));
        }

        this.jsonMainObject("persons", person.toJSON());
        return this.send();
      }).catch(ex => {
        return this.next(ex);
      });
  }

  /**
   * HTTP POST persons/
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
        this.status(201);
        this.jsonSuccess();
        this.jsonMainObject("persons", newPerson.toJSON());
        return this.send();
      })
      .catch(ex => {
        return this.next(ex);
      });
  }

  /**
   * HTTP DELETE persons/:id
   */
  delete() {
    PersonController.deleteById(this.param("id"))
      .then(found => {
        if (!found) {
          return this.next(new NotFoundError());
        }

        this.jsonSuccess();
        return this.send();
      })
      .catch(ex => {
        return this.next(ex);
      });
  }
}

module.exports = PersonService;
