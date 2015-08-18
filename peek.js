// peek constructor
peek = function() {
  // initialize subscriptions
  this._subscriptions = [];
  this._initSubscriptions();
  // initialize collections
  this._collections = [];
  this._initCollections();
};

/**
 *  addFieldsTo() adds an array of fields to this peek instance.
 *
 *  @param {String} collectionName
 *  @param {Array} fields
 */
peek.prototype.addFieldsTo = function(collectionName, fields) {
  var self = this,
    collection = self.getCollectionByName(collectionName);
  collection.addFields(fields);
};

peek.prototype.removeFieldsFrom = function(collectionName, fields) {
  var self = this,
    collection = self.getCollectionByName(collectionName);
  collection.removeFields(fields);
};

peek.prototype.getCollectionNames = function() {
  var collectionNames = [];
  _.each(this._getCollections(), function(collection) {
    collectionNames.push(collection.getName());
  });
  return collectionNames;
};

peek.prototype.getCollection = function(collectionName) {
  var collection = new PeekCollection(collectionName);
  return collection;
};

peek.prototype.addCollection = function(collection, cb) {
  this._collections = this._collections || [];
  if (this._collections.indexOf(collection) < 0) {
    this._collections.push(collection);
  }
  if (!_.isEmpty(cb)) {

  }
};

peek.prototype.getCollectionByName = function(name) {
  var self = this;
  return _.findWhere(self._collections, {
    _name: name
  });
};

peek.prototype._hasSchema = function(collection) {
  return (!_.isEmpty(collection) &&
    typeof collection.simpleSchema === "function" &&
    collection.simpleSchema() != null);
};

/**
 *  _initCollections() iterates through the current peek instance's
 *  subscriptions, and creates a PeekCollection instance for each one of them,
 *  and adds the PeekCollection instance to this peek instance.
 */
peek.prototype._initCollections = function() {
  var self = this;
  _.each(self._getSubscriptions(), function(subscription) {
    var collection = new PeekCollection(subscription);
    if (self._hasSchema(collection)) {
      self._addCollection(collection);
    }
  });
};

peek.prototype._getCollections = function() {
  return this._collections;
};

peek.prototype._addCollection = function(collection) {
  this._collections.push(collection);
};

/**
 *  _initSubscriptions() retrieves all of the current application's
 *  subscriptions, iterates through them, and adds them to the current peek
 *  instance.
 */
peek.prototype._initSubscriptions = function() {
  var self = this,
    //all the subscriptions that have been subscribed.
    subscriptions = Meteor.default_connection._subscriptions;
  Object.keys(subscriptions).forEach(function(key) {
    self._addSubscription(subscriptions[key].name);
  });
};

peek.prototype._addSubscription = function(subscription) {
  if (this._subscriptions.indexOf(subscription) < 1) {
    this._subscriptions.push(subscription);
  }
};

peek.prototype._getSubscriptions = function() {
  return this._subscriptions;
};