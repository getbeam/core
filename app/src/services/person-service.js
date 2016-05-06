"use strict";

const Service = require("../../lib/service");
const { ConflictError, NotFoundError } = require("../../lib/errors");
const PersonController = require("../controllers/person-controller");

/** Service for Person Routes */
class PersonService extends Service {
  /**
   * HTTP GET persons/me
   */
  get() {
    PersonController.byId(this.req.user.id)
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

    const authData = {
      provider: this.req.auth_provider,
      id: this.req.auth_user_id
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
        return PersonController.create(userData, authData);
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
   * HTTP DELETE persons/me
   */
  delete() {
    PersonController.deleteById(this.req.user.id)
      .then(found => {
        if (!found) {
          return this.next(new Error());
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
