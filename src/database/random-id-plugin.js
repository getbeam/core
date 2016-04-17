/**
 * Adds an unique auto-generated random ID to the schema.
 * This Plugin does NOT automatically add the id-field to the schema,
 * because I like having an overview about all fields in the schema definition.
 */

/**
 * Adds an unique auto-generated random ID to the schema.
 * This Plugin does NOT automatically add the id-field to the schema,
 * because I like having an overview about all fields in the schema definition.
 * @param  {mongoose.Schema} schema Will be automatically added to the schema.
 * @param  {Object} options { padding: Number, max: Number, min: Number }
 */
export default function randomIdPlugin(schema, options) {
  function randomIntBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const defaults = {
    padding: 1000000000000,
    max: 999999999999,
    min: 111111111111
  };
  const opts = Object.assign({}, defaults, options);
  const maxShift = 20;

  function generateId() {
    return opts.padding + randomIntBetween(opts.min, opts.max);
  }

  /**
   * Recursive function to find a unique id
   * @param  {Number}   carriedId Passed ID in recursion step
   * @param  {Number}   tries     Integer counts the shifting of IDs
   * @param  {Object}   _this     `this`-scope of schema
   * @param  {Function} next      Callback
   */
  function generateUniqueId(carriedId, tries, _this, next) {
    let id = carriedId || generateId();

    // Generate a new random id, if
    //  - shifting exceeded `maxShift`, to kick-off new random process
    //  - id exceeds `opts.max` to prevent overflow
    if (tries >= maxShift || id >= opts.padding + opts.max) {
      generateUniqueId(null, 0, _this, next);
      return;
    }

    // Shift id, if we carry one around
    if (carriedId) id++;

    // Try to find a document with the generated id.
    // Recurse, if duplicate found.
    // Set id and continue, if id is unique.
    _this.constructor.findOne({ id })
      .then((found) => {
        if (found) return generateUniqueId(id, tries + 1, _this, next);

        _this.id = id; // eslint-disable-line no-param-reassign
        return next();
      });
  }

  // Register pre save hook
  schema.pre('save', function (next) {
    generateUniqueId(null, 0, this, next);
  });
};
