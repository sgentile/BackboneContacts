/// <reference path="backbone.js" />
/// <reference path="backbone.marionette.js" />

/******  APP ******/
Backbone.View.prototype.render = function() {
	var html = $(this.template).tmpl();
	$(this.el).html(html);
};

ViewSwitcherApp = new Backbone.Marionette.Application();

ViewSwitcherApp.addRegions({
	//navigationRegion: "#navigation",
	mainRegion: "#main"
});

ViewSwitcherApp.bind("initialize:after", function () {
	if (Backbone.history) {
		Backbone.history.start();
	}
});

/******  ROUTER ******/
ViewSwitcherApp.Router = Backbone.Router.extend({
	routes: {
		"": "viewone",
		"viewone": "viewone",
		"viewtwo": "viewtwo"
	},
	viewone: function () {
		ViewSwitcherApp.ViewOne.show();
	},
	viewtwo: function () {
		ViewSwitcherApp.ViewTwo.show();
	}
});

ViewSwitcherApp.showRoute = function (route) {
	ViewSwitcherApp.router.navigate(route, false);
};

ViewSwitcherApp.addInitializer(function () {
	ViewSwitcherApp.router = new ViewSwitcherApp.Router();
});

/******  VIEWONE ******/
ViewSwitcherApp.ViewOne = (function (ViewSwitcherApp, Backbone) {
	var ViewOne = {};

	ViewOne.SimpleView = Backbone.View.extend({
		template: "#viewone-template"
	});

	ViewOne.show = function () {
		ViewSwitcherApp.mainRegion.show(new ViewOne.SimpleView());
		ViewSwitcherApp.showRoute("viewone");
	};
	return ViewOne;
})(ViewSwitcherApp, Backbone);

/******  VIEWTWO ******/
ViewSwitcherApp.ViewTwo = (function (ViewSwitcherApp, Backbone) {
	var ViewTwo = {};
	ViewTwo.SimpleView = Backbone.View.extend({
		template: "#viewtwo-template"
	});
	
	ViewTwo.show = function () {
		ViewSwitcherApp.mainRegion.show(new ViewTwo.SimpleView());
		ViewSwitcherApp.showRoute("viewtwo");
	};
	return ViewTwo;
})(ViewSwitcherApp, Backbone);


/******  START THE APP! ******/

$(function() {
	ViewSwitcherApp.start();
}); 