function Chain() {
  this.queue = [];
  this.onend = function(err) {};
} 
Chain.prototype.add = function() {
  var jobs = [].slice.call(arguments);
  jobs.forEach(
    (function(job) {
      this.queue.push.apply(
        this.queue, Array.isArray(job) ? job : [job]
      );
    }).bind(this)
  );
  return this;
}
Chain.prototype.next = function() {
  if (this.queue.length) {
    this.queue.shift().call();    
  } else {
    this.onend();
  }
  return this;
}  
Chain.prototype.traverse = function(fn) {
  fn && fn.call && fn.apply && (this.onend = fn);
  this.next();
  return this;
}
var chain = new Chain();
chain.add(
  function() {
    setTimeout(function() {
      console.log(1)
      chain.next();
    }, 2000);
  },
  function() {
    setTimeout(function() {
      console.log(2)
      chain.next();
    }, 1000); 
  }
)
chain.traverse(function() {
  console.log(5)
});
