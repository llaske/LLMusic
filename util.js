// Utility functions


// Namespace
Util = {};

// Gamme handling
Util.gamme = ["do", "ré", "mi", "fa", "sol", "la", "si"];

Util.getGamme = function() {
	return Util.gamme;
};

Util.noteName = function(note) {
	if (note < 0 || note > Util.gamme.length) return null;
	return Util.gamme[note];
};
