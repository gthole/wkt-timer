Template.edit.workout = function() {
  return Workouts.findOne({_id: Session.get('wid')});
}

Template.editMove.time_per_options = function() {
  var time_per = this.time_per;
  // TODO: Render with templates
  var options = _.range(1, 11).map(function(i) {
    return "<option" + (i === time_per ? " selected" : "") + ">" + i + "</option>";
  })
  return options.join('\n');
}

Template.editMove.cooldown_options = function() {
  var cooldown = this.cooldown ? this.cooldown : 10;
  // TODO: Render with templates
  var options = _.range(5, 65, 5).map(function(i) {
    return "<option" + (i === cooldown ? " selected" : "") + ">" + i + "</option>";
  })
  return options.join('\n');
}


function parseMove() {
  return {
    "name": $(this).find(".edit-name").val(),
    "count": parseInt($(this).find(".edit-count").val()),
    "time_per": parseInt($(this).find(".edit-time_per").val()),
    "cooldown": parseInt($(this).find(".edit-cooldown").val()),
  };
}

function parseSection() {
  return {
    "name": $(this).find('.section-name').text().trim(),
    "movements": $(this).find('.edit-move').map(parseMove).toArray()
  }
}

function parseWorkout() {
  return {
    "name": $("h1.workout-name").text().trim(),
    "user": Meteor.userId(),
    "sections": $('.edit-section').map(parseSection).toArray()
  };
}


Template.edit.events({
  "change .edit-count": function(event) {
    $(event.currentTarget).next().html(event.currentTarget.value);
  },
  "click #save": function() {
    Workouts.upsert({_id: Session.get('wid')}, parseWorkout());
    window.location = '/';
  },
  "click #delete": function() {
    Workouts.remove({_id: Session.get('wid')});
    window.location = '/';
  },
  "click .editable": function(event) {
    var sname = $(event.currentTarget);
    if (sname.html().slice(0, 6) != '<input') {
      sname.html('<input class="form-control editing" value="' + sname.text().trim() + '">');
      $('.editing').focus();
    }
  },
  "blur .editing": function(event) {
    var sninput = $(event.currentTarget);
    var text = sninput.val();
    sninput.parent().html(text);
  },
  "click .del-section": function(event){
    $(event.currentTarget).closest('.edit-section').remove();
  },
  "click .add-section": function(event){
    var rendered = UI.renderWithData(Template.editSection, {"name": "New Section", "movements": [{"name": "", "count": 30, "time_per": 1, "cooldown": 10}]});
    UI.insert(rendered, $(event.currentTarget).closest(".home")[0]);
  },
  "click .up-section": function(event){
    var row = $(event.currentTarget).closest(".edit-section");
    $(row).insertBefore(row.prev());
  },
  "click .down-section": function(event){
    var row = $(event.currentTarget).closest(".edit-section");
    $(row).insertAfter(row.next());
  },
  "click .del-move": function(event){
    $(event.currentTarget).closest('.edit-move').remove();
  },
  "click .add-move": function(event){
    var table = $(event.currentTarget).closest(".edit-section").find("table");
    var rendered = UI.renderWithData(Template.editMove, {"name": "", "count": 30, "time_per": 1, "cooldown": 10});
    UI.insert(rendered, table[0]);
  },
  "click .up-move": function(event){
    var row = $(event.currentTarget).closest(".edit-move");
    $(row).insertBefore(row.prev());
  },
  "click .down-move": function(event){
    var row = $(event.currentTarget).closest(".edit-move");
    $(row).insertAfter(row.next());
  }
})
