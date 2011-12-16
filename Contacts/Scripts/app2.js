/// <reference path="backbone.js" />
/// <reference path="backbone.marionette.js" />

/******  APP ******/

var ViewSwitcherApp = {};

Backbone.View.prototype.render = function() {
	var html = $(this.template).tmpl();
	$(this.el).html(html);
};

ViewSwitcherApp = new Backbone.Marionette.Application();

ViewSwitcherApp.addRegions({
	//navigationRegion: "#navigation",
	contactsRegion: "#contactsRegion",
	mainRegion: "#mainRegion"
});

ViewSwitcherApp.bind("initialize:after", function () {
	if (Backbone.history) {
		Backbone.history.start();
	}
});

/******  ROUTER ******/
ViewSwitcherApp.Router = Backbone.Router.extend({
	routes: {
		"": "defaultRoute",
		"viewone": "viewone",
		"viewtwo": "viewtwo"
	},
	defaultRoute: function () {
		//show ViewOne as well:
		//ViewSwitcherApp.ViewOne.show();
		ViewSwitcherApp.Contacts.show();
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

/******  CONTACTS ******/
ViewSwitcherApp.Contacts = (function (ViewSwitcherApp, Backbone) {
	var Contacts = {};
	Contacts.ContactModel = Backbone.Model.extend({
		defaults: {
			id: null,
			firstname: "",
			lastname: ""
		},
		url: function (type) {
			if (type == "DELETE")
			    return "Contact/delete/" + this.get('id');
			return this.isNew() ? "Contact/create" : "Contact/update";
		}
	});
	Contacts.ContactModels = Backbone.Collection.extend({
		model: Contacts.ContactModel,
		url: "Contact/list"
		//url: "http://localhost/Contacts/contact/list"
	});

	Contacts.contacts = new Contacts.ContactModels();

	Contacts.ContactView = Backbone.View.extend({
		tagName: 'li',
		model: Contacts.ContactModel,
		initialize: function () {
			this.template = $("#contact-template");
			_.bindAll(this, "render");
		},
		events: {
			"click span.remove-contact": "remove"
		},
		render: function () {
			//render the jQuery template
			var content = this.template.tmpl(this.model.toJSON());
			//take the rendered HTML and pop it into the DOM
			$(this.el).html(content);

			return this;
		},
		remove: function () {
			this.model.destroy();
		}
	});

	Contacts.ContactsListView = Backbone.View.extend({
		//el: "#contacts-list",
		//model: Contact,
		initialize: function () {
			_.bindAll(this, "render");
			this.collection.bind("change", this.render);
			this.collection.bind("add", this.render);
			this.collection.bind("fetch", this.render);
			this.collection.bind('remove', this.render);

			Contacts.contacts.fetch({ add: true });
		},
		render: function () {
			//clear out the existing list to avoid "append" duplication
			$(this.el).empty();
			//use an array here rather than firehosing the DOM
			//perf is a bit better
			var els = [];
			//loop the collection...
			this.collection.models.forEach(function (contact) {
				//rendering a view for each model in the collection
				var view = new Contacts.ContactView({ model: contact });
				//adding it to our array
				els.push(view.render().el);
			});
			//push that array into this View's "el"
			$(this.el).append(els);
			return this;
		}
	});

	Contacts.AddContactView = Backbone.View.extend({
		initialize: function () {
			this.template = $("#add-contact-template");
		},
		render: function () {
			var content = this.template.tmpl();
			$(this.el).html(content);

			return this;
		},
		events: {
			//"click input[type=button]": "addContact"
			"click #addContact_button": "addContact"
		},
		addContact: function (event) {
			var model = new Contacts.ContactModel({ firstname: $("#firstname").val(), lastname: $("#lastname").val() });
			Contacts.contacts.create(model);
			//this.$("firstname").val("");
			//this.$("lastname").val("");
		}
	});
	Contacts.show = function () {
		ViewSwitcherApp.mainRegion.show(new Contacts.AddContactView());
		ViewSwitcherApp.contactsRegion.show(new Contacts.ContactsListView({ collection: Contacts.contacts }));
		ViewSwitcherApp.showRoute("");
	};
	return Contacts;
})(ViewSwitcherApp, Backbone);

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