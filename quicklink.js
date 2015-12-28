Router.configure({
  layoutTemplate: 'main'
})

Router.route('/',{
  template: 'home'
});

Router.route('/list/:_id',{
  template: 'listPage',
  data: function(){
    var currentList = this.params._id;
    return Lists.findOne({_id: currentList});
  }
})

Lists = new Mongo.Collection('lists');
Links =  new Mongo.Collection('links');

if (Meteor.isClient) {
  // counter starts at 0
  Template.home.onCreated(function(){
    currDate = {
      name: "",
      open: true,
      createdAt: new Date()
    };
    Lists.insert(currDate,function(err,result){
      if (err) return;
      var listID = result
      console.log(result);
      Router.go('/list/'+result);
    });
  });
  Template.openLinks.helpers({
    'checked': function(){
      var currentList = this._id;
      if (Session.get(currentList) == true){
        var linksList = Links.find({listID: currentList});
        linksList.forEach(function(linkVals){
          window.open(linkVals.linkurl,linkVals.linkurl);
        });
        return 'checked';
      }
      if (Session.get(currentList) == null){
        Session.setPersistent(currentList,true);
      }
    }
  });
  Template.addListName.helpers({
    'listName': function(){
      var currentList = this._id;
      var thisList = Lists.findOne(currentList, {fields: {name: 1}});
      return thisList.name;
    }
  });
  Template.links.helpers({
    'linklist': function (){
      var currentList = this._id;
      return Links.find({listID: currentList}, {sort: {createdAt: -1}});
    }
  });
  Template.linkCounter.helpers({
    'totalLinks': function(){
      var currentList = this._id;
      return Links.find({listID: currentList}).count();
    }
  });
  Template.openLinks.events({
    'change [name=openLinks]': function(){
      var currentList = this._id;
      var checkboxVal = Session.get(currentList);
      Session.setPersistent(currentList,!checkboxVal);
    }
  });
  Template.addListName.events({
    'keyup [name=listName]': function(event){
      if(event.which == 13 || event.which == 27){
        $(event.target).blur();
      }
      else{
        var currentList = this._id;
        var newListName = $(event.target).val();
        Lists.update({
          _id: currentList
        },
        {
          $set: {
            name: newListName
          }
        });
        console.log("List "+currentList+"'s name changed to '"+newListName+"'");
      }
    },
    'submit form': function(event){
      event.preventDefault();
    }
  });
  Template.addLink.events({
    'submit form': function(event){
      event.preventDefault();
      var currentList = this._id;
      if (Links.find({listID: currentList}).count() >= 10){
        alert("You cannot add more than 10 links to a list.");
      }
      else{
        var linkURL = $('[name="linkURL"]').val();
        Links.insert({
          linkurl: linkURL,
          createdAt: new Date(),
          listID: currentList
        });
        $('[name="linkURL"]').val('');
        console.log("New link '"+linkURL+"' added");
      }
    }
  });
  Template.linkItem.events({
    'click .delete-link': function(event){
      event.preventDefault();
      var linkID = this._id;
      Links.remove({ _id: linkID });
    }
  });
  Template.linkButton.events({
    'click [name=linkOpener]': function(){
      var currentList = this._id;
      var linksList = Links.find({listID: currentList});
      linksList.forEach( function(linkVals){
        window.open(linkVals.linkurl,linkVals.linkurl);
      });
    }
  })
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
