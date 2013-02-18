var type = require('type'),
    job = require("job");

var done = job.done;

var matrix = module.exports = function (config) {
  return new Matrix(config);
};

var Matrix = function (config) {
  var matrix = this;

  type(config).handle({
    'arr': function () {
      matrix.matrix = config;
      matrix.size = {
        width: config[0].length,
        height: config.length
      };
    },
    'default': function () {
      matrix.matrix = [];
      matrix.size = {
        width: config.width,
        height: config.height
      };

      for (var y = 0; y < config.height; y++) (function () {
        var row = [];
        for (var x = 0; x < config.width; x++) {
          row.push(null);
        }
        matrix.matrix.push(row);
      })();
    }
  });
};

Matrix.prototype.raw = function () {
  return cloneMatrix(this.matrix);
};

Matrix.prototype.at = function (pos, val) {
  if (outOfBounds(this.size, pos)) {
    return;
  }
  if (val) {
    this.matrix[pos.y][pos.x] = val;
  }
  return this.matrix[pos.y][pos.x];
};

Matrix.prototype.cut = function (area) {
  var m = [];
  for (var y = area.begin.y; y < area.end.y; y++) {
    m.push(this.matrix.slice(area.begin.x, area.end.x));
  }
  return matrix(m);
}

Matrix.prototype.each = function (handler) {
  this.matrix.forEach(function (row, y) {
    row.forEach(function (cell, x) {
      handler(cell, { x: x, y: y });
    });
  });
};

Matrix.prototype.some = function (handler) {
  var matrix = this;
  return job(function () {
    matrix.each(function () {
      if (handler.apply(null, arguments) === true) {
        done(true);
      }
    });
    return false;
  });
};

var outOfBounds = function (size, pos) {
  return !(pos.x >= 0 &&
           pos.y >= 0 && 
           pos.x < size.width && 
           pos.y < size.height);
};

var cloneMatrix = function (m) {
  return JSON.parse(JSON.stringify(m));
};
