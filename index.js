var job = require("job"),
    done = job.done;

var matrix = module.exports = function (config) {
  return new Matrix(config);
};

var Matrix = function (config) {
  var width = config.width,
      height = config.height;

  this.matrix = [];

  for (var y = 0; y < height; y++) (function () {
    var row = [];
    for (var x = 0; x < width; x++) {
      row.push();
    }
    this.matrix.push(row);
  })();
};

Matrix.prototype.raw = function () {
  return JSON.parse(JSON.stringify(this.matrix));
};

Matrix.prototype.at = function (args) {
  if (args.val) {
    this.matrix[args.y][args.x] = args.val;
  }

  return this.matrix[args.y][args.x];
};

Matrix.prototype.cut = function (area) {
  var m = [];
  for (var y = area.begin.y; y < area.end.y; y++) {
    m.push(this.matrix.slice(area.begin.x, area.end.x));
  }
  return matrix(m);
}

Matrix.prototype.forEach = function (handler) {
  this.matrix.forEach(function (row, y) {
    row.forEach(function (cell, x) {
      handler(cell, { x: x, y: y });
    });
  });
};

Matrix.prototype.some = function (handler) {
  var self = this;
  return job(function () {
    self.forEach(function () {
      if (handler.apply(null, arguments) === true) {
        done(true);
      }
    });
    return false;
  });
};
