/// <reference path="jquery-1.6.4-vsdoc.js" />
/// <reference path="jquery.tmpl.min.js" />
/// <reference path="underscore.js" />
/// <reference path="backbone.js" />
/// <reference path="backbone-localstorage.js" />
/// <reference path="backbone-mvc-sync.js" />

var AppView = function () {
    this.currentView = null;    
};
AppView.prototype.showView = function (view) {
    if (this.currentView) {
        this.currentView.close();
    }

    this.currentView = view;
    this.currentView.render();
    $("#app_container").html(this.currentView.el);
};

Backbone.View.prototype.close = function() {
    this.remove();
    this.unbind();    
    if (this.onClose) {
        this.onClose();
    }
};



$(function () {

    Contact = ModelBase.extend({
        defaults: {
            firstname: "",
            lastname: ""
        },
        urlRoot: "contact/"
    });

    Contacts = Backbone.Collection.extend({
        model: Contact,
        url: "contact/list"
        //,localStorage: new Store("contacts")     uncomment to use the sessionStorage option
    });
    contacts = new Contacts();

    DefaultView = Backbone.View.extend({
        //el: "#app_container",
        initialize: function () {
            this.template = $("#add_contact_template");
        },
        render: function () {
            var content = this.template.tmpl();
            $(this.el).html(content);
            //Backbone.ModelBinding.bind(this);
            return this;
        },
        events: {
            //"click input[type=button]": "addContact"
            "click #addContact_button": "addContact"
        },
        addContact: function (event) {
            var model = new Contact({ firstname: $("#firstname").val(), lastname: $("#lastname").val() });
            contacts.create(model);
            //this.$("firstname").val("");
            //this.$("lastname").val("");
        },
        onClose: function () {
            //Backbone.ModelBinding.unbind(this);
        }
    });

    EditContactView = Backbone.View.extend({
        //el: "#app_container",
        model: Contact,
        initialize: function () {
            this.template = $("#edit_template");
        },
        events: {
            "click #saveContact_button": "save",
            "click #cancelContact_button": "cancel"
        },
        render: function () {
            //render the jQuery template
            var content = this.template.tmpl(this.model.toJSON());
            //take the rendered HTML and pop it into the DOM
            $(this.el).html(content);
            Backbone.ModelBinding.bind(this);
            return this;
        },
        save: function () {

            console.log(JSON.stringify(this.model));
            alert('check log');
            //            var firstName = $("#editfirstname").val();
            //            var lastName = $("#editlastname").val();
            //            this.model.set({ firstname: firstName, lastname: lastName });
            this.model.save();
            //            app.navigate("", true);
        },
        cancel: function () {
            app.navigate("", true);
        },
        onClose: function () {
            Backbone.ModelBinding.unbind(this);
        }
    });

    ContactView = Backbone.View.extend({
        tagName: 'li',
        model: Contact,
        initialize: function () {
            this.template = $("#contact_template");
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
        remove: function (e) {
            console.log(this.model.get('id'));
            this.model.destroy();
        }
    });

    ContactListView = Backbone.View.extend({
        el: "#contacts-list",
        model: Contact,
        initialize: function () {
            _.bindAll(this, "render");
            this.collection.bind("change", this.render);
            this.collection.bind("add", this.render);
            this.collection.bind("fetch", this.render);
            this.collection.bind('remove', this.render);

            contacts.fetch({ add: true });
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
                var view = new ContactView({ model: contact });
                //adding it to our array
                els.push(view.render().el);
            });
            //push that array into this View's "el"
            $(this.el).append(els);
            return this;
        }
    });



    AppRouter = Backbone.Router.extend({
        initialize: function () {
            appView = new AppView();
            contactListView = new ContactListView({ collection: contacts });
            defaultView = new DefaultView();
            editContactView = new EditContactView();
        },
        showAdd: function () {
            appView.showView(defaultView);
        },
        showEdit: function (id) {
            var contact = contacts.get(id);
            editContactView.model = contact;
            appView.showView(editContactView);
        },
        routes: {
            "": "defaultRoute", // matches http://example.com/#anything-here
            "contact/edit/:id": "editContact"
        },
        defaultRoute: function () {
            this.showAdd();
        },
        editContact: function (id) {
            this.showEdit(id);
        }
    });



    // Initiate the router
    var app = new AppRouter();
    // Start Backbone history a neccesary step for bookmarkable URL's
    Backbone.history.start();

});