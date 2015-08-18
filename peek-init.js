Peek = {};
if (Meteor.isClient) {
  Meteor.startup(function() {
    var newPeek = new peek();
    _.extend(Peek, newPeek);
  });
}