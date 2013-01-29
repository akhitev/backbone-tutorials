/**
 * Created with JetBrains RubyMine.
 * User: alex
 * Date: 1/29/13
 * Time: 1:41 PM
 * To change this template use File | Settings | File Templates.
 */
(function ($) {

    var Book = Backbone.Model.extend({
        defaults:{
            coverImage:"img/placeholder.png",
            title:"Some title",
            author:"John Doe",
            releaseDate:"2012",
            keywords:"JavaScript Programming"
        }
    });

    var BookView = Backbone.View.extend({
        tagName:"div",
        className:"bookContainer",
        template:$("#bookTemplate").html(),

        events: {
          "click .delete" : "deleteBook"
        },

        defaults: {
            coverImage:"img/placeholder.png",
            title:"No title",
            author:"Unknown",
            releaseDate:"Unknown",
            keywords:"None"},

        deleteBook:function () {
            //Delete model
            this.model.destroy();

            //Delete view
            this.remove();
        },


        render:function () {
            var tmpl = _.template(this.template); //tmpl is a function that takes a JSON object and returns html

            this.$el.html(tmpl(this.model.toJSON())); //this.el is what we defined in tagName. use $el to get access to jQuery html() function
            return this;
        }
    });

    var book = new Book({
        title:"Some title",
        author:"John Doe",
        releaseDate:"2012",
        keywords:"JavaScript Programming"
    });



    //  collection

    var Library = Backbone.Collection.extend({
        model:Book
    });



    var books = [{title:"JS the good parts", author:"John Doe", releaseDate:"2012", keywords:"JavaScript Programming"},
        {title:"CS the better parts", author:"John Doe", releaseDate:"2012", keywords:"CoffeeScript Programming"},
        {title:"Scala for the impatient", author:"John Doe", releaseDate:"2012", keywords:"Scala Programming"},
        {title:"American Psyco", author:"Bret Easton Ellis", releaseDate:"2012", keywords:"Novel Splatter"},
        {title:"Eloquent JavaScript", author:"John Doe", releaseDate:"2012", keywords:"JavaScript Programming"}];


    var LibraryView = Backbone.View.extend({
        el:$("#books"),

        events: {
            "click #add": "addBook"
        },

        initialize:function(){
            this.collection = new Library(books);
            this.render();
            this.collection.on("add", this.renderBook, this);
            this.collection.on("remove", this.removeBook, this);
        },

        render:function(){
            var that = this;
            _.each(this.collection.models, function(item){
                that.renderBook(item);
            }, this);
        },

        renderBook:function(item){
            var bookView = new BookView({
                model:item
            });
            this.$el.append(bookView.render().el);
        },
        addBook:function(e){
            e.preventDefault()
            var formData = {};

            $("#addBook div").children("input").each(function(i, el){
                if ($(el).val() !== "") {
                    formData[el.id] = $(el).val();
                }
            });

            books.push(formData);

            this.collection.add(new Book(formData));
        },
        removeBook:function(removedBook){
            var removedBookData = removedBook.attributes;

            _.each(removedBookData, function(val, key){
                if(removedBookData[key] === removedBook.defaults[key]){
                    delete removedBookData[key];
                }
            });

            _.each(books, function(book){
                if(_.isEqual(book, removedBookData)){
                    books.splice(_.indexOf(books, book), 1);
                }
            });
        }
    });



var libraryView = new LibraryView()


})(jQuery);
