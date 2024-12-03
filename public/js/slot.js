 var stagecontainer = document.getElementById('stage');
 var heightrad = window.getComputedStyle(stagecontainer, null).getPropertyValue("height");
console.log(parseFloat(heightrad));
//var fln = parseFloat(heightrad)/4.2;
var fln= 200;//120;
 var FACES_PER_RING = 12;
            var RING_RADIUS = fln;//heightrad;//200;
            var FACE_ANGLE = 360 / FACES_PER_RING;

            function setup_faces (row)
            {
                for (var i = 0; i < FACES_PER_RING; i ++) {
                    var face = document.createElement('div');
                    face.className = 'face';
                    // compute and assign the transform for this face
                    var transform = 'rotateX(' + getDefaultRotation(i) + 'deg) translateZ(' + RING_RADIUS + 'px)';
                    face.style.transform = transform;
                    // setup the number to show inside the face
                    var content = face.appendChild(document.createElement('p'));
                    content.textContent = i;
                    // add the face to the row
                    row.appendChild(face);
                }
            }

            function getDefaultRotation(index) {
                return FACE_ANGLE * index;
            }

            var styleElement;
            function updateDynamicCss(css){
                if (!styleElement){                
                    var head = document.head || document.getElementsByTagName('head')[0],
                        styleElement = document.createElement('style');

                    head.appendChild(styleElement);
                }

                styleElement.type = 'text/css';
                if (styleElement.styleSheet){
                    styleElement.styleSheet.cssText = css;
                } else {
                    styleElement.innerHTML = css;
                }
            }

            var timeRun = 0;
            var defaultAnimationStuff = 'animation-duration: 5s; animation-iteration-count: 1; animation-fill-mode: forwards; animation-timing-function: ease-in-out;';

            var currentState = [0,0,0];

            function init ()
            {
                setup_faces(document.getElementById('ring-1'));
                setup_faces(document.getElementById('ring-2'));
                setup_faces(document.getElementById('ring-3'));

                document.querySelector('.startSpinn').addEventListener('click', function(){
                    var cssStr = [];

                    var i = 4;
                    while(--i) {
                        var input = document.getElementById('input'+i);

                        //var num = Number(input.value) || 0;
                        var num = 0;
                        var nextState = num = (0 - getDefaultRotation(num));    
                        num -= (5 * 360);                       

                        cssStr.push('@keyframes ringAnimation' + i + '' + timeRun + ' { 0% { transform: rotateX(' + currentState[i] + 'deg); } 100% { transform: rotateX(' + num + 'deg); }}');

                        var ring = document.getElementById('ring-' + i);                  
                        ring.setAttribute('style', 'transform: rotateX(' + currentState[i] + 'deg);'); 

                        currentState[i] = nextState;
                    }

                    updateDynamicCss(cssStr.join(''));

                    i = 4;
                    while(--i){                  
                        window.setTimeout(function(i, timeRun){ 
                            return function() {
                                document.getElementById('ring-' + i).setAttribute('style', 'animation-name: ringAnimation' + i + '' + timeRun +';' + defaultAnimationStuff); 
                            }
                        }(i, timeRun), 50 + (Math.random() * /*750*/1000));
                    }

                    timeRun+=1;
                });
            }

            // call init once the document is fully loaded
            window.addEventListener('load', init, false);
