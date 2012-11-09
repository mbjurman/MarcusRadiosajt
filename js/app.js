/**************************
* Application
**************************/
App = Em.Application.create();


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
App.channelView = Ember.View.extend({
	
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
			$(data).each(function(index,value){
			    $(value.channels).each(function(index2,value2){
					var t = App.Channel.create({
						name: value2.name,
						imageurl: value2.image,
						category: value2.channeltype,
						url: value2.liveaudio.url
					});
					if (!Ember.empty(t.imageurl) && t.category !== "Lokal kanal" && t.category !== "Extrakanaler")
					{
						me.pushObject(t);
					}
				})
			})
		});
    }
});

App.streamingUrlsController = Em.ArrayController.create({
    content: [],
    loadUrls: function(channel) {
        var me = this;
        me.clear();
        $(channel.streamingurls).each(function(index, value) {
            me.pushObject(value);
        })
    }
});

App.playerMetadata = Em.Object.create({
	title: "",
	imageurl: null
})

App.channelsController.loadChannels();
App.player = document.getElementById("audio-player");

