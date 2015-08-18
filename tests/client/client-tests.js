var usersHandle = Meteor.subscribe("users"),
  playersHandle = Meteor.subscribe("players");

Tinytest.add("Is Peek defined?", function(test) {
  var peekIsUndefined = true;
  if (Peek !== undefined && Peek !== null) {
    peekIsUndefined = false;
  }
  test.equal(peekIsUndefined, false,
    "Peek should be exported and defined in the client.");
});

Tinytest.add("Peek.getCollectionNames()", function(test) {
  var collectionNames = Peek.getCollectionNames(),
    usersInNames = collectionNames.indexOf("users") > -1,
    playersInNames = collectionNames.indexOf("players") > -1,
    teamsInNames = collectionNames.indexOf("teams") > -1;
  Tracker.autorun(function() {
    if (playersHandle.ready()) {
      test.equal(usersInNames, true, "users");
      test.equal(playersInNames, true, "players");
      test.equal(teamsInNames, false, "teams");
    }
  });
});

Tinytest.add("Peek.getCollection()", function(test) {
  var players = Peek.getCollection("players");
  test.equal(typeof players, "object", "players");
});

/**
 *  PeekCollection.getListFieldLabels() should return a total of
 *  6 list labels, validating that setting
 */
Tinytest.add("PeekCollection.getListFieldLabels()", function(test) {
  var players = Peek.getCollection("players"),
    fieldLabels = players.getListFieldLabels(),
    fieldsLength = fieldLabels.length,
    firstName = fieldLabels[0],
    lastName = fieldLabels[1],
    profile = fieldLabels[2],
    stats = fieldLabels[3];
  test.equal(fieldsLength, 6, "Number of fields in players");
});