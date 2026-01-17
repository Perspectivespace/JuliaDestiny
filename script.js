document.addEventListener('DOMContentLoaded', () => {
    
    var end_panel = document.querySelector(".background-layer"); 
    var end_cv = document.getElementById("magic-dust");
    
    if (!end_panel || !end_cv) { return; }

    var end_ctx = end_cv.getContext("2d");
    var end_cvWidth = parseInt(window.getComputedStyle(end_panel).width, 10);
    var end_cvHeight = parseInt(window.getComputedStyle(end_panel).height, 10);
    var resolution = window.devicePixelRatio || 1;
    var sprites = [];
    var toRad = Math.PI / 180;

    resizeCv();
    start_fx();

    function start_fx() {
        init_fx(
            "circle", 800, 50, 50, 50, 50, 0, end_cvWidth, 0, end_cvHeight,
            1, 4, 0, 360, .1, 1.5, .1, .5, 360, 0, 0, 20, 40,
            4, 6, 0.02, 25, -1, 0
        );
    }
    
    function init_fx(textureSpr, totalSpr, minWidth, maxWidth, minHeight, maxHeight, xMin, xMax, yMin, yMax, veloMin, veloMax, angleMin, angleMax, startScaleMin, startScaleMax, endScaleMin, endScaleMax, rotStart, rotEndMin, rotEndMax, minDur, maxDur, fadeInDur, fadeOutDur, gravitySpr, delaySpr, repeatSpr, delayTl) {
        for (var i = 0; i < totalSpr; i++) {
            sprites.push(createSprite(createShape(textureSpr, i)));
        }
        gsap.ticker.add(renderCv);
        gsap.registerPlugin(Physics2DPlugin);
        function createSprite(texture) {
            var duration = randomNr(minDur, maxDur); var angleNr = randomNr(angleMin, angleMax);
            var tl = gsap.timeline({ delay: randomNr(delaySpr), repeat: repeatSpr, repeatDelay: randomNr(1) });
            var sprite = {
                animation: tl, texture: texture,
                width: (texture.width || 0) / resolution, height: (texture.height || 0) / resolution,
                alpha: 0, rotation: randomNr(rotStart), scale: randomNr(startScaleMin, startScaleMax),
                x: randomNr(xMin, xMax), y: randomNr(yMin, yMax),
            };
            tl.to(sprite, fadeInDur, { alpha: 1, ease: Power0.easeIn }, 0)
              .to(sprite, duration, {
                  rotation: 180 * randomNr(rotEndMin, rotEndMax), scale: randomNr(endScaleMin, endScaleMax),
                  physics2D: { velocity: randomNr(veloMin, veloMax), angle: angleNr, gravity: gravitySpr, }
              }, 0)
              .to(sprite, fadeOutDur, { alpha: 0, delay: duration - fadeOutDur }, 0);
            return sprite;
        }
        function createShape(textureSpr, i) {
            var canvas = document.createElement("canvas"); var context = canvas.getContext("2d");
            var widthSpr = 50; canvas.width = widthSpr * resolution; canvas.height = widthSpr * resolution;
            var radius = (widthSpr / 2) * resolution;
            var gradient = context.createRadialGradient(radius, radius, 0, radius, radius, radius);
            if (i % 3 === 0) {
                gradient.addColorStop(0, "rgba(130, 90, 220, 0.6)");
                gradient.addColorStop(0.15, "rgba(150, 220, 255, 0.08)");
            } else if (i % 5 === 0) {
                gradient.addColorStop(0, "rgba(190, 70, 210, 0.5)");
                gradient.addColorStop(0.1, "rgba(190, 70, 210, 0.05)");
            } else {
                gradient.addColorStop(0, "rgba(80, 190, 180, 0.5)");
                gradient.addColorStop(0.1, "rgba(80, 190, 180, 0.05)");
            }
            gradient.addColorStop(0.7, "rgba(0,0,0,0)");
            context.fillStyle = gradient; context.fillRect(0, 0, canvas.width, canvas.height);
            return canvas;
        }
    }
    function renderCv() {
        end_ctx.clearRect(0, 0, end_cvWidth, end_cvHeight);
        for (var i = 0; i < sprites.length; i++) {
            var sprite = sprites[i]; if (!sprite.alpha) { continue; }
            end_ctx.save();
            end_ctx.translate(sprite.x, sprite.y); end_ctx.rotate(sprite.rotation * toRad);
            end_ctx.scale(sprite.scale, sprite.scale); end_ctx.globalAlpha = sprite.alpha;
            end_ctx.drawImage(sprite.texture, -sprite.width / 2, -sprite.height / 2);
            end_ctx.restore();
        }
    }
    function resizeCv() {
        end_cv.width = end_cvWidth * resolution; end_cv.height = end_cvHeight * resolution;
        end_cv.style.width = end_cvWidth + "px"; end_cv.style.height = end_cvHeight + "px";
        end_ctx.scale(resolution, resolution);
    }
    function randomNr(min, max) { return min + (max - min) * Math.random(); }
    function randomInt(min, max) { return Math.floor(min + (max - min + 1) * Math.random()); }
});
