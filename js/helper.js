// Date.now
if (!Date.now) {
  Date.now = function() { return new Date().getTime(); }
}

// Date.addDays
Date.prototype.addDays = function(days) {
  this.setDate(this.getDate() + days);

  return this;
}

var helper = {
  round: function(value, significants) {
    return parseFloat(value).toFixed(significants);
  },

  toMillisecondsDate: function(dt) {
    return new Date(dt * 1000);
  }
};
