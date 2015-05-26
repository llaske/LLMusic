// Note component
enyo.kind({
	name: "LLMusic.Note",
	kind: enyo.Control,
	classes: "note",
	published: {
		note: "do",
		clef: "sol",
		octave: 4,
		x: -1,
		y: -1
	},
	components: [
		{ name: "noteimage", kind: "Image", src: "images/note.svg", classes: "note-image" },
		{ name: "noteledger", kind: "Image", src: "images/ledger_line.svg", classes: "note-ledger", showing: false },
		{ name: "notename", classes: "note-name", content: "" }
	],
	
	// Constructor
	create: function() {
		this.inherited(arguments);
		this.xChanged();
		this.yChanged();
		this.nameChanged();
		this.$.noteledger.setShowing((this.y == 0 || this.y == 12));
	},
	
	// Property changed
	xChanged: function() {
		if (this.x != -1) {
			var posx = 120+(this.x*60);
			this.$.noteimage.applyStyle("left", posx+"px");
			this.$.noteledger.applyStyle("left", (posx-13)+"px");
			this.$.notename.applyStyle("left", posx+"px");
		}
	},
	
	yChanged: function() {
		if (this.y != -1) {
			var posy = 148-(this.y*12);
			this.$.noteimage.applyStyle("top", posy+"px");
			this.$.noteledger.applyStyle("top", (posy+11)+"px");
		}
	},
	
	nameChanged: function() {
		this.$.notename.setContent(this.note);
		this.convertNoteToY();
		this.yChanged();
	},
	
	// Convert note to position
	convertNoteToY: function() {
		if (this.clef == "sol") {
			if (this.octave == 4) {
				if (this.note == "do") this.y = 0;
				else if (this.note == "ré") this.y = 1;
				else if (this.note == "mi") this.y = 2;
				else if (this.note == "fa") this.y = 3;
				else if (this.note == "sol") this.y = 4;
				else if (this.note == "la") this.y = 5;
				else if (this.note == "si") this.y = 6;
			} else if (this.octave == 5) {
				if (this.note == "do") this.y = 7;
				else if (this.note == "ré") this.y = 8;
				else if (this.note == "mi") this.y = 9;
				else if (this.note == "fa") this.y = 10;
				else if (this.note == "sol") this.y = 11;
				else if (this.note == "la") this.y = 12;		
			}
		} else if (this.clef == "fa") {
			if (this.octave == 2) {
				if (this.note == "mi") this.y = 0;
				else if (this.note == "fa") this.y = 1;
				else if (this.note == "sol") this.y = 2;
				else if (this.note == "la") this.y = 3;
				else if (this.note == "si") this.y = 4;
			} else if (this.octave == 3) {
				if (this.note == "do") this.y = 5;
				else if (this.note == "ré") this.y = 6;
				else if (this.note == "mi") this.y = 7;
				else if (this.note == "fa") this.y = 8;
				else if (this.note == "sol") this.y = 9;
				else if (this.note == "la") this.y = 10;		
				else if (this.note == "si") this.y = 11;		
			}		
		}
	}
});