// Note component
enyo.kind({
	name: "LLMusic.Note",
	kind: enyo.Control,
	classes: "note",
	published: {
		note: 0,
		clef: 4,
		octave: 4,
		index: -1
	},
	components: [
		{ name: "noteimage", kind: "Image", src: "images/note.svg", classes: "note-image" },
		{ name: "noteledger", kind: "Image", src: "images/ledger_line.svg", classes: "note-ledger", showing: false },
		{ name: "notename", classes: "note-name", content: "" }
	],
	
	// Constructor
	create: function() {
		this.inherited(arguments);
		this.noteChanged();
	},
	
	// Property changed
	indexChanged: function() {
		if (this.index != -1) {
			var posx = 120+(this.index*60);
			this.$.noteimage.applyStyle("left", posx+"px");
			this.$.noteledger.applyStyle("left", (posx-13)+"px");
			this.$.notename.applyStyle("left", posx+"px");
		}
	},
	
	noteChanged: function() {
		this.$.notename.setContent(this.noteName());
		this.indexChanged();
		this.computePosition();
	},
	
	// Utility methods
	noteName: function() {
		return Util.noteName(this.note);
	},
	
	clefName: function() {
		return Util.noteName(this.clef);
	},

	computePosition: function() {
		var y;
		if (this.clef == 4) {
			if (this.octave == 4) {
				y = this.note;
			} else if (this.octave == 5) {
				y = 7+this.note;		
			}
		} else if (this.clef == 3) {
			if (this.octave == 2) {
				y = this.note-2;
			} else if (this.octave == 3) {
				y = this.note+5;		
			}		
		}
		var posy = 148-(y*12);
		this.$.noteimage.applyStyle("top", posy+"px");
		this.$.noteledger.applyStyle("top", (posy+11)+"px");	
		this.$.noteledger.setShowing((y == 0 || y == 12));
	}
});