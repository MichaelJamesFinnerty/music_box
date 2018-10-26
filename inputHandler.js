function inputHandler(){

    //
    this.events = {}
    
    this.listen();
};

inputHandler.prototype.on = function (event, callback) {
    //console.log("Onboarding function " + event);
    if (!this.events[event]) {
        this.events[event] = [];
    }
    this.events[event].push(callback);
};

inputHandler.prototype.emit = function (event, data) {
    //console.log("Emitting function " + event);
    var callbacks = this.events[event];
    if (callbacks) {
        callbacks.forEach(function (callback) {
            callback(data);
        });
    }
};

inputHandler.prototype.listen = function() {
    //console.log("Listening");
    var self = this;
    
    document.addEventListener("click", function (event) {
        self.emit("click", event);
    })
};