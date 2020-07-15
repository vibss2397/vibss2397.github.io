
(function($) {
  "use strict"; // Start of use strict

  // Closes the sidebar menu
  $(".menu-toggle").click(function(e) {
    e.preventDefault();
    $("#sidebar-wrapper").toggleClass("active");
    $(".menu-toggle > .fa-bars, .menu-toggle > .fa-times").toggleClass("fa-bars fa-times");
    $(this).toggleClass("active");
  });

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });
  var classes_to_add = ['g-1', 'g-2', 'g-3', 'g-4','g-5','g-6', 'g-4'];
  var titles=['Generating rick n morty subtitles via machine learning', 'Greedy vs Heuristic', 'Playing frozen lake via qlearning', 'Shazam for things', 'classifying facial emotions', 'Generating superheroes using deep learning', 'teaching a bot to play atari games', 'Active learning for cats vs dogs']
  var pathtolink=['rnn','path','qlearn','shazam','emoji','gan','reinforce', 'active'];
  var pathtoImages = ['./img/gif/charRnn.gif', './img/gif/astar.gif', './img/gif/qlearn.gif', './img/seething/main.gif', './img/face2emoji/back.PNG', './img/gan/marvel3.jpg', './img/gif/atari.gif', './img/gif/cvd.gif']
  var bleh = [0, 1, 2, 3, 4, 5, 6];
  var choice = [];
  for(let i = 0;i<7;i++){
    let tem = Math.floor(Math.random() * bleh.length);
    choice.push(bleh[tem]);
    bleh.splice(tem, 1);    
  }
  let rando = [];
  for (var i =0;i<4;i++){
    let rand = Math.floor(Math.random()*pathtolink.length);
    while(rando.includes(rand)){
      console.log('heere')
      rand = Math.floor(Math.random()*pathtolink.length);
    }
    rando.push(rand);
    $('.owl-container-ele').append(
        '<a href="./project/template.html?name='+pathtolink[rand]+'" style="color:#fff;text-decoration:none;overflow: hidden">'+
        '<div class="item mx-auto card grad-card project-card-'+i+' "  data-tilt data-tilt-max="10"  data-tilt-glare data-tilt-max-glare="0.8">'+
        '<div class="topic px-3 pt-3">'+
        '<h3 class="m-0">'+pathtolink[rand]+'</h3>'+
        '<h6 style="font-weight: 400">('+titles[rand]+')</h6>'+
      '</div><br>'+
      '<div class="row justify-content-center"><img class="img-fluid" src="'+pathtoImages[rand]+'" style="width:200px !important;"></div>'+
      '</div>'+
          '</div></a>'   
    );
    $('.project-card-'+i).addClass(classes_to_add[choice[i]%7]);
    // var pattern = pathtolink[choice[i]];
    //   $('#'+pathtolink[choice[i]]).geopattern(pattern);

  }
  for(let i = 0;i<3;i++){
    let rand = Math.floor(Math.random()*pathtolink.length);
    $('.featured-project').append('<a href="./project/template.html?name='+pathtolink[rand]+'" style="color:#fff;text-decoration:none;overflow: hidden">'+
    '<div class="card masthead-card tilt-card mx-auto   "  data-tilt data-tilt-glare data-tilt-max-glare="0.5" data-tilt-max="5" style="transform-style: preserve-3d;height:auto">'+
      '<div class="topic px-3 pt-3">'+
        '<h3 class="m-0">'+pathtolink[rand]+'</h3>'+
        '<h6 style="font-weight: 400">('+titles[rand]+')</h6>'+
      '</div>'+
      '<div class="card grad-card mt-auto p-3" style="transform: translateZ(20px)"><img class="img-fluid mx-auto my-auto" id="image" src="'+pathtoImages[rand]+'" >'+
      '</div>'+
    '</div></a>')
  }

  for (var i=1;i<=3;i++){
    let r = Math.random().toString(36).substring(4, 10);
    $('.research-card-'+i.toString()).geopattern(r);
  }

  // Closes responsive menu when a scroll trigger link is clicked
  $('#sidebar-wrapper .js-scroll-trigger').click(function() {
    $("#sidebar-wrapper").removeClass("active");
    $(".menu-toggle").removeClass("active");
    $(".menu-toggle > .fa-bars, .menu-toggle > .fa-times").toggleClass("fa-bars fa-times");
  });

  // Scroll to top button appear
  $(document).scroll(function() {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });

})(jQuery); // End of use strict

// Disable Google Maps scrolling
// See http://stackoverflow.com/a/25904582/1607849
// Disable scroll zooming and bind back the click event
var onMapMouseleaveHandler = function(event) {
  var that = $(this);
  that.on('click', onMapClickHandler);
  that.off('mouseleave', onMapMouseleaveHandler);
  that.find('iframe').css("pointer-events", "none");
}
var onMapClickHandler = function(event) {
  var that = $(this);
  // Disable the click handler until the user leaves the map area
  that.off('click', onMapClickHandler);
  // Enable scrolling zoom
  that.find('iframe').css("pointer-events", "auto");
  // Handle the mouse leave event
  that.on('mouseleave', onMapMouseleaveHandler);
}
// Enable map zooming with mouse scroll when the user clicks the map
