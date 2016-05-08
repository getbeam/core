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
    PersonController.byId(this.req.user.id)
      .then(person => {
        if (!person) {
          return this.next(new NotFoundError("User could not be found."));
        }

        this.jsonMainObject("persons", person.toJSON());
        return person.getUploads({
          limit: 5,
          order: [["createdAt", "DESC"]]
        });
      })
      .then(uploads => {
        uploads.forEach(upload => {
          this.jsonAddRelationships("uploads", "uploads", upload.toJSON());
        });
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
   * PATCH persons/me
   * @return {[type]} [description]
   */
  patch() {
    const values = this.body();

    PersonController.updateById(this.req.user.id, values)
      .then(updatedPerson => {
        this.status(200);
        this.jsonSuccess();
        this.jsonMainObject("persons", updatedPerson.toJSON());
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
