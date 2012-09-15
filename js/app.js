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
    streamingurls: []
});


/**************************
* Views
**************************/
App.channelView = Ember.View.extend({
	content: null,
	show: function(event, view){
		mp3streams = jQuery.grep(this.content.streamingurls, function(n, i){
			return (n.type === "mp3");
		});	

		App.player.jPlayer("setMedia", {
			mp3:mp3streams[0].url
		});
		App.player.jPlayer("play");
		App.playerMetadata.set('title', this.content.name);
		App.playerMetadata.set('imageurl', this.content.imageurl);
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
						imageurl: value2.socialimage,
						category: value2.category,
						streamingurls: value2.streamingurls
					});
					if (t.category !== "Lokala kanaler" && t.category !== "Extrakanaler")
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
App.player = $("#jquery_jplayer_1");
App.player.jPlayer({
	isPlaying: false,
	ready: function () {
		$(this).jPlayer("setMedia", {
			mp3:"http://www.jplayer.org/audio/mp3/TSP-01-Cro_magnon_man.mp3"
		});
	},
	pause: function () {
		this.set('isPlaying', false);
	},
	playing: function () {
		this.set('isPlaying', true);
	},	
	swfPath: "js",
	supplied: "mp3",
	wmode: "window"
});
