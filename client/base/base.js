Meteor.subscribe("userData");

Workouts = new Meteor.Collection('workouts', {
  transform: function(wkt) {
    // Store the nested index for easy reference.
    _.each(wkt.sections, function(section, sindex) {
      _.each(section.movements, function(movement, mindex) {
        movement.indexID = sindex + '-' + mindex;
      });
    });
    return wkt;
  }
});

CompletedSessions = new Meteor.Collection('completedsessions');
