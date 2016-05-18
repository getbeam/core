"use strict";

const Service = require("../../lib/service");
const { ConflictError, NotFoundError } = require("../../lib/errors");
const PersonController = require("../controllers/person-controller");

/** Service for Person Routes */
class PersonService extends Service {
  /**
   * GET persons/me
   */
  get() {
    const { response } = this;

    PersonController.byId(this.req.user.id)
      .then(person => {
        if (!person) {
          return this.next(new NotFoundError("User could not be found."));
        }

        response.putSingleData("person", person);

        return person.getUploads({
          limit: 5,
          order: [["createdAt", "DESC"]]
        });
      })
      .then(uploads => {
        response.putListData("uploads", uploads);
        return this.send();
      })
      .catch(ex => {
        return this.next(ex);
      });
  }

  /**
   * POST persons/
   */
  post() {
    const { response } = this;

    const authData = {
      provider: this.req.auth_provider,
      id: this.req.auth_user_id
    };

    // Check if Person with emailAddress is already registered.
    // If not, create new Person and respond with it.
    PersonController
      .findOne({
        where: { emailAddress: this.body("emailAddress") }
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
        return PersonController.create(this.body(), authData);
      })
      .then(newPerson => {
        response
          .setSuccess()
          .putSingleData("person", newPerson);

        return this.status(201).send();
      })
      .catch(ex => {
        return this.next(ex);
      });
  }

  /**
   * PATCH persons/me
   * @return {[type]} [description]
   */
  patch() {
    const { response } = this;

    const values = this.body();

    PersonController.updateById(this.req.user.id, values)
      .then(updatedPerson => {
        response
          .setSuccess()
          .putSingleData("person", updatedPerson);

        return this.send();
      })
      .catch(ex => {
        return this.next(ex);
      });
  }

  /**
   * DELETE persons/me
   */
  delete() {
    const { response } = this;

    PersonController.deleteById(this.req.user.id)
      .then(found => {
        if (!found) {
          return this.next(new Error());
        }

        response.setSuccess();
        return this.send();
      })
      .catch(ex => {
        return this.next(ex);
      });
  }
}

module.exports = PersonService;
