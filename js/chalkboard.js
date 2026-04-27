const lc_CHALKBOARD_COLOR = '#20382d';
const lc_CHALK_COLOR = 'rgba(247, 251, 255, 0.88)';
const lc_CHALK_TEXT_COLOR = 'rgba(247, 251, 255, 0.92)';
const lc_CHALK_MUTED_TEXT_COLOR = 'rgba(247, 251, 255, 0.78)';
const lc_CHALK_BORDER_COLOR = 'rgba(247, 251, 255, 0.45)';
const lc_CHALK_DOODLE_COLOR = 'rgba(247, 251, 255, 0.65)';
const lc_CHALK_DUST_BASE_COLOR = '255, 255, 255';
const lc_PENCIL_CHALK_COLOR = 'rgba(255, 203, 100, 0.9)';

const lc_CHALK_DUST_COUNT = 70;
const lc_CHALK_DUST_MAX_OPACITY = 0.05;
const lc_CHALK_DUST_MAX_RADIUS = 1.6;

const lc_BOARD_PADDING = 24;
const lc_CHALK_STROKE_WIDTH = 2.6;
const lc_CHALK_DOT_RADIUS = 2.8;

window.lc_chalkboardHero = function () {
    return {
        isDrawing: false,
        lastPoint: null,
        canvas: null,
        ctx: null,
        roughCanvas: null,

        init() {
            this.canvas = this.$refs.board;
            this.ctx = this.canvas.getContext('2d');

            this.lc_resizeBoard();

            window.addEventListener('resize', () => {
                this.lc_resizeBoard();
            });
        },

        lc_resizeBoard() {
            const rect = this.canvas.getBoundingClientRect();
            const scale = window.devicePixelRatio || 1;

            this.canvas.width = rect.width * scale;
            this.canvas.height = rect.height * scale;

            this.ctx.setTransform(scale, 0, 0, scale, 0, 0);
            this.roughCanvas = rough.canvas(this.canvas);

            this.lc_drawBoardBackground(rect.width, rect.height);
            this.lc_drawStarterDoodles(rect.width, rect.height);
        },

        lc_drawBoardBackground(width, height) {
            this.ctx.clearRect(0, 0, width, height);
            this.ctx.fillStyle = lc_CHALKBOARD_COLOR;
            this.ctx.fillRect(0, 0, width, height);

            for (let i = 0; i < lc_CHALK_DUST_COUNT; i++) {
                this.ctx.beginPath();
                this.ctx.fillStyle = `rgba(${lc_CHALK_DUST_BASE_COLOR}, ${Math.random() * lc_CHALK_DUST_MAX_OPACITY})`;
                this.ctx.arc(
                    Math.random() * width,
                    Math.random() * height,
                    Math.random() * lc_CHALK_DUST_MAX_RADIUS,
                    0,
                    Math.PI * 2
                );
                this.ctx.fill();
            }
        },

        lc_drawStarterDoodles(width, height) {
            this.ctx.save();

            this.ctx.font = '900 32px Nunito, sans-serif';
            this.ctx.fillStyle = lc_CHALK_TEXT_COLOR;
            this.ctx.fillText('Welcome!', 32, 58);

            this.ctx.font = '800 18px Nunito, sans-serif';
            this.ctx.fillStyle = lc_CHALK_MUTED_TEXT_COLOR;
            this.ctx.fillText('Draw on Ms. Crocco\'s chalkboard!', 34, 92);

            this.roughCanvas.rectangle(
                lc_BOARD_PADDING,
                lc_BOARD_PADDING,
                width - lc_BOARD_PADDING * 2,
                height - lc_BOARD_PADDING * 2,
                {
                    stroke: lc_CHALK_BORDER_COLOR,
                    strokeWidth: 2,
                    roughness: 2.8,
                    bowing: 2,
                }
            );

            this.roughCanvas.circle(width - 72, 58, 34, {
                stroke: lc_PENCIL_CHALK_COLOR,
                strokeWidth: 2,
                roughness: 2.5,
            });

            this.roughCanvas.line(width - 140, height - 62, width - 52, height - 92, {
                stroke: lc_CHALK_DOODLE_COLOR,
                strokeWidth: 2,
                roughness: 2.8,
            });

            this.roughCanvas.line(width - 128, height - 96, width - 58, height - 54, {
                stroke: lc_CHALK_DOODLE_COLOR,
                strokeWidth: 2,
                roughness: 2.8,
            });

            this.ctx.restore();
        },

        lc_getPoint(event) {
            const rect = this.canvas.getBoundingClientRect();

            return {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
            };
        },

        lc_startDrawing(event) {
            event.preventDefault();

            this.isDrawing = true;
            this.lastPoint = this.lc_getPoint(event);

            this.lc_drawChalkDot(this.lastPoint);

            if (this.canvas.setPointerCapture) {
                this.canvas.setPointerCapture(event.pointerId);
            }
        },

        lc_drawLine(event) {
            if (!this.isDrawing || !this.lastPoint) {
                return;
            }

            event.preventDefault();

            const point = this.lc_getPoint(event);

            this.roughCanvas.line(this.lastPoint.x, this.lastPoint.y, point.x, point.y, {
                stroke: lc_CHALK_COLOR,
                strokeWidth: lc_CHALK_STROKE_WIDTH,
                roughness: 1.8,
                bowing: 1.2,
            });

            this.lastPoint = point;
        },

        lc_drawChalkDot(point) {
            this.ctx.beginPath();
            this.ctx.fillStyle = lc_CHALK_COLOR;
            this.ctx.arc(point.x, point.y, lc_CHALK_DOT_RADIUS, 0, Math.PI * 2);
            this.ctx.fill();
        },

        lc_stopDrawing() {
            this.isDrawing = false;
            this.lastPoint = null;
        },

        lc_clearBoard() {
            const rect = this.canvas.getBoundingClientRect();

            this.lc_drawBoardBackground(rect.width, rect.height);
            this.lc_drawStarterDoodles(rect.width, rect.height);
        },
    };
};