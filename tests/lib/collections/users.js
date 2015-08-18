Meteor.users.allow({
  update: function(userId, doc) {
    if (!userId) {
      return false
    }
    return (doc.id === Meteor.userId() ||
      Roles.userIsInRole(userId, "super"));
  },
  remove: function(userId, doc) {
    return (userId && Roles.userIsInRole(Meteor.userId(), "super"));
  }
});

Schema = {};
Schema.User = new SimpleSchema({
  emails: {
    type: [Object]
  }
});
Meteor.users.attachSchema(Schema.User);