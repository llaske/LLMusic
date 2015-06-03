
// Recognition object
enyo.kind({
    name: "Recognition",
    kind: enyo.Component,
    published: {
        lang: "en-US",
		continuous: true,
		interimResults: true
    },
    events: {
		onStart: "",
		onError: "",
		onEnd: "",
		onResult: ""
    },
	
	// Constructor
    create: function() {
        this.inherited(arguments);
		this.recognition = (!!("webkitSpeechRecognition" in window)) ? new webkitSpeechRecognition() : null;
		if (this.recognition != null) {
			var that = this;
			this.recognition.onstart = function() {	that.doStart(); };
			this.recognition.onerror = function(e) { that.doError(e); };
			this.recognition.onend = function() { that.doEnd(); };
			this.recognition.onresult = function(e) { that.doResult(e); };
			this.langChanged();
			this.continuousChanged();
			this.interimResultsChanged();
		}
    },
	
	langChanged: function() {
		if (!this.isSupported()) return;
		this.recognition.lang = this.lang;
	},
	
	continuousChanged: function() {
		if (!this.isSupported()) return;
		this.recognition.continuous = this.continuous;
	},
	
	interimResultsChanged: function() {
		if (!this.isSupported()) return;
		this.recognition.interimResults = this.interimResults;
	},
	
	// Methods
    isSupported: function() {
		return this.recognition != null;
    },
	
	start: function() {
		if (!this.isSupported()) return;
		this.recognition.start();
	},
	
	stop: function() {
		if (!this.isSupported()) return;
		this.recognition.stop();
	}
});