Links =  new Mongo.Collection('links');

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.links.helpers({
    'linklist': function (){
      return Links.find({}, {sort: {createdAt: -1}});
    }
  });
  Template.linkCounter.helpers({
    'totalLinks': function(){
      return Links.find().count();
    }
  });
  Template.addLink.events({
    'submit form': function(event){
      event.preventDefault();
      var linkURL = $('[name="linkURL"]').val();
      Links.insert({
        linkurl: linkURL
        createdAt: new Date();
      });
      $('[name="linkURL"]').val('');
      console.log("New link '"+linkURL+"' added");
    }
  });
  Template.linkItem.events({
    'click .delete-link': function(event){
      event.preventDefault();
      var linkID = this._id;
      var confirm = window.confirm("Delete this task?");
      if(confirm){
        Links.remove({ _id: linkID });
      };
    'keyup [name="linkItem"]': function(event){
      if(event.which == 13 || event.which == 27){
        $(event.target).blur();
      }
      else {
        var linkID = this._id;
        var newURL = $(event.target).val();
        Links.update({
          _id: linkID
        },
        {
          $set: {
            linkurl = newURL
          }
        });
        console.log("Value of link "+linkID+" changed to '"+newURL+"'");
      }
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
