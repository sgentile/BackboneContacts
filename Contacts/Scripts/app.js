/// <reference path="jquery-1.6.4-vsdoc.js" />
/// <reference path="jquery.tmpl.min.js" />
/// <reference path="underscore.js" />
/// <reference path="backbone.js" />
/// <reference path="backbone-localstorage.js" />
$(function () {
    Contact = Backbone.Model.extend({
        defaults: {
            id: null,
            firstname: "",
            lastname: ""
        },
        url: "contact/Contacts"
    });

    Contacts = Backbone.Collection.extend({
        model: Contact,
        url: "contact/Contacts"

        //localStorage: new Store("contacts")
    });

    contacts = new Contacts();

    DefaultView = Backbone.View.extend({
        el: "#app_container",
        initialize: function () {
            this.template = $("#add_contact_template");
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
            var model = new Contact({ firstname: $("#firstname").val(), lastname: $("#lastname").val() });
            contacts.create(model);
            this.$("firstname").val("");
            this.$("lastname").val("");
        }
    });

    EditContactView = Backbone.View.extend({
        el: "#app_container",
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
            return this;
        },
        save: function () {
            var firstName = $("#editfirstname").val();
            var lastName = $("#editlastname").val();
            this.model.set({ firstname: firstName, lastname: lastName });
            this.model.save();
            defaultView.render();
        },
        cancel: function () {
            defaultView.render();
            return false;
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
            "click span.remove-contact": "remove",
            "dblclick span.contact": "edit"
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
        },
        edit: function () {
            editContactView = new EditContactView({ model: this.model });
            editContactView.render();
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
            defaultView = new DefaultView();
            contactListView = new ContactListView({ collection: contacts });
        },
        routes: {
            "*actions": "defaultRoute" // matches http://example.com/#anything-here

        },
        defaultRoute: function (actions) {
            switch (actions) {
                default:
                    defaultView.render();
            }
        }
    });


    // Initiate the router
    var app = new AppRouter();
    // Start Backbone history a neccesary step for bookmarkable URL's
    Backbone.history.start();

});