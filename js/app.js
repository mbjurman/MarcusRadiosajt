/**************************
* Application
**************************/
var App = Em.Application.create({
	rootContainer: null,
	player: null,
	ready: function() {
		App.rootContainer.appendTo("#channel-list-area");
		App.rootContainer.set('currentView', App.ChannelListView.create());
		App.player = document.getElementById("audio-player");
	}
});

App.rootContainer = Ember.ContainerView.create({
	childViews: []
});

/**************************
* Models
**************************/
App.Channel = Em.Object.extend({
    name: null,
    imageurl: null,
    category: null,
    url: null
});


/**************************
* Views
**************************/
App.ChannelListView = Ember.View.extend({
	templateName: 'channel-list',	
	content: null
})

App.ChannelView = Ember.View.extend({
	templateName: 'channel-list-item',	
	content: null,
	show: function(event, view){
		var url = this.content.url;

		App.player.src = url;
	}
})


/**************************
* Controllers
**************************/
App.channelsController = Em.ArrayController.create({
    content: [],
    loadChannels: function() {
        var me = this;
		var url = 'http://sverigesradio.se/api/v2/channels?pagination=false&format=json&callback=?';
		$.getJSON(url,function(data){
			me.set('content', []);
			$(data.channels).each(function(index,value) {
				var t = App.Channel.create({
					name: value.name,
					imageurl: value.image,
					category: value.channeltype,
					url: value.liveaudio.url
				});
				if (!Ember.empty(t.imageurl) && t.category !== "Lokal kanal" && t.category !== "Extrakanaler")
				{
					me.pushObject(t);
				}
			})
		});
    }
});

App.channelsController.loadChannels();
