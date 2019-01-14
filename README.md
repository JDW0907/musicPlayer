# MusicPlayer
### [预览地址](http://js.jirengu.com/mikunosibu/1/)
###一、所涉及到的相关知识应用：
**1.ajax 的使用；**
**2.DOM 的操作；**
**3.关于事件相关的一些操作；**
**4.音乐相关 api 的使用。**

### 二、整理核心点逻辑，并对功能有一定认识：
### #1. 音乐从哪里来：
比如说歌曲的数据可以放在一个数组里面，直接去用；也可以通过从服务端去获取，使用 ajax 去获取数据。
获取到之后就得到一个音乐的数据，一个数组。我们得到的音乐数据应该包括：音乐标题、作者、背景图片、音乐地址。
#### 2. 如何去操作播放音乐：
比如我有了一个音乐地址，应该如何去播放？音量我能不能控制？播放过程中播放了多少时间我能不能得到，能不能去暂停它？
这些即我们需要的功能，或者说技术关键点。
#### 3. 如何把他们组装起来。
比如把音乐播放器放在页面上，然后结合事件，当点击按钮时再执行对应具体操作。
###三、. 音乐播放器
#### 1. API
##### 1. audioObject
创建或者获取的 audio 对象，可通过以下两种方式得到：

`方法一：`
```
<audio id="music" src="http://cloud.hunger-valley.com/music/玫瑰.mp3">你的浏览器不支持喔！</audio>
<script>
var audioObject = document.querySelector('#music')
</script>
```

`方法二：`
```
var audioObject = new Audio('http://cloud.hunger-valley.com/music/玫瑰.mp3')
```
##### 2. audioObject.play()
开始播放
##### 3. audioObject.pause()
暂停播放
##### 4. audioObject.autoplay()
设置或者获取自动播放状态：
```
audioObject.autoPlay = true  //设置为自动播放，下次更换 audioObject.src 后会自动播放音乐
audioObject.autoPlay = false //设置不自动播放
console.log(audioObject.autoPlay)
```
##### 5. audioObject.src
设置或者获取音乐地址：
```
audioObject.src = "http://cloud.hunger-valley.com/music/ifyou.mp3"
console.log(audioObject.src)
```
##### 6. audioObject.volume
设置或者获取音量，最大值为 1，0 为静音：
```
audioObject.volume = 0.5
audioObject.volume = 1
console.log(audioObject.volume)
```
##### 7. audioObject.loop
设置或者获取循环状态：
```
audioObject.loop = true
console.log(audioObject.loop)
```
##### 8. audioObject.duration
获取音乐长度，单位为秒：
```
console.log(audioObject.duration)
```
##### 9. audioObject.currentTime
设置或者获取播放时间：
```
console.log(audioObject.currentTime)
```
##### 10. audioObject.ended
判断音乐是否播放完毕，只读属性。
#### 2. 事件

##### 1. playing
当音乐开始播放，暂停后重新开始播放，设置 currenTime 后开始播放时触发：
```
audioObject.addEventListener('playing', function(){
  console.log('playing')
})
```
##### 2. pause
当音乐暂停时和结束时触发：
  ```
audioObject.addEventListener('pause', function(){
  console.log('pause')
})
```
##### 3. ended
当音乐结束时触发：
```
audioObject.addEventListener('ended', function(){
  console.log('ended')
})
```
##### 4. timeupdate
当 currentTime 更新时会触发 timeupdate 事件，这个事件的触发频率由系统决定，但是会保证每秒触发 4-66 次（前提是每次事件处理不会超过250ms）：
```
//如下代码设置 每1秒左右执行一次
audioObject.shouldUpdate = true
audioObject.ontimeupdate = function(){
  var _this = this
  if(_this.shouldUpdate) {
     //do something
     console.log('update')
     _this.shouldUpdate = false
    setTimeout(function(){
      _this.shouldUpdate = true
    }, 1000)
  }
}
```
##### 5. volumechange
当音量改变时触发：
 ```
audioObject.onvolumechange = function(){
  console.log('volumechage')
})
```
### 整合后的代码：
```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>音乐播放器</title>
    <link rel="stylesheet" href="http://at.alicdn.com/t/font_881589_c0dwmabq02l.css">
    <style>
      /* reset.css */
      * {
        margin: 0;
        padding: 0;
      }


      /* common.css */
      body {
        height: 100vh;
      }

      .cover {
        position: absolute;
        content: '';
        display: block;
        width: 100%;
        height: 100%;
        background: url(http://cloud.hunger-valley.com/17-9-22/87786461.jpg) center center no-repeat;
        background-size: cover;
        filter: blur(3px);
      }

      /* index.css */
      .musicbox {
        position: absolute;
        left: 50%;
        top: 40%;
        transform: translate(-50%, -50%);
        font-family: cursive;
        font-size: 16px;
        color: #f06d6a;
        width: 340px;
      }

      .music-panel {
        border: 1px solid #76dba3;
        padding: 20px 20px 5px 20px;
        box-shadow: 0px 2px 5px 0px rgba(0,0,0,.1), 0px 2px 10px 0px rgba(0,0,0,.05);
        background-color: rgba(255,255,255,.9);
      }

      .musicbox .control {
        margin-top: 20px;
        font-size: 22px;
        color: #ee8a87;
        float: left;
      }

      .musicbox .control .iconfont {
        margin-right: 12px;
        cursor: pointer;
      }

      .musicbox .control .iconfont.disable {
        opacity: 0.3;
      }

      .musicbox .info {
        margin-left: 120px;
      }

      .musicbox .info .title {
        font-size: 18px;
      }

      .musicbox .info .author {
        font-size: 13px;
      }

      .musicbox .progress {
        width: 260px;
      }

      .musicbox .progress .bar {
        height: 3px;
        margin-top: 5px;
        background-color: rgba(0,0,0,.2);
        cursor: pointer;
      }

      .musicbox .progress .progress-now {
        height: 2px;
        width: 0;
        background-color: #ee8a87;
        position: relative;
      }

      .musicbox .time {
        text-align: right;
      }

      .musicbox:after,
      .musicbox .music:after {
        content: '';
        display: block;
        clear: both;
      }

      .musicbox .list {
        list-style: none;
      }

      .musicbox .list>li {
        position: relative;
        padding: 4px 10px;
        border: 1px solid rgba(255,255,255,.8);
        border-top: none;
        overflow: hidden;
        cursor: pointer;
        background-color: rgba(0,0,0,.8);
      }

      .musicbox .list>li:hover {
        background-color: rgba(255,255,255,.5);
      }

      .musicbox .list>li.playing:before {
        position: absolute;
        top: 0;
        left: 0;
        content: '';
        display: inline-block;
        width: 8px;
        height: 30px;
        background: rgba(255,255,255,.8);
      }

    </style>
  </head>
  <body>
    <!-- index.html -->
    <div class="cover"></div>
    <div class="musicbox">
      <div class="music-panel">
        <div class="music">
          <div class="control">
            <span class="back"><i class=" iconfont icon-back"></i></span>
            <span class="play"><i class=" iconfont icon-play"></i></span>
            <span class="forward"><i class=" iconfont icon-forward"></i></span>
          </div>
          <div class="info">
            <div class="title">My Song</div>
            <div class="author">Jay</div>
          </div>
        </div>
        <div class="progress">
          <div class="bar">
            <div class="progress-total"></div>
            <div class="progress-now"></div>
          </div>
          <div class="time">0:00</div>
        </div>
        <ul class="list">
          <li>贰佰-玫瑰</li>
          <li>IF YOU-Big Bang</li>
        </ul>
      </div>
    </div>


    <script>
      // index.js

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

    </script>
  </body>
</html>
```
