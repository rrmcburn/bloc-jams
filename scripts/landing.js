var pointsArray = document.getElementsByClassName('point');

var animatePoints = function(points) {
 
    var changeStyle = function (pointsNum) {
        pointsArray[pointsNum].style.opacity = 1;
        pointsArray[pointsNum].style.transform = "scaleX(1) translateY(0)";
        pointsArray[pointsNum].style.msTransform = "scaleX(1) translateY(0)";
        pointsArray[pointsNum].style.WebkitTransform = "scaleX(1) translateY(0)";
                }
    
    for (var i = 0; i < pointsArray.length; i++) {
            changeStyle(i);
                 }  
                }; 

window.onload = function() {
    
    if (window.innerHeight > 950) {
         animatePoints(pointsArray);
     }
    
    var sellingPoints = document.getElementsByClassName('selling-points')[0];
    var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;
    
    window.addEventListener('scroll', function(event) {
         if (document.documentElement.scrollTop || document.body.scrollTop >= scrollDistance) {
             animatePoints(pointsArray);   
         }
     });
 }
                            