var animatePoints = function() {
 
    var points = document.getElementsByClassName('point');
 
    var changeStyle = function (pointsNum) {
        points[pointsNum].style.opacity = 1;
        points[pointsNum].style.transform = "scaleX(1) translateY(0)";
        points[pointsNum].style.msTransform = "scaleX(1) translateY(0)";
        points[pointsNum].style.WebkitTransform = "scaleX(1) translateY(0)";
                }
    
    for (var i = 0; i < points.length; i++) {
            changeStyle(i);
                 }  
                }; 
animatePoints();