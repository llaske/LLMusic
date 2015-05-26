
// Main app class
enyo.kind({
	name: "LLMusic.App",
	kind: enyo.Control,
	components: [
		{name: "staff", classes: "staff", components: [
			{name: "clef", kind: "LLMusic.Clef"},
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
		var clef = 4;
		var index = 0;
		var octave = 4;
		//var clef = 3;
		//var index = 2;
		//var octave = 2;
		this.$.clef.setNote(clef);
		for(var i = 0 ; i < 12 ; i++ ) {
			if (index == 7) {
				octave++;
				index = 0;
			}
			this.$.notes.createComponent(
				{
					kind: "LLMusic.Note",
					clef: clef,
					note: index++,
					octave: octave,
					index: i
				},
				{ owner: this }
			).render();
		}	
	}
});
