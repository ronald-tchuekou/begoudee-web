/**
 * Pour la gestion des conteneurs drawer.
 * @author Ronald Tchuekou
 * @email ronaldtchuekou@gmail.com
 */
class DrawerContent {
    CHILDREN = []
    is_render = false

    /**
     * @param {HTMLElement} element Element html sur le quel le carousel sera injecter.
     */
    constructor(element) {
        this.element = element
        this.currentItem = 0
        if (element === undefined) {
            console.error('Indiquer un élément du document pour le carousel.', element)
            return
        }
        let children = [].slice.call(element.children) // Récupération des enfants au moment de l' execution du script.

        // Manipulation du dom.
        this.domManagement(children)
        this.setStyles()
    }

    /**
     * Appliquer les bonnes dimensions au items du carousel.
     */
    setStyles() {
        let ratio = this.items.length
        this.container.style.width = ratio * 100 + '%'
        this.items.forEach((item) => (item.style.width = 100 / ratio + '%'))
    }

    /**
     * Partir à l' item suivant.
     */
    next() {
        let position = this.currentItem + 1
        if (position >= this.items.length) return
        this.gotToItem(position)
    }

    /**
     * Revenir à l' item précédant.
     */
    previous() {
        let position = this.currentItem - 1
        if (position < 0) return
        this.gotToItem(position)
    }

    /**
     * Déplacer l' item courant vers l' item ciblé.
     * @param {number} index
     */
    gotToItem(index) {
        let translateX = (index * -100) / this.items.length
        this.container.style.transform = `translate3d(${translateX}%, 0, 0)`
        this.container.offsetHeight // Forcé le repaint, pour annuler les animations.
        this.currentItem = index
    }

    /**
     * @param {String} className
     * @returns {HTMLElement}
     */
    createDivWithClass(className) {
        let div = document.createElement('div')
        div.setAttribute('class', className)
        return div
    }

    /**
     * Gestion du document.
     */
    domManagement(children) {
        this.root = this.createDivWithClass('drawer_content')
        this.container = this.createDivWithClass('drawer')
        this.root.appendChild(this.container)
        this.element.appendChild(this.root)
        this.items = children.map((child) => {
            let item = this.createDivWithClass('drawer__item')
            item.appendChild(child)
            this.CHILDREN.push(child.cloneNode(true))
            return item
        })

        this.items.forEach((item) => this.container.appendChild(item))

        this.is_render = true

        window.addEventListener('resize', this.onResize.bind(this))
    }

    /**
     * @param {Event} e
     */
    onResize() {
        let mobile = window.innerWidth < 640
        let desktop = window.innerWidth > 640
        if (mobile !== this.isMobile) {
            this.isMobile = mobile
        } else if (desktop !== this.isDesktop) {
            domManagement(this.CHILDREN)
        }
    }

    removeContainer() {
        this.CHILDREN.forEach((item) => {
            this.element.appendChild(item)
        })
        this.root.remove()
        this.is_render = false
    }
}

/**
 *  simple_carousel.js
 *  ------------------
 *
 *  Fichier contenant la classe qui permet de gérer les carousel.
 *  @author Ronald Tchuekou
 */

class SimpleCarousel {
    slidesToScroll
    slidesVisible

    /**
     * @callback slideCallback
     * @param {Number} index
     */

    /**
     * @param {HTMLElement} element Element html sur le quel le carousel sera injecter.
     * @param {Object} options Options à appliquer sur le carrousel.
     * @param {Number} [options.slidesToScroll=1] Nombre d'élément à scroller.
     * @param {Number} [options.slidesVisible=1] Nombre d'élément visible.
     * @param {Boolean} [options.looping=false] Bouclé les slides du carousel.
     * @param {Boolean} [options.infinite=false] Bouclé les slides du carousel de manière infini.
     * @param {Boolean} [options.pagination=true] Pagination du carousel.
     * @param {Boolean} [options.navigation=true] Navigation du carousel.
     * @param {Number} [options.timer=0] Nombre de milliseconde pour afficher le slide suivant.
     */
    constructor(element, options = {}) {
        this.element = element
        this.options = Object.assign(
            {},
            {
                slidesToScroll: 1,
                slidesVisible: 1,
                looping: false,
                infinite: false,
                pagination: true,
                timer: 0,
                navigation: true,
            },
            options
        )
        this.slidesToScroll = this.options.slidesToScroll
        this.slidesVisible = this.options.slidesVisible
        this.setExceptions(element)
        this.slideCallbacks = []
        this.paginates = []
        this.currentItem = 0
        this.isMobile = false
        if (element === undefined) {
            console.error('Indiquer un élément du document pour le carousel.', element)
            return
        }
        let childrens = [].slice.call(element.children) // Récuperation des enfants au moment de l'execution du script.

        // Manipulation du dom.
        this.root = this.createDivWithClass('simple__carousel')
        this.container = this.createDivWithClass('carousel__container')
        this.root.appendChild(this.container)
        this.root.setAttribute('tabindex', '0')
        this.element.appendChild(this.root)
        this.pagination = this.createDivWithClass('carousel__pagination')
        this.root.appendChild(this.pagination)
        this.items = childrens.map((child) => {
            let item = this.createDivWithClass('carousel__item')
            item.appendChild(child)
            return item
        })
        if (this.options.infinite) {
            this.options = { ...this.options, pagination: false }
            this.offset = this.options.slidesVisible + this.options.slidesToScroll
            if (this.offset > childrens.length) {
                console.error("Le nombre d'élément dans le carousel est insufisant pour le slide infini.", element)
            }
            this.items = [
                ...this.items.slice(this.items.length - this.offset).map((item) => item.cloneNode(true)),
                ...this.items,
                ...this.items.slice(0, this.offset).map((item) => item.cloneNode(true)),
            ]
            this.gotToItem(this.offset, false)
        }
        this.items.forEach((item) => this.container.appendChild(item))
        this.setStyles()
        this.createNavigations()
        this.createPaginations()

        // Gestion des evenements.
        this.slideCallbacks.forEach((callback) => callback(this.currentItem))
        this.onWindowResize()
        window.addEventListener('resize', this.onWindowResize.bind(this))
        this.root.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'Right') {
                this.next()
            } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
                this.previos()
            }
        })
        if (this.options.infinite) {
            this.container.addEventListener('transitionend', this.resetInfinite.bind(this))
        }

        // Timer
        if (this.options.timer > 0) {
            this.timeOut = setInterval(() => {
                this.next()
            }, this.options.timer)
        }
    }

    /**
     * Pour la gesiton des exceptions.
     * @param {HTMLElement} element
     */
    setExceptions(element) {
        let { slidesToScroll, slidesVisible, timer, looping, infinite, pagination } = this.options

        if (slidesToScroll === undefined) {
            console.error("L'attribute 'slidesToScroll' n'est pas défini : ", element)
        } else if (typeof slidesToScroll != 'number') {
            console.error("Le type de l'attribute 'slidesToScroll' doit être un number : ", element)
        }

        if (slidesVisible === undefined) {
            console.error("L'attribute 'slidesVisible' n'est pas défini : ", element)
        } else if (typeof slidesVisible != 'number') {
            console.error("Le type de l'attribute 'slidesVisible' doit être un number : ", element)
        }

        if (timer === undefined) {
            console.error("L'attribute 'timer' n'est pas défini : ", element)
        } else if (typeof timer != 'number') {
            console.error("Le type de l'attribute 'timer' doit être un number : ", element)
        }

        if (looping === undefined) {
            console.error("L'attribute 'looping' n'est pas défini : ", element)
        } else if (typeof looping != 'boolean') {
            console.error("Le type de l'attribute 'looping' doit être un boolean : ", element)
        }

        if (infinite === undefined) {
            console.error("L'attribute 'infinite' n'est pas défini : ", element)
        } else if (typeof infinite != 'boolean') {
            console.error("Le type de l'attribute 'infinite' doit être un boolean : ", element)
        }

        if (pagination === undefined) {
            console.error("L'attribute 'pagination' n'est pas défini : ", element)
        } else if (typeof pagination != 'boolean') {
            console.error("Le type de l'attribute 'pagination' doit être un boolean : ", element)
        }
    }

    /**
     * Appliquer les bonnes dimensions au items du carousel.
     */
    setStyles() {
        let ratio = this.items.length / this.slidesVisible
        this.container.style.width = ratio * 100 + '%'
        this.items.forEach((item) => (item.style.width = 100 / this.slidesVisible / ratio + '%'))
    }

    /**
     * Ajout des boutons de navigations sur le carousel.
     */
    createNavigations() {
        if (!this.options.navigation) return
        let nextButton = this.createDivWithClass('carousel__next')
        nextButton.innerHTML = '<i class="arrow right"></i>'
        let prevButton = this.createDivWithClass('carousel__prev')
        prevButton.innerHTML = '<i class="arrow left"></i>'
        this.root.appendChild(nextButton)
        this.root.appendChild(prevButton)
        nextButton.addEventListener('click', this.next.bind(this))
        prevButton.addEventListener('click', this.previos.bind(this))
        this.onSlide((index) => {
            if (!this.options.looping) {
                if (index == 0) {
                    prevButton.classList.add('carousel__btn_hide')
                } else {
                    prevButton.classList.remove('carousel__btn_hide')
                }
                if (this.items[this.currentItem + this.slidesToScroll] === undefined) {
                    nextButton.classList.add('carousel__btn_hide')
                } else {
                    nextButton.classList.remove('carousel__btn_hide')
                }
            }
            this.setPaginate()
        })
    }

    /**
     * Pagination du carousel.
     */
    createPaginations() {
        if (this.options.pagination) {
            this.paginates = []
            let position = 0
            let c = Math.ceil(this.items.length / this.slidesToScroll)
            if (c > 1)
                for (let i = 1; i <= c; i++) {
                    let pagination_item = this.createDivWithClass('carousel__pagination-item')
                    pagination_item.setAttribute('data-position', '' + position)
                    pagination_item.addEventListener('click', this.onPaginate.bind(this))
                    this.paginates.push(pagination_item)
                    position += this.slidesToScroll
                }
        }
        this.setPaginate()
    }

    /**
     * Au clique sur une pagination.
     * @param {MouseEvent} event
     */
    onPaginate(event) {
        let position = event.currentTarget.dataset.position
        this.gotToItem(position)
    }

    /**
     * Pagination courante.
     */
    setPaginate() {
        if (this.options.pagination) {
            this.pagination.innerHTML = ''
            this.paginates.forEach((item, position) => {
                if (this.currentItem / this.slidesToScroll === position) {
                    item.classList.add('current')
                } else {
                    item.classList.remove('current')
                }
                this.pagination.appendChild(item)
            })
        }
    }

    /**
     * Partir à l'item suivant.
     */
    next() {
        let position = this.currentItem + this.slidesToScroll
        if (position >= this.items.length || (this.items[position] === undefined && position > this.currentItem))
            if (this.options.looping) {
                position = 0
            } else {
                return
            }
        this.gotToItem(position)
    }

    /**
     * Revenir à l'item précedant.
     */
    previos() {
        let position = this.currentItem - this.slidesToScroll
        if (position < 0)
            if (this.options.looping) {
                position = this.items.length - this.slidesToScroll
            } else {
                return
            }
        this.gotToItem(position)
    }

    /**
     * Déplacer l'item courant vers l'item ciblé.
     * @param {Number} index
     * @param {Boolean} animate
     */
    gotToItem(index, animate = true) {
        let translateX = (index * -100) / this.items.length
        if (!animate) {
            this.container.style.transition = 'none'
        }
        this.container.style.transform = 'translate3d(' + translateX + '%, 0, 0)'
        this.container.offsetHeight // Forcé le repaint, pour annuler les animations.
        if (!animate) {
            this.container.style.transition = ''
        }
        this.currentItem = index
        this.slideCallbacks.forEach((callback) => callback(index))
    }

    /**
     * Déplacer le carousel pour donner l'impression d'un slide infini.
     */
    resetInfinite() {
        if (this.currentItem <= this.options.slidesToScroll) {
            this.gotToItem(this.currentItem + this.items.length - 2 * this.offset, false)
        } else if (this.currentItem >= this.items.length - this.offset) {
            this.gotToItem(this.currentItem - (this.items.length - 2 * this.offset), false)
        }
    }

    /**
     *
     * @param {slideCallback} callback
     */
    onSlide(callback) {
        this.slideCallbacks.push(callback)
    }

    onWindowResize() {
        let mobile = window.innerWidth < 800
        if (mobile && mobile !== this.isMobile) {
            this.isMobile = mobile
            this.slidesVisible = 1
            this.slidesToScroll = 1
            this.setStyles()
            this.createPaginations()
            this.slideCallbacks.forEach((cb) => cb(this.currentItem))
            this.gotToItem(0)
        } else if (!mobile) {
            this.isMobile = false
            this.slidesVisible = this.options.slidesVisible
            this.slidesToScroll = this.options.slidesToScroll
            this.setStyles()
            this.createPaginations()
            this.slideCallbacks.forEach((cb) => cb(this.currentItem))
            this.gotToItem(0)
        }
    }

    /**
     * @param {String} className
     * @returns {HTMLElement}
     */
    createDivWithClass(className) {
        let div = document.createElement('div')
        div.setAttribute('class', className)
        return div
    }

    /**
     * @returns {Number}
     */
    get slidesToScroll() {
        return this.isMobile ? 1 : this.options.slidesToScroll
    }

    /**
     * @returns {Number}
     */
    get slidesVisible() {
        return this.isMobile ? 1 : this.options.slidesVisible
    }
}

/**
 * @param {HTLMElement} element
 * @param {number} visible
 * @param {number} scroll
 * @returns SimpleCarousel
 */
function initDrawer(element, visible = 3, scroll = 3) {
    console.log('Element => ', element)
    let d = new SimpleCarousel(element, {
        slidesVisible: visible,
        slidesToScroll: scroll,
        infinite: false,
        looping: true,
        navigation: true,
        timer: 7000,
    })
    return d
}

console.log('Content is init.')
