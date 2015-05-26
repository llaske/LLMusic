define(function (require) {

    // Manipulate the DOM only when it is ready.
    require(['domReady!'], function (doc) {
		// Launch main screen
		app = new LLMusic.App();
		app.renderInto(document.getElementById("body"));
    });

});
