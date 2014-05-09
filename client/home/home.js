// Template variables
Template.dashboard.workouts = function () {
  return Workouts.find({"user": Meteor.userId()});
};

Template.dashboard.publicWorkouts = function () {
  return Workouts.find({"public": true});
}

Template.dashboard.completedSessions = function () {
  return CompletedSessions.find();
};

Template.dashboard.sessionHistory = function() {
  sessionHistoryCalendar();
}


Template.dashboard.events({
 'click .new': function() {
    var _id = Workouts.insert({"name": "New Workout", "user": Meteor.userId(), "sections": []})
    Router.go('edit', {'_id': _id});
  }
});


Template.accountModal.events({
  'click .login-button': function() {
    $('#accountModal').modal('hide');
  }
});

Template.navbar.events({
  'click #signout': function() {
    Meteor.logout();
  }
})


function sessionHistoryCalendar() {

  var end = new Date();
  var start = new Date(end);
  start.setDate(end.getDate() - 28);

  var raw = CompletedSessions
    .find({user: Meteor.userId()})
    .fetch()

  var data = d3.nest()
    .key(function(d) { return d.date.getFullYear() + ',' + d.date.getMonth() + ',' + d.date.getDate(); })
    .rollup(function(leaves) { return d3.sum(leaves, function(d) {return d.totalTime; })})
    .map(raw);

}
