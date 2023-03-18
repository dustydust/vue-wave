Snap.plugin(function(Snap, Element) {
    return Element.prototype.hover = function(f_in, f_out, s_in, s_out) {
        return this.mouseover(f_in, s_in).mouseout(f_out || f_in, s_out || s_in)
    }
})

const paperID = 'context-menu-holder'
const sectorClass = 'radialnav-sector'

const polarToCartesian = (cx, cy, r, angle) => {
    angle = (angle - 90) * Math.PI / 180
    return {
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle)
    }
}

const describeArc = (x, y, r, startAngle, endAngle, continueLine, alter) => {
    const start = polarToCartesian(x, y, r, startAngle %= 360)
    const end = polarToCartesian(x, y, r, endAngle %= 360)
    return "" + (continueLine ? 'L' : 'M') + start.x + " " + start.y + " A" + r + " " + r + ", 0, " + (endAngle - startAngle >= 180 ? 1 : 0) + ", " + (alter ? 0 : 1) + ", " + end.x + " " + end.y
}

const describeSector = (x, y, r, r2, startAngle, endAngle) => {
    return "" + (describeArc(x, y, r, startAngle, endAngle)) + " " + (describeArc(x, y, r2, endAngle, startAngle, true, true)) + "Z"
}

const random = (min, max) => {
    return Math.random() * (max - min) + min
}

const animate = (obj, index, start, end, duration, easing, fn, callback) => {
    let ref
    if ((ref = (obj.animation != null ? obj.animation : obj.animation = [])[index]) != null) {
        ref.stop()
    }
    return obj.animation[index] = Snap.animate(start, end, fn, duration, easing, callback)
}

export class ContextMenu {
    constructor(buttons) {
        this.paper = Snap(`#${paperID}`)
        this.icons = []
        Snap.load("./icons3.svg", (fragment) =>{
            const iconsGlobal = fragment
            this.nav = new RadialNav(this.paper, buttons, iconsGlobal)
            // this.nav.show()
        })
        return this._bindEvents()
    }

    _onIconLoaded(data) {
        this.icons.append(data)
    }

    _bindEvents() {
        window.addEventListener('resize', ((_this) => {
            return function() {
                _this.nav.area.attr({
                    x: (window.innerWidth / 2) - _this.nav.c,
                    y: (window.innerHeight / 2) - _this.nav.c
                })
                return _this.paper.attr({
                    width: window.innerWidth,
                    height: window.innerHeight
                })
            }
        }))

        addEventListener("mousedown", (event) => {
            const e = event || window.event;
            const elementId = (e.target || e.srcElement).id;
            if (paperID === elementId) this.nav.show(event)
        })

        addEventListener("mouseup", (event) => {
            const e = event || window.event;
            const elementId = (e.target || e.srcElement).id;
            if (paperID === elementId || e.target.classList.contains(sectorClass)) this.nav.hide()
        })
    }
}

class RadialNav {
    constructor(paper, buttons, icons) {
        this.area = paper.svg(0, 0, this.size = 500, this.size).addClass('radialnav').attr({id: 'radialnav'})
        this.c = this.size / 2
        this.r = this.size * .25
        this.r2 = this.r * .45
        this.animDuration = 150
        this.angle = 360 / buttons.length
        this.container = this.area.g()
        this.container.transform("s0")
        this.updateButtons(buttons, icons)
    }

    _animateContainer(start, end, duration, easing) {
        return animate(this, 0, start, end, duration, easing, ((_this) => {
            return (val) => {
                return _this.container.transform("r" + (90 - 90 * val) + "," + _this.c + "," + _this.c + "s" + val + "," + val + "," + _this.c + "," + _this.c)
            }
        })(this))
    }

    _animateButtons(start, end, min, max, easing) {
        const anim = ((_this) => {
            return (i, el) => {
                return animate(el, 0, start, end, random(min, max), easing, (val) => {
                    return el.transform("r" + (_this.angle * i) + "," + _this.c + "," + _this.c + "s" + val + "," + val + "," + _this.c + "," + _this.c)
                })
            }
        })(this)
        const ref = this.container
        const results = []
        for (const i in ref) {
            const el = ref[i]
            if (!isNaN(+i)) {
                results.push(anim(i, el))
            }
        }
        return results
    }

    _animateButtonHover(button, start, end, duration, easing, callback) {
        return animate(button, 1, start, end, duration, easing, (((_this) => {
            return function(val) {
                button[0].attr({
                    d: describeSector(_this.c, _this.c, _this.r - val * 10, _this.r2, 0, _this.angle)
                })
            }
        })(this)), callback)
    }

    _icon(btn, icons) {
        const icon = icons.select(`#${btn.icon}`).addClass('radialnav-icon')
        const bbox = icon.getBBox()
        let scale = Math.abs(5 / (bbox.x + bbox.y))
        if ((bbox.x / bbox.y) < 1.6 && scale < 0.1) scale = scale^4
        return icon.transform(`T${this.c - bbox.x - bbox.width / 2},${this.c - this.r + this.r2 - bbox.y - bbox.height / 2 -20} R${this.angle / 2},${this.c},${this.c}S${scale}`)
    }

    _hint(btn) {
        const hint = this.area.text(0, 0, btn.hint).addClass('radialnav-hint').attr({
            textpath: describeArc(this.c, this.c, this.r, 0, this.angle)
        })
        hint.select('*').attr({startOffset: '50%'})
        return hint
    }

    _sector() {
        return this.area.path(describeSector(this.c, this.c, this.r, this.r2, 0, this.angle)).addClass(`${sectorClass}`)
    }

    _rotateContainer(start, end, duration, easing, angle, c) {
        return animate(this, 0, start, end, duration, easing, ((_this) => {
            return (val) => {
                return _this.container.transform("r"+angle*val+","+c+","+c)
            }
        }))
    }

    _button(btn, btn_cnt, sector, icon, hint) {
        const container = this
        return this.area.g(sector, icon, hint ? hint : '').data('callback', btn.action).click(() => {
            const angle = Math.round(((360 / btn_cnt) * btn.num) - ((360 / btn_cnt) / 2)) * -1
            container._rotateContainer(0, 1, 4000, mina.elastic, angle, container.c)
        }).mouseup(function() {
            let base
            return typeof (base = this.data('callback')) === "function" ? base() : void 0
        }).hover(function() {
            const ref = [this[0], this[1], this[2]]
            const results = []
            for (let i = 0, len = ref.length; i < len; i++) {
                const el = ref[i];
                (el === undefined) ? ' ' : results.push(el.toggleClass('active'))
            }
            return results
        }).hover(this._buttonOver(this), this._buttonOut(this))
    }

    _buttonOver(nav) {
        return function() {
            nav._animateButtonHover(this, 0, 1, 200, mina.easeinout)
        }
    }

    _buttonOut(nav) {
        return function() {
            return nav._animateButtonHover(this, 1, 0, 2000, mina.elastic, (function() {}).bind(this[2]))
        }
    }

    updateButtons(buttons, icons) {
        this.container.clear()
        const results = []
        for (let i = 0, len = buttons.length; i < len; i++) {
            const btn = buttons[i]
            btn.num = i + 1
            results.push(this.container.add(
                this._button(
                    btn,
                    buttons.length,
                    this._sector(), 
                    this._icon(buttons[i], icons),
                    this._hint(buttons[i])
                )
            ))
        }
        return results
    }

    show(e) {
        this.area.attr({
            x: e ? e.clientX - this.c : (window.innerWidth / 2) - this.c,
            y: e ? e.clientY - this.c : (window.innerHeight / 2) - this.c
        })
        // this.area.attr({
        //     x: (window.innerWidth / 2) - this.c,
        //     y: (window.innerHeight / 2) - this.c
        // })
        this._animateContainer(0, 1, this.animDuration * 8, mina.elastic)
        return this._animateButtons(0, 1, this.animDuration, this.animDuration * 2, mina.elastic)
    }

    hide() {
        this._animateContainer(1, 0, this.animDuration, mina.easeinout)
        return this._animateButtons(1, 0, this.animDuration, this.animDuration, mina.easeinout)
    }
}