var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';

var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

var playerBarPlayButton = '<span class="ion-play"></span>';
 
var playerBarPauseButton = '<span class="ion-pause"></span>';


var currentlyPlayingSongNumber = null;
 
var currentSongFromAlbum = null; 

var currentSoundFile = null;

var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
 
var $nextButton = $('.main-controls .next');

var $playBarButton = $('.main-controls .play-pause'); 

var setSong = function(songNumber) {
    
    if (currentSoundFile) {
         currentSoundFile.stop();
     }
    
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
         formats: [ 'mp3' ],
         preload: true
     });
    setVolume(currentVolume);
 };
 
var seek = function(time) {
     if (currentSoundFile) {
         currentSoundFile.setTime(time);
     }
 } 

var setVolume = function(volume) {
     if (currentSoundFile) {
         currentSoundFile.setVolume(volume);
     }
 };

var filterTimeCode = function(timeInSeconds) {
    
    timeInSeconds = parseFloat(timeInSeconds);
    
    var seconds = Math.floor(timeInSeconds%60);
    var minutes = Math.floor(timeInSeconds/60);
    
    return minutes + ":" + seconds;
    
    //use parseFloat() to get the seconds in number form
    //store variables for whole seconds and whole minutes using Math.floor() to round numbers down
    //return the tim in the format X:XX
};

var setCurrentTimeInPlayerBar = function(currentTime) {
    
    $('.current-time').text(filterTimeCode(currentTime));  
    //sets current text of the element with .current-time class to the current time in the song. 
};

var setTotalTimeInPlayerBar = function(totalTime) {
    
    $('.total-time').text(filterTimeCode(totalTime));
    
    //sets the text of the element with the .total-time class to the length of the song. 
};

var filterTimeCode = function(timeInSeconds) {
    
    timeInSeconds = parseFloat(timeInSeconds);
    
    var seconds = Math.floor(timeInSeconds%60);
    var minutes = Math.floor(timeInSeconds/60);
    
    return minutes + ":" + seconds;
    
    //use parseFloat() to get the seconds in number form
    //store variables for whole seconds and whole minutes using Math.floor() to round numbers down
    //return the tim in the format X:XX
};

var getSongNumberCell = function(number){
    return $('.song-item-number[data-song-number="' + number + '"]');
}


var createSongRow = function(songNumber, songName, songLength) {

   var template =
      '<tr class="album-view-song-item">' +
      '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>' +
      '  <td class="song-item-title">' + songName + '</td>' +
      '  <td class="song-item-duration">' + songLength + '</td>' +
      '</tr>';

  var $row = $(template);

  var clickHandler = function(){

    var $songDataAttr = parseInt($(this).attr('data-song-number'));

    // If a song is currently playing, revert that song button to the song's number
    if ( currentlyPlayingSongNumber !== null ) {

      var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);

      currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
      currentlyPlayingCell.html(currentlyPlayingSongNumber);

    }

    // If song clicked is not the currentlyPlayingSong,
    // make it the currentlyPlayingSong and display a pause button
    if (currentlyPlayingSongNumber !== $songDataAttr ){

      setSong($songDataAttr);
      $(this).html(pauseButtonTemplate);

      // Play the song that was clicked
      currentSoundFile.play();

      updateSeekBarWhileSongPlays();

      // Store the currently playing song name and length object
      currentSongFromAlbum = currentAlbum.songs[currentlyPlayingSongNumber - 1];

      var $volumeFill = $('.volume .fill');
      var $volumeThumb = $('.volume .thumb');
      $volumeFill.width(currentVolume + '%');
      $volumeThumb.css({left: currentVolume + '%'});

      $(this).html(pauseButtonTemplate);
      updatePlayerBarSong();

    // If clicking the currently playing song, revert the currentlyPlayingSong to null
    // and display the play button
    } else if (currentlyPlayingSongNumber === $songDataAttr ) {

      // Conditional statement that checks if the currentSoundFile is paused
      // Use Buzz's isPaused() method on currentSoundFile to check if the song is paused or not.
      if ( currentSoundFile.isPaused() ) {

        // Update the song's buttons to pause
        $(this).html(pauseButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPauseButton);

        // If song is paused, start playing the song again and revert the icon
        // in the song row and the player bar to the pause button.
        currentSoundFile.play();

        updateSeekBarWhileSongPlays();

      } else {

        // Update the song's buttons to play
        $(this).html(playButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPlayButton);

        // If song isn't paused, pause the song and set the content
        // of the song number cell and player bar's pause button back to the play button.
        currentSoundFile.pause();

      }

    }

  };

  var onHover = function(event) {
      var songNumberCell = $(this).find('.song-item-number');
      var songNumber = parseInt(songNumberCell.attr('data-song-number'));

      if (songNumber !== currentlyPlayingSongNumber) {
          songNumberCell.html(playButtonTemplate);
      }
  };

  var offHover = function(event) {
      var songNumberCell = $(this).find('.song-item-number');
      var songNumber = parseInt(songNumberCell.attr('data-song-number'));

      if (songNumber !== currentlyPlayingSongNumber) {
          songNumberCell.html(songNumber);
      }
  };

  $row.find('.song-item-number').click(clickHandler);
  $row.hover(onHover, offHover);
  return $row;

};


var $albumTitle = $('.album-view-title');
var $albumArtist = $('.album-view-artist');
var $albumReleaseInfo = $('.album-view-release-info');
var $albumImage = $('.album-cover-art');
var $albumSongList = $('.album-view-song-list');



var setCurrentAlbum = function(album) {
     currentAlbum = album;
     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);
     $albumSongList.empty();

 
     for (var i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);
     }
 };

var updateSeekBarWhileSongPlays = function() {
     if (currentSoundFile) {
         // #10
         currentSoundFile.bind('timeupdate', function(event) {
             // #11
             var seekBarFillRatio = this.getTime() / this.getDuration();
             var $seekBar = $('.seek-control .seek-bar');
 
             updateSeekPercentage($seekBar, seekBarFillRatio);
             setCurrentTimeInPlayerBar(this.getTime());
         });
     }
 };

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    // #1
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
 
    // #2
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
 };

var setupSeekBars = function() {
     var $seekBars = $('.player-bar .seek-bar');
 
     $seekBars.click(function(event) {
         // #3
         var offsetX = event.pageX - $(this).offset().left;
         var barWidth = $(this).width();
         // #4
         var seekBarFillRatio = offsetX / barWidth;
         
         if ($(this).parent().attr('class') == 'seek-control') {
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        } else {
            setVolume(seekBarFillRatio * 100);   
        }
 
         // #5
         updateSeekPercentage($(this), seekBarFillRatio);
     });

     $seekBars.find('.thumb').mousedown(function(event) {
         // #8
         var $seekBar = $(this).parent();
 
         // #9
         $(document).bind('mousemove.thumb', function(event){
             var offsetX = event.pageX - $seekBar.offset().left;
             var barWidth = $seekBar.width();
             var seekBarFillRatio = offsetX / barWidth;
             
             if ($seekBar.parent().attr('class') == 'seek-control') {
                seek(seekBarFillRatio * currentSoundFile.getDuration());   
            } else {
                setVolume(seekBarFillRatio);
            }
 
             updateSeekPercentage($seekBar, seekBarFillRatio);
         });
 
         // #10
         $(document).bind('mouseup.thumb', function() {
             $(document).unbind('mousemove.thumb');
             $(document).unbind('mouseup.thumb');
         });
     });
    };



var trackIndex = function(album, song) {
     return album.songs.indexOf(song);
 };


var updatePlayerBarSong = function() {
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    setTotalTimeInPlayerBar(currentSongFromAlbum.duration); 
};

var nextSong = function() {
    
    var getLastSongNumber = function(index) {
        return index == 0 ? currentAlbum.songs.length : index;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _incrementing_ the song here
    currentSongIndex++;
    
    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }
    
    // Set a new current song
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    updatePlayerBarSong();
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

    // Update the Player Bar information
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
    
};

var previousSong = function() {
    
    // Note the difference between this implementation and the one in
    // nextSong()
    var getLastSongNumber = function(index) {
        return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _decrementing_ the index here
    currentSongIndex--;
    
    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }
    
    // Set a new current song
    csetSong(currentSongIndex + 1);
     currentSoundFile.play();
    updateSeekBarWhileSongPlays();
     updatePlayerBarSong();
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

    // Update the Player Bar information
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
    
    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
    
};

var togglePlayFromPlayerBar = function(){
    
    if (currentSoundFile.isPaused()) {
    $('.currentlyPlayingSongNumber').html(playerBarPauseButton);
    $(this).html(playerBarPauseButton);
    currentSoundFile.play();    
    
    }
    
        //change the song number cell from a play button to a pause
        
        //change the HTML of the player bar's play button to a pause button 
        
        //play the song 
    
    else {
    $('.currentlyPlayingSongNumber').html(playerBarPlayButton);
    $(this).html(playerBarPlayButton);
    currentSoundFile.pause();    
    
    }
    
    //if the song is playing(current file exists) and the pause button is clicked
    
        //Change the song number cell from a pause to a play 
        
        //Change the html of the player bar's pause buton to a play button 
        
        // pause the song
};


//var showPlayButton = function () {
//    $(this).html(playButtonTemplate);
//   };
//
//var hidePlayButton = function () {
//    $(this).html(getSongNumberCell);
//};


    
$(document).ready(function() {     
    setCurrentAlbum(albumMarconi);
    setupSeekBars();
    $previousButton.click(previousSong);
    $nextButton.click(nextSong)
    $playBarButton.click(togglePlayFromPlayerBar);
    $(".player-bar").hide();
    $(".song-item-number").click(function(){
        $(".player-bar").show()
        
    });
    $(".song-item-number").hover(
        function () {
            $(this).addClass("pointer-cursor");
            
//            if (this != currentlyPlayingSongNumber || currentSongFromAlbum) {
//                $(this).removeClass("song-item-number");
//                $(this).addClass("album-song-button ion-play");
            
        }, function () {
                  $(this).removeClass("pointer-cursor");
                  
                  }
    );
});

     var listOfAlbums = [albumMarconi, albumMcBurney, albumPicasso];
     var index = 1;
     
    
    $(albumImage).addEventListener('click', function(event) {
                            
    
    setCurrentAlbum(listOfAlbums[i]);
         index++;
         if (index == listOfAlbums.length) {
             index = 0;
         }
         
                            
                            });


