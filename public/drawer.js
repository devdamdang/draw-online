var Drawer = {
    canvas: false,
    ctx: false,
    flag: false,
    prevX: 0,
    currX: 0,
    prevY: 0,
    currY: 0,
    dotFlag: false,
    socket: null,
    color: "black",
    lineWidth: 2,
    w: 0,
    h: 0,

    init: function(setting) {
        this.socket = setting.socket;
        var main = document.getElementsByTagName('main')[0];
        this.w = main.offsetWidth;
        this.h = main.offsetHeight;
        this.canvas = document.getElementById('draw-area');
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width  = this.w;
        this.canvas.height = this.h;
        var self = this;
    
        this.canvas.addEventListener("mousemove", function (e) {
            self.findxy('move', e)
        }, false);

        this.canvas.addEventListener("mousedown", function (e) {
            self.findxy('down', e)
        }, false);
        this.canvas.addEventListener("mouseup", function (e) {
            self.findxy('up', e)
        }, false);

        // Touch on mobile
        this.canvas.addEventListener("touchstart", function (e) {
            self.findxy('down', e.touches[0])
        }, false);

        this.canvas.addEventListener("touchmove", function (e) {
            self.findxy('move', e.touches[0])
        }, false);

        this.canvas.addEventListener("touchend", function (e) {
            self.findxy('up', e.touches[0])
        }, false);

        // Event when socket server sending
        this.socket.on('draw', function(data){
            self.draw(data);
        });
    },

    /**
     * Reset point
     * @param {*} e 
     */
    resetPoint: function(e){
        this.prevX = this.currX;
        this.prevY = this.currY;
        this.currX = e.clientX - this.canvas.offsetLeft;
        this.currY = e.clientY - this.canvas.offsetTop;
    },

    /**
     * Find xy
     */
    findxy: function(res, e) {
        if (res == 'down') {
            this.resetPoint(e);
    
            this.flag = true;
            this.dotFlag = true;

            if (this.dotFlag) {
                this.ctx.beginPath();
                this.ctx.fillStyle = this.color;
                this.ctx.fillRect(this.currX, this.currY, 2, 2);
                this.ctx.closePath();
                this.dotFlag = false;
            }
        }

        if (res == 'up' || res == "out") {
            this.flag = false;
        }

        if (res == 'move') {
            if (this.flag) {
                this.resetPoint(e);
                var data = {
                    from: {
                        x: this.prevX,
                        y: this.prevY
                    },
                    to: {
                        x: this.currX,
                        y: this.currY
                    },
                    color: this.color,
                    lineWidth: this.lineWidth
                };

                this.draw(data);
                this.socket.emit('draw', data);
            }
        }
    },

    /**
     * Change color
     * @param {*} obj 
     */
    color: function(color) {
        this.color = color;
        if (this.color == "white") this.lineWidth = 14;
        else this.lineWidth = 2;
    
    },

    /**
     * Drawing
     */
    draw: function(data) {
        this.ctx.beginPath();
        this.ctx.moveTo(data.from.x, data.from.y);
        this.ctx.lineTo(data.to.x, data.to.y);
        this.ctx.strokeStyle = data.color;
        this.ctx.lineWidth = data.lineWidth;
        this.ctx.stroke();
        this.ctx.closePath();
    },

    /**
     * Clear
     */
    erase: function() {
        var m = confirm("Want to clear");
        if (m) {
            this.ctx.clearRect(0, 0, this.w, this.h);
            // document.getElementById("preview").style.display = "none";
        }
    },
    
    /**
     * Save
     */
    save: function() {
        document.getElementById("preview").style.border = "2px solid";
        var dataURL = this.canvas.toDataURL();
        document.getElementById("preview").src = dataURL;
        document.getElementById("preview").style.display = "inline";
    }
};
