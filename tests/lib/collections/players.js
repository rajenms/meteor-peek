Players = new Mongo.Collection('players');

Schema = {};

Schema.Players = new SimpleSchema({
  'firstName': {
    type: String
  },
  'lastName': {
    type: String
  },
  'profile': {
    type: Object
  },
  'profile.team': {
    type: String
  },
  'profile.age': {
    type: Number
  },
  'stats': {
    type: Object
  },
  'stats.ppg': {
    type: [Object],
    peek: {
      showInList: false
    }
  },
  'stats.ppg.$': {
    peek: {
      showInList: false
    }
  },
  'stats.ppg.$.year': {
    type: Number,
    peek: {
      showInList: false
    }
  },
  'stats.ppg.$.pointAverage': {
    type: Number,
    peek: {
      showInList: false
    }
  }
});
Players.attachSchema(Schema.Players);