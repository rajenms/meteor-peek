/**
 *  PeekCollection() is the constructor for a an object that represents
 *  a Meteor collection with added fields and functionality to help with
 *  Peek's admin interface.
 *
 *  @param {String} collectionName
 */
PeekCollection = function(collectionName) {
  var self = this,
    collection = Mongo.Collection.get(collectionName);
  _.extend(self, collection);
  if (!_.isEmpty(collection)) {
    self._ss = collection.simpleSchema();
  }
  // Initialize field definitions for this collection
  self._fieldDefinitions = [];
  self._initFieldDefinitions();
};

PeekCollection.prototype.getSchema = function() {
  return this._ss;
};

/**
 *  getName() returns this collection's name.
 */
PeekCollection.prototype.getName = function() {
  return this._name;
};

/**
 *  addFields() adds a list of fields, which is an array of strings,
 *  to this PeekCollection instance.
 *
 *  @param {Array} fields
 */
PeekCollection.prototype.addFields = function(fields) {
  var self = this,
    schema = {};
  _.each(fields, function(field) {
    schema[field.name] = {
      type: String,
      peek: {
        fieldVal: field.fieldVal
      }
    }
  });
  var newSs = new SimpleSchema(schema);
  self._addFieldDefsFromSimpleSchema(newSs);
};

PeekCollection.prototype.removeFields = function(fields) {
  var self = this;
  _.each(fields, function(field) {
    var indices = [];
    _.each(self._fieldDefinitions, function(def, idx) {
      if (def._key === field.name) {
        self._fieldDefinitions.splice(idx, 1);
      }
    });
  });
};

/**
 *  getListFieldLabels() returns all of this collection's labels/headers
 *  for collection list view.
 */
PeekCollection.prototype.getListFieldLabels = function() {
  var self = this,
    labels = [],
    sortedKeys = self._getSortedKeys();
  sortedKeys.forEach(function(key) {
    labels.push(self._getListFieldLabel.call(self, key));
  });
  return labels;
};

/**
 *  getItems() retrieves all of this collection's items, along with each item's
 *  sorted fields and each field's custom value if it exists.
 */
PeekCollection.prototype.getItems = function() {
  var self = this,
    collectionItems = self.find({}, {
      sort: {
        submitted: -1
      }
    }),
    items = [],
    sortedKeys = self._getSortedKeys();
  collectionItems.forEach(function(item, idx, array) {
    var fields = [];
    _.each(sortedKeys, function(key, idx) {
      var fieldDefinition = self.getFieldDefinitionByKey(key),
        fieldVal = self._getFieldVal.call(self, key, item);
      fields.push(fieldVal);
    });
    items.push({
      id: item._id,
      collectionName: self.getName(),
      fields: fields
    });
  });
  return items;
};

PeekCollection.prototype._compareFieldOrder = function(a, b) {
  if (a.peek.order < b.peek.order) {
    return -1;
  }
  if (a.peek.order > b.peek.order) {
    return 1;
  }
  return 0;
};

PeekCollection.prototype._getKeysSortedByIndex = function(fields) {
  var self = this,
    orderedFields = [],
    keys = [];
  orderedFields = fields.sort(self._compareFieldOrder);
  _.each(orderedFields, function(field) {
    keys.push(field._key);
  });
  return keys;
};

PeekCollection.prototype._getKeysSortedAlphabetically = function(fields) {
  var keys = [];
  _.each(fields, function(field) {
    keys.push(field._key);
  });
  return keys.sort();
};

/**
 *  _getSortedKeys() extracts field keys from this collection's field
 *  field definitions and then sorts them by their peek-configured indices
 *  first, and then alphabetically by key if those indices don't exist
 */
PeekCollection.prototype._getSortedKeys = function() {
  var self = this,
    fieldDefs = self._fieldDefinitions,
    fieldsWithIndex = [],
    fieldsWithNoIndex = [],
    keysByAlph = [],
    keysByIndex = [];
  _.each(fieldDefs, function(fieldDef) {
    if (!_.isEmpty(fieldDef.peek) &&
      fieldDef.peek.order !== undefined &&
      fieldDef.peek.order !== null) {
      fieldsWithIndex.push(fieldDef);
    } else {
      fieldsWithNoIndex.push(fieldDef);
    }
  });
  keysByIndex = self._getKeysSortedByIndex(fieldsWithIndex);
  keysByAlph = self._getKeysSortedAlphabetically(fieldsWithNoIndex);
  return keysByIndex.concat(keysByAlph);
};

PeekCollection.prototype._addFieldDefsFromSimpleSchema = function(ss) {
  var self = this,
    schema = ss ? ss._schema : null;
  if (!_.isEmpty(schema)) {
    Object.keys(schema).forEach(function(key) {
      var fieldDefinition = ss.getDefinition(key),
        showField = true;
      if (!_.isEmpty(fieldDefinition.peek)) {
        var peek = fieldDefinition.peek;
        if (peek.showInList !== undefined && peek.showInList === false) {
          showField = false;
        }
      }
      if (showField) {
        self._fieldDefinitions.push(_.extend(fieldDefinition, {
          _key: key
        }));
      }
    });
  }
};

/**
 *  _initFieldDefinitions() sets the simple schema definitions of this
 *  collection.
 */
PeekCollection.prototype._initFieldDefinitions = function() {
  var self = this;
  self._addFieldDefsFromSimpleSchema(self._ss);
};

PeekCollection.prototype.getFieldDefinitionByKey = function(key) {
  var self = this;
  return _.findWhere(self._fieldDefinitions, {
    _key: key
  });
};

/**
 *  _getListFieldLabel() returns either the field's simple schema list label or
 *  a custom "peek" list label that is set by the user.
 *
 *  @param {String} key
 */
PeekCollection.prototype._getListFieldLabel = function(key) {
  var self = this,
    fieldDefinition = self.getFieldDefinitionByKey(key);
  if (!_.isEmpty(fieldDefinition.peek)) {
    var listLabel = fieldDefinition.peek.listLabel;
    if (typeof listLabel === "string") {
      return listLabel;
    }
  }
  return fieldDefinition.label;
};

/**
 *  _getFieldVal() returns either the field value as it is, or a custom value
 *  if a function is set by the user in the field's simple schema
 *  configuration.
 *
 *  @param {Object} field
 *  @param {Object} fieldDefinition
 */
PeekCollection.prototype._getFieldVal = function(key, item) {
  var self = this,
    field = item[key],
    fieldDefinition = self.getFieldDefinitionByKey(key);
  if (!_.isEmpty(fieldDefinition.peek)) {
    if (typeof fieldDefinition.peek.fieldVal === "function") {
      self.peekField = field;
      self.peekItem = item;
      return fieldDefinition.peek.fieldVal.call(self);
    }
  }
  return field;
};