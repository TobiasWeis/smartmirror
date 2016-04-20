var videoplayer = {
    start:function(){
        big = false;

        var html = " <p id=\"controls\"> <img src=\"assets/tvicon.png\" onclick=\"javascript:videoplayer.toggle_size();\" id=\"resizeicon\" /><img src=\"assets/playpauseicon.png\" id=\"playpauseicon\" /><br />  <span id=\"position\">00:00</span> / <span id=\"duration\">loading...</span></p> <video id=\"videoplayer\" preload=\"metadata\" style=\"width:250px;\"><source src=\"tagesschau.mp4\" type=\"video/mp4\" /></video>";
        var videoTag = $("#videoplayer-widget");
        videoTag.html(html);


        video = document.getElementsByTagName('video')[0];
        togglePlay = document.getElementById('playpauseicon');
        position = document.getElementById('position');
        using = document.getElementById('using');
        ready = false;
        controls = document.getElementById('controls');
        fullscreen = null;

        videoplayer.addEvent(togglePlay, 'click', function () {
          if (ready) {
            // video.playbackRate = 0.5;
            if (video.paused) {
              if (video.ended) video.currentTime = 0;
              video.play();
              document.getElementById('playpauseicon').src = "assets/playpauseicon_active.png";
              this.value = "pause";
            } else {
              video.pause();
              document.getElementById('playpauseicon').src = "assets/playpauseicon.png";
              this.value = "play";
            }
          }
        });

        videoplayer.addEvent(video, 'timeupdate', function () {
          position.innerHTML = videoplayer.asTime(this.currentTime);
        });

        videoplayer.addEvent(video, 'ended', function () {
          togglePlay.value = "play";
        });


    if (video.readyState > 0) { // metadata is loaded already - fire the event handler manually
      videoplayer.loadedmetadata.call(video);
    } else {
      videoplayer.addEvent(video, 'loadedmetadata', videoplayer.loadedmetadata);
    }

    },



    addEvent: function(to, type, fn){
        if(document.addEventListener){
            to.addEventListener(type, fn, false);
        } else if(document.attachEvent){
            to.attachEvent('on'+type, fn);
        } else {
            to['on'+type] = fn;
        }  
    },

// this used to be canplay, but really it should have been loadedmetadata - sorry folks
    loadedmetadata: function() {
      video.muted = false;
      ready = true;
      document.querySelector('#duration').innerHTML = videoplayer.asTime(this.duration);
      //using.innerHTML = this.currentSrc;
      // note: .webkitSupportsFullscreen is false while the video is loading, so we bind in to the canplay event
      /*
      if (video.webkitSupportsFullscreen) {
        fullscreen = document.createElement('input');
        fullscreen.setAttribute('type', 'button');
        fullscreen.setAttribute('value', 'fullscreen');
        controls.insertBefore(fullscreen, controls.firstChild);
        videoplayer.addEvent(fullscreen, 'click', function () {
          video.webkitEnterFullScreen();
        });
      }*/
    },   

    toggle_play: function(){
        togglePlay.click();
    },

    toggle_size: function(){
        if(big == false){
            document.getElementById('resizeicon').src = "assets/tvicon_active.png";
            document.getElementById('videoplayer').style = "position:fixed;float:left;top:250px;left:650px;z-index:10;width:800px;min-height:500px;";
            big = true;
        }else{
            document.getElementById('resizeicon').src = "assets/tvicon.png";
            document.getElementById('videoplayer').style = "position:relative;width:250px;";
            big = false;
        }
    },


    asTime: function(t) {
        t = Math.round(t);
        var s = t % 60;
        var m = Math.floor(t / 60);
        return videoplayer.two(m) + ':' + videoplayer.two(s);
    },

    two: function(s) {
        s += "";
        if (s.length < 2) s = "0" + s;
        return s;
    },
}
