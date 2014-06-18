
// Total workout time run
Session.setDefault('totalTime', 0);

// Enum of application state, choices: null, 'running', 'paused', 'finished'
Session.setDefault('state', null);

// Currently running sequence flattened to an Array
Session.setDefault('queue', null);

// Active movement
Session.setDefault('move', null);

// Number of seconds remaining for current action
Session.setDefault('count', null);

// Current workout id
Session.setDefault('wid', null);


// TODO: This should move into base.js, but it breaks back button nav.
Router.map(function() {
  this.route('home', {
    path: '/'
  }),
  this.route('edit', {
    path: '/edit/:_id',
    data: function() { Session.set('wid', this.params._id); }
  }),
  this.route('timer', {
    path: '/timer/:_id',
    data: function() {
      Session.set('wid', this.params._id);
      data = Workouts.findOne(this.params._id);
      $(window).on('keydown', function(e){});
      return data;
    },
    onStop: function() {
      clearCounter();
      clearSession();
    }
  })
});


Template.status.running = function() {
  return Session.equals('state', 'running');
}

Template.status.statusText = function() {
  // Violates MVC
  if (Session.equals('state', 'paused'))
    return 'Paused';
  if (Session.equals('state', 'finished'))
    return 'Nice work!';
  return 'Tap to start!';
}

Template.status.count = function () {
  var move = Session.get('move');
  if (move)
    return Math.ceil(Session.get('count') / move.time_per);
}

Template.status.countTag = function () {
  var move = Session.get('move');
  if (move)
    return move.time_per > 1 ? 'left' : 'sec'
}

Template.status.statusClass = function () {
  var counter = Session.get('count');
  var move = Session.get('move');
  if (move && move.isCoolDown) {
    return 'cool';
  }
  return (counter && counter <= 10) ? 'warm' : '';
}

Template.status.moveName = function () {
  var move = Session.get('move');
  if (move)
    return move.name;
}

Template.status.formattedTotal = function () {
  var total_seconds = Session.get('totalTime'),
      hours = Math.floor(total_seconds / 3600),
      minutes = Math.floor(total_seconds / 60) % 60,
      seconds = total_seconds % 60;
  return formatTime(hours) + ':' + formatTime(minutes) + ':' + formatTime(seconds);
}

Template.status.next = function() {
  var index = getCurrentIndex();
  var queue = Session.get('queue');

  if (index + 1 < queue.length) {
    return queue[index + 1].name;
  }
}

function formatTime(segment) {
  return segment < 10 ? '0' + segment : segment;
}


// Counter control

var counterInterval;

function startCounter() {
  var move = Session.get('move');

  Session.set('count', move.count * move.time_per);
  Session.set('state', 'running');
  counterInterval = Meteor.setInterval(timer, 1000);
}

function timer()
{
  var count = Session.get('count') - 1;
  Session.set('count', count);
  Session.set('totalTime', Session.get('totalTime') + 1);

  var move = Session.get('move');
  var percent = (((move.elapsed_time + move.count - count) * 100) / Session.get('totalWorkoutTime')) + '%';
  $('.progress').css({width: percent});

  if (count <= 0)
  {
    var chime = $('#chime').get(0);
    chime.currentTime=0;
    chime.play();

    clearCounter();
    if (move.isCoolDown) {
      startNext(1);
    } else {
      Session.set(
        'move',
        {
          'name': 'Cooldown',
          'time_per': 1,
          'elapsed_time': move.elapsed_time + move.count,
          'count': move.cooldown,
          'indexID': move.indexID,
          'index': move.index,
          'isCoolDown': true
        }
      );
      startCounter();
    }
  }
}

function getCurrentIndex() {
  var move = Session.get('move');
  return move ? move.index : 0;
}

function startNext(inc) {
  // Assumes counter is cleared.
  var queue = Session.get('queue');
  var index = getCurrentIndex();
  var nextIndex = index + inc;

  if (nextIndex >= queue.length || nextIndex < 0) {
    clearCounter();
    Session.set('move', null);
    if (nextIndex >= queue.length) {
      Session.set('state',  'finished');
      logResults();
    } else {
      Session.set('state',  null);
    }
    return;
  }
  Session.set('move', queue[nextIndex]);
  startCounter();
}

function logResults() {
  if (Session.get('totalTime') > 300) {
    var result = {'workout': Session.get('wid'), 'totalTime': Session.get('totalTime'), 'date': new Date(), 'user': Meteor.userId()};
    CompletedSessions.insert(result);
  }
}

function clearSession() {
  // Reset all the stored data about this workout session.
  Session.set('count', null);
  Session.set('state', null);
  Session.set('move', null);
  Session.set('queue', null);
  Session.set('totalTime', 0);
}

function clearCounter() {
  // Clear the counterInterval; stops the timer.
  Meteor.clearInterval(counterInterval);
  counterInterval = undefined;
}

function createQueue() {
  var wkt = Workouts.findOne({_id: Session.get('wid')});
  var queue = [];
  var elapsed_time = 0;

  wkt.sections.map(function(section) {
    section.movements.map(function(move) {
      move.cooldown = move.cooldown ? move.cooldown : section.defaultCooldown;
      move.index = queue.length;
      move.time_per = move.time_per ? move.time_per : 1;
      move.elapsed_time = elapsed_time;
      queue.push(move);
      elapsed_time += move.count + move.cooldown;
    });
  });
  Session.set('totalWorkoutTime', elapsed_time);
  Session.set('queue', queue);
}

function startSequence(indexID) {
  clearCounter();

  if (! Session.get('queue'))
    createQueue();
  queue = Session.get('queue');

  for (i in queue) {
    if (queue[i].indexID === indexID) {
      Session.set('move', queue[i]);
      startCounter();
      return;
    }
  }
}

function pauseOrStart() {
  if (counterInterval) {
    clearCounter();
    Session.set('state', 'paused');
  } else
  if (Session.get('move')) {
    Session.set('state', 'running');
    counterInterval = Meteor.setInterval(timer, 1000);
  } else {
    startSequence('0-0') // Start at the beginning
  }
  return;
}


// Events
Template.timer.rendered = function(){
  $(window).on('keydown', function(e){
    if (e.which === 32) {
      e.preventDefault();
      pauseOrStart();
    }
    else if (e.which == 27) {
      e.preventDefault();
      clearCounter();
      clearSession();
    }
    else if (e.which == 38) {
      e.preventDefault();
      clearCounter();
      startNext(-1);
    }
    else if (e.which == 40) {
      e.preventDefault();
      clearCounter();
      startNext(1);
    }
  });
};

Template.timer.events({
  'click .menu-toggle': function(e) {
    // Let jquery-sidebar run
    e.stopPropagation();
  },
  'click .content': function(e) {
    e.preventDefault();
    pauseOrStart();
  }
});
