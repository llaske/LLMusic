
// Main app class
enyo.kind({
	name: "LLMusic.App",
	kind: enyo.Control,
	components: [
		{classes: "centerer", components: [
			{name: "staff", classes: "staff", components: [
				{name: "clef", kind: "LLMusic.Clef"},
				{name: "notes", components: [
				]}
			]},
			{kind: "onyx.Button", name:"playstop", classes: "playstop-button", ontap:"playstopClicked", components: [
				{name: "playstopimage", kind: "Image", src: "images/play.svg", classes: "playstop-image"}
			]},
			{kind: "onyx.Button", name:"book", classes: "book-button", ontap:"bookClicked", components: [
				{name: "bookimage", kind: "Image", src: "images/book.svg", classes: "book-image"},
				{name: "bookindex", content: "1", classes: "book-index"}
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
				{name: "talk", content: "", classes: "talk-text"},
				{kind: "Image", src: "images/microphone_gray.svg", classes: "talk-image"}
			]}
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
		this.recognition = null;
		this.currentNote = -1;
		this.booked = false;
		this.bookIndex = 0;
	},

	// Processing
	startGame: function() {
		// Change interface
		this.$.playstopimage.setSrc("images/stop.svg");
		this.$.clefswitch.setDisabled(true);
		this.$.inputswitch.setDisabled(true);
		this.$.score.setShowing(false);
		this.$.book.setDisabled(true);
			
		// Generate expected notes
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
		this.clearNotes();
		this.$.talk.setContent("");
		
		// Launch recognition timer
		this.currentNote = -1;
		var delay = (4000-this.$.temposwitch.getValue()*22);
		if (this.recognition != null) {
			this.recognitionValue = '';
			this.recognition.start();
		}		
        this.timer = window.setInterval(enyo.bind(this, "drawNote"), delay);		
	},
	
	stopGame: function() {
		// Change interface
		this.$.playstopimage.setSrc("images/play.svg");
		this.$.clefswitch.setDisabled(false);
		this.$.inputswitch.setDisabled(false);
		this.$.book.setDisabled(false);
		
		// Stop timer
		if (this.timer != null) {
			window.clearInterval(this.timer);
			this.timer == null;		
		}
		
		this.started = false;
		if (this.recognition != null) {
			// Stop recognition
			this.recognition.stop();
		} else {
			// Compute score
			this.computeScore();
		}
	},

	clearNotes: function() {
		var notes = [];
		enyo.forEach(this.$.notes.getControls(), function(note) { notes.push(note); });
		for (var i = 0 ; i < notes.length ; i++) { notes[i].destroy(); }	
	},
	
	drawNote: function() {	
		// Pass last note in play, stop game
		if (this.started) {
			this.currentNote = this.currentNote + 1;
			if (this.currentNote == this.expectedNotes.length) {
				this.stopGame();
				if (this.recognition != null)
					this.recognition.stop();
				return;
			}
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
				notename: this.started ? "" : null
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
			if (!noteObject) continue;
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
		this.clearNotes();
		this.$.clef.setNote(inSender.getValue() ? 3 : 4);
		if (this.booked) {
			this.updateBookIndex();
			this.bookClicked();
		}
	},
	
	inputChanged: function(inSender, inEvent) {
		if (!inSender.getValue()) {
			// Show keyboard
			this.recognition = null;
			this.$.keyboard.setShowing(true);
			this.$.microphone.setShowing(false);
		} else {
			// Launch recognition system
			this.recognition = this.createComponent({
				kind: "Recognition",
				lang: "fr-FR",
				onResult: "recognitionResult"
			}, { owner: this });
			if (!this.recognition.isSupported()) {
				// Not supported here
				this.recognition = null;
				inSender.setValue(false);
				return;
			}
			this.$.keyboard.setShowing(false);
			this.$.microphone.setShowing(true);
			if (this.$.temposwitch.getValue() < 50)
				this.$.temposwitch.setValue(50);
		}
	},
	
	noteClicked: function(inSender, inEvent) {
		if (this.started && this.currentNote != -1) {
			// Display note value
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
			this.booked = false;
			this.startGame();
		} else {
			this.stopGame();
		}
	},

	bookClicked: function() {
		this.booked = true;
		this.clearNotes();
		this.$.score.setShowing(false);
		var gammeLength = Util.getGamme().length;
		var clefNote = this.$.clef.getNote();
		var startNote = (clefNote == 4 ? 0 : 2);
		var startOctave = (clefNote == 4 ? 4 : 2);
		this.expectedNotes = [];
		var startIndex = this.bookIndex*8;
		var endIndex = (startIndex == 0 ? 8 : 13);
		for(var i = startIndex ; i < endIndex ; i++) {
			var note = (startNote + i) % gammeLength;
			var octave = (startOctave + Math.floor((startNote + i) / gammeLength));
			this.expectedNotes.push({note: note, octave: octave});
			this.currentNote = i - startIndex;
			this.drawNote();
		}
		this.updateBookIndex();
	},
	
	updateBookIndex: function() {
		this.bookIndex = (this.bookIndex + 1) % 2;
		this.$.bookindex.setContent(this.bookIndex+1);
	},
	
	recognitionResult: function(s, e) {
		var interimRecognition = '';
		for (var i = e.resultIndex; i < e.results.length; ++i) {
			if (e.results[i].isFinal) {
				this.recognitionValue += e.results[i][0].transcript;
			} else {
				interimRecognition += e.results[i][0].transcript;
			}
		}
		this.$.talk.setContent(interimRecognition);
		if (e.results[e.results.length-1].isFinal) {
			this.$.talk.setContent(this.recognitionValue);
			this.recognitionInput();
			this.computeScore();
		}
	},
	
	recognitionInput: function() {
		var answers = this.recognitionValue.split(' ');
		for (var i = 0 ; i < answers.length ; i++) {
			var panswer = answers[i].toLowerCase();
			if (panswer == 'là') panswer = 'la';
			else if (panswer == 'ray') panswer = 'ré';
			else if (panswer == 'mie') panswer = 'mi';
			this.inputNotes[i] = panswer;
			var noteObject = this.noteObjects[i];
			if (!noteObject) continue;
			noteObject.setNotename(panswer+"?");
		}
	}
});
