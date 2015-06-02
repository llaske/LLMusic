
// Main app class
enyo.kind({
	name: "LLMusic.App",
	kind: enyo.Control,
	components: [
		{name: "staff", classes: "staff", components: [
			{name: "clef", kind: "LLMusic.Clef"},
			{name: "notes", components: [
			]}
		]},
		{kind: "onyx.Button", name:"playstop", classes: "playstop-button", ontap:"playstopClicked", components: [
			{name: "playstopimage", kind: "Image", src: "images/play.svg", classes: "playstop-image"},
		]},
		{name: "score", classes: "score", content: "-/-", showing: false},
		{classes: "switch-clef-block", components: [
			{kind: "Image", src: "images/F_clef_icon.svg", classes: "switch-clef"},
			{classes: "switch-line", components: [
				{name: "clefswitch", kind: "onyx.ToggleButton", onContent: "", offContent: "", classes: "switch-forced", onChange: "clefChanged"}
			]},
			{kind: "Image", src: "images/G_clef_icon.svg", classes: "switch-clef"},
			{classes: "slider-block", components: [
				{kind: "Image", src: "images/tempo1.svg", classes: "tempo-image0"},				
				{kind: "Image", src: "images/tempo5.svg", classes: "tempo-image1"},				
				{kind: "Image", src: "images/tempo8.svg", classes: "tempo-image2"},			
				{name: "temposwitch", kind: "onyx.Slider", classes: "tempo-slider", value: 0, increment: 10, onChange:"tempoChanged"}
			]}
		]},
		{classes: "switch-input-block", components: [
			{kind: "Image", src: "images/keyboard.svg", classes: "switch-clef"},
			{classes: "switch-line", components: [
				{name: "inputswitch", kind: "onyx.ToggleButton", onContent: "", offContent: "", classes: "switch-forced", onChange: "inputChanged"}
			]},
			{kind: "Image", src: "images/microphone.svg", classes: "switch-clef"}			
		]},
		{classes: "keyboard", name: "keyboard", showing: true, components: [
			{kind: "Button", name: "button0", content: Util.noteName(0), classes: "keyboard-key", ontap: "noteClicked"},
			{kind: "Button", name: "button1", content: Util.noteName(1), classes: "keyboard-key", ontap: "noteClicked"},
			{kind: "Button", name: "button2", content: Util.noteName(2), classes: "keyboard-key", ontap: "noteClicked"},
			{kind: "Button", name: "button3", content: Util.noteName(3), classes: "keyboard-key", ontap: "noteClicked"},
			{kind: "Button", name: "button4", content: Util.noteName(4), classes: "keyboard-key", ontap: "noteClicked"},
			{kind: "Button", name: "button5", content: Util.noteName(5), classes: "keyboard-key", ontap: "noteClicked"},
			{kind: "Button", name: "button6", content: Util.noteName(6), classes: "keyboard-key", ontap: "noteClicked"},
		]},
		{classes: "microphone", name: "microphone", showing: false, components: [
			{name: "talk", content: "blablabla", classes: "talk-text"},
			{kind: "Image", src: "images/microphone_gray.svg", classes: "talk-image"}
		]}
	],
	
	// Constructor
	create: function() {
		this.inherited(arguments);
		this.started = false;
		this.tempo = 0;
		this.expectedNotes = [];
		this.inputNotes = [];
		this.noteObjects = [];
		this.timer = null;
	},

	// Processing
	startGame: function() {
		// Change interface
		this.$.playstopimage.setSrc("images/stop.svg");
		this.$.clefswitch.setDisabled(true);
		this.$.inputswitch.setDisabled(true);
		this.$.score.setShowing(false);
			
		// Compute expected notes
		this.expectedNotes = [];
		this.inputNotes = [];
		this.noteObjects = [];
		var gammeLength = Util.getGamme().length;
		var clefNote = this.$.clef.getNote();
		var startNote = (clefNote == 4 ? 0 : 2);
		var startOctave = (clefNote == 4 ? 4 : 2);
		for(var i = 0 ; i < 8 ; i++) {
			var random = Math.floor(Math.random()*13)+1;
			var note = (startNote + random) % gammeLength;
			var octave = (startOctave + Math.floor(random / gammeLength));
			this.expectedNotes.push({note: note, octave: octave});
			this.inputNotes.push(-1);
		}
		
		// Remove notes
		var notes = [];
		enyo.forEach(this.$.notes.getControls(), function(note) { notes.push(note); });
		for (var i = 0 ; i < notes.length ; i++) { notes[i].destroy();	}
		
		// Launch recognition timer
		this.currentNote = -1;
		var delay = (4000-this.$.temposwitch.getValue()*22);
        this.timer = window.setInterval(enyo.bind(this, "drawNote"), delay);			
	},
	
	stopGame: function() {
		// Change interface
		this.$.playstopimage.setSrc("images/play.svg");
		this.$.clefswitch.setDisabled(false);
		this.$.inputswitch.setDisabled(false);
		
		// Stop timer
		if (this.timer != null) {
			window.clearInterval(this.timer);
			this.timer == null;		
		}
		
		// Compute score
		this.computeScore();
		this.started = false;
	},

	drawNote: function() {
		// Pass last note, stop game
		this.currentNote = this.currentNote + 1;
		if (this.currentNote == this.expectedNotes.length) {
			this.stopGame();
			return;
		}
		
		// Draw expected note at this time
		var note = this.expectedNotes[this.currentNote];
		var noteObject = this.$.notes.createComponent(
			{
				kind: "LLMusic.Note",
				clef: this.$.clef.getNote(),
				note: note.note,
				octave: note.octave,
				index: this.currentNote,
				notename: ""
			},
			{ owner: this }
		);
		this.noteObjects.push(noteObject);
		noteObject.render();
	},
	
	computeScore: function() {
		// Compute score
		var len = this.expectedNotes.length;
		var score = 0;
		for (var i = 0 ; i < len ; i++) {
			var expected = Util.noteName(this.expectedNotes[i].note);
			var input = this.inputNotes[i];
			var noteObject = this.noteObjects[i];
			noteObject.setNotename(expected);
			if (expected == input) {
				noteObject.setColor(2);
				score++;
			} else if (input == -1) {
				noteObject.setColor(1);
			} else {
				noteObject.setColor(0);
			}
		}
		
		// Display
		this.$.score.setContent(score+"/"+len);
		this.$.score.addRemoveClass("score-bad", false);
		this.$.score.addRemoveClass("score-average", false);
		this.$.score.addRemoveClass("score-good", false);
		var average = Math.floor(len/2);
		if (score == len)
			this.$.score.addRemoveClass("score-good", true);
		else if (score >= average)
			this.$.score.addRemoveClass("score-average", true);
		else
			this.$.score.addRemoveClass("score-bad", true);
		this.$.score.setShowing(true);
	},
	
	// Event handling
	clefChanged: function(inSender, inEvent) {
		this.$.clef.setNote(inSender.getValue() ? 3 : 4);
	},
	
	inputChanged: function(inSender, inEvent) {
		if (!inSender.getValue()) {
			this.$.keyboard.setShowing(true);
			this.$.microphone.setShowing(false);
		} else {
			this.$.keyboard.setShowing(false);
			this.$.microphone.setShowing(true);		
		}
	},
	
	noteClicked: function(inSender, inEvent) {
		if (this.started) {
			var note = inSender.getContent();
			this.inputNotes[this.currentNote] = note;
			this.noteObjects[this.currentNote].setNotename(note+"?");
		}
	},
	
	tempoChanged: function(inSender, inEvent) {
		if (this.started) {
			inSender.setValue(this.tempo);
		} else {
			this.tempo = inSender.getValue();
		}
	},
	
	playstopClicked: function(inSender, inEvent) {
		this.started = !this.started;
		if (this.started) {
			this.startGame();
		} else {
			this.stopGame();
		}
	}
});
