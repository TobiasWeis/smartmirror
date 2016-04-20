var datetime = {
  start: function() {
    // initialize date and time
    this.update();

    // register an interval timer to update date and time
    setInterval( function() {
      datetime.update();
    }, config.datetime.refreshIntervalMs);
  },

  update: function() {
    this.updateDate();
    this.updateTime();
  },

  updateDate: function() {
    var now = new Date();

    $("#date").html(moment().format('dddd, DD. MMMM YYYY'));
  },

  updateTime: function() {
    $("#hoursminutes").html(moment().format('HH:mm'));
    $("#seconds").html(moment().format('ss'));
  }
};
