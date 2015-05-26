// Clef component
enyo.kind({
	name: "LLMusic.Clef",
	kind: enyo.Control,
	classes: "clef",
	published: {
		note: 4
	},
	components: [
		{name: "clefimage", kind: "Image", classes: "clef-image", src: "images/G_clef.svg"}
	],
	
	// Constructor
	create: function() {
		this.inherited(arguments);
		this.noteChanged();
	},
	
	// Property changed
	noteChanged: function() {
		this.$.clefimage.setSrc((this.note == 3 ? "images/F_clef.svg" : "images/G_clef.svg"));
	}
});