
      // function $(selector){
      //   return document.querySelector(selector);
      // }


      // var musicList = [];
      // var currentIndex = 0;
      // var clock;
      // var audio = new Audio();
      // audio.autoplay = true;

      // getMusicList(function(list){
      //   musicList = list;
      //   loadMusic(list[currentIndex]);
      //   generateList(list);
      // });

      // audio.ontimeupdate = function(){
      //   $('.musicbox .progress-now').style.width = (this.currentTime/this.duration)*100 + '%';
      // };

      // audio.onplay = function(){
      //   clock =setInterval(function(){
      //     var min = Math.floor(audio.currentTime/60);
      //     var sec = Math.floor(audio.currentTime%60) + '';
      //     sec = sec.length ===2? sec : '0' + sec;
      //     $('.musicbox .time').innerText = min + ':' +sec;
      //   }, 1000);
      // };

      // audio.onpause = function(){
      //   clearInterval(clock);
      // };

      // audio.onended = function(){
      //   concole.log('end');
      //   currentIndex = (++currentIndex)%musicList.length;
      //   loadMusic(musicList[currentIndex]);
      // };

      // $('.musicbox .play').onclick = function(){
      //   if(audio.paused){
      //     audio.play();
      //     this.querySelector('.iconfont').classList.remove('icon-play');
      //     this.querySelector('.iconfont').classList.add('icon-pause');
      //   }else {
      //     audio.pause();
      //     this.querySelector('.iconfont').classList.add('icon-play');
      //     this.querySelector('.iconfont').classList.remove('icon-pause');
      //   }
      // };

      // $('.musicbox .forward').onclick = function(){
      //   currentIndex = (++currentIndex)%musicList.length;
      //   loadMusic(musicList[currentIndex]);
      // };

      // $('.musicbox .back').onclick = function(){
      //   currentIndex = (musicList.length + --currentIndex)%musicList.length;
      //   loadMusic(musicList[currentIndex]);
      // };

      // $('.music .bar').onclik = function(e){
      //   console.log(e);
      //   var percent = e.offsetX / parseInt(getComputedStyle(this).width);
      //   console.log(percent);
      //   audio.currentTime = audio.duration * percent;
      // };

      // function getMusicList(callback){
      //   var xhr = new XMLHttpRequest();
      //   xhr.open('Get', '/music.json', true);
      //   xhr.onload = function(){
      //     if((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304){
      //       callback(JSON.parse(this.responseText));
      //     }else {
      //       console.log('获取数据失败');
      //     }
      //   };
      //   xhr.onerror = function(){
      //     console.log('网络异常');
      //   };
      //   xhr.send();
      // }

      // function loadMusic(musicObj){
      //   console.log('begin play', musicObj);
      //   $('.musicbox .title').innerText = musicObj.title;
      //   $('.musicbox .author').innerText = musicObj.author;
      //   $('.cover').style.backgroundImage = 'url(' + musciObj.img + ')';
      //   audio.src = musicObj.src;
      // }
     var musicList = [
        {
          src: 'http://cloud.hunger-valley.com/music/玫瑰.mp3',
          title: '玫瑰',
          author: '贰佰',
          img: 'https://upload-images.jianshu.io/upload_images/3624093-d9678a0d2a897390.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240'
        },
        {
          src: 'http://cloud.hunger-valley.com/music/ifyou.mp3',
          title: 'IF YOU',
          author: 'Big Bang',
          img: 'https://upload-images.jianshu.io/upload_images/3624093-84598b108b24d414.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240'
        }

      ];


      var cover = document.querySelector('.cover');
      var backBtn = document.querySelector('.musicbox .back');
      var playBtn = document.querySelector('.musicbox .play');
      var forwardBtn = document.querySelector('.musicbox .forward');
      var titleNode = document.querySelector('.musicbox .title');
      var authorNode = document.querySelector('.musicbox .author');
      var timeNode = document.querySelector('.musicbox .time');
      var progressBarNode = document.querySelector('.musicbox .progress .bar');
      var progressNowNode = document.querySelector('.musicbox .progress-now');
      var musicListContainer = document.querySelector('.musicbox .list');
      var timer;
      var musicList;

      var music = new Audio();
      music.autoplay = true;
      var musicIndex = 0;

      getMusic(function(list){
        musicList = list;
        setPlaylist(list);
        loadMusic(list[musicIndex]);
      });

      playBtn.onclick = function() {
        var icon = this.querySelector('.iconfont');
        if(icon.classList.contains('icon-play')) {
          music.play();
        }else {
          music.pause();
        }
        icon.classList.toggle('icon-play');
        icon.classList.toggle('icon-pause');
      };

      forwardBtn.onclick = loadNextMusic;
      backBtn.onclick = loadLastMusic;
      music.onended = loadNextMusic;
      music.shouldUpdate = true;

      music.onplaying = function() {
        timer = setInterval(function() {
          updateProgress();
        }, 1000);
        console.log('play');
      };

      music.onpause = function() {
        console.log('pause');
        clearInterval(timer);
      };

      music.ontimeupdate = updateProgress;

      progressBarNode.onclick = function(e) {
        var percent = e.offsetX / parseInt(getComputedStyle(this).width);
        music.currentTime = percent * music.duration;
        progressNowNode.style.width = percent *100 + "%";
      };

      musicListContainer.onclick = function(e) {
        if(e.target.tagName.toLowerCase() === 'li'){
          for(var i = 0; i < this.children.length; i++){
            if(this.children[i] === e.target){
              musicIndex = i;
            }
          }
          console.log(musicIndex);
          loadMusic(musicList[musicIndex]);
        }
      };


      function setPlaylist(musiclist) {
        var container = document.createDocumentFragment();
        musiclist.forEach(function(musicObj){
          var node = document.createElement('li');
          node.innerText = musicObj.author + '-' + musicObj.title;
          console.log(node);
          container.appendChild(node);
        });
        musicListContainer.appendChild(container);
      }

      function loadMusic(songObj) {
        music.src = songObj.src;
        titleNode.innerText = songObj.title;
        authorNode.innerText = songObj.author;
        cover.style.backgroundImage = 'url(' + songObj.img + ')';
        for(var i = 0; i < musicListContainer.children.length; i++){
          musicListContainer.children[i].classList.remove('playing');
        }
        musicListContainer.children[musicIndex].classList.add('playing');
      }

      function loadNextMusic() {
        musicIndex++;
        musicIndex = musicIndex % musicList.length;
        loadMusic(musicList[musicIndex]);
      }

      function loadLastMusic() {
        musicIndex--;
        musicIndex = (musicIndex + musicList.length) % musicList.length;
        loadMusic(musicList[musicIndex]);
      }

      function updateProgress() {
        var percent = (music.currentTime / music.duration) * 100 + '%';
        progressNowNode.style.width = percent;
        var minutes = parseInt(music.currentTime / 60);
        var seconds = parseInt(music.currentTime % 60) + '';
        seconds = seconds.length == 2 ? seconds : '0' + seconds;
        timeNode.innerText = minutes + ':' + seconds;
      }

      function getMusic(callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('get', 'music.json', true);
        xhr.send();
        xhr.onload = function() {
          if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
            callback(JSON.parse(xhr.responseText));
          }
        };
      }
