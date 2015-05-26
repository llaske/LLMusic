
// Main app class
enyo.kind({
	name: "LLMusic.App",
	kind: enyo.Control,
	components: [
		{name: "staff", classes: "staff", components: [
			//{name: "clef", kind: "Image", classes: "clef-image", src: "images/G_clef.svg"},
			{name: "clef", kind: "Image", classes: "clef-image", src: "images/F_clef.svg"},
			{name: "notes", components: [
			]}
		]}
	],
	
	// Constructor
	create: function() {
		this.inherited(arguments);
		this.draw();
	},

	draw: function() {
		// Remove notes
		var notes = [];
		enyo.forEach(this.$.notes.getControls(), function(note) { notes.push(note); });
		for (var i = 0 ; i < notes.length ; i++) { notes[i].destroy();	}
		
		// Display notes
		var gamme = ["do", "ré", "mi", "fa", "sol", "la", "si"];
		//var clef = "sol";
		//var index = 0;
		//var octave = 4;
		var clef = "fa";
		var index = 2;
		var octave = 2;
		for(var i = 0 ; i < 12 ; i++ ) {
			if (index == gamme.length) {
				octave++;
				index = 0;
			}
			this.$.notes.createComponent(
				{
					kind: "LLMusic.Note",
					clef: clef,
					note: gamme[index++],
					octave: octave,
					x: i
				},
				{ owner: this }
			).render();
		}	
	}
});
