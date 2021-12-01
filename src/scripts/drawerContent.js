/**
 * Pour la gestion des conteneurs drawer.
 * @author Ronald Tchuekou
 * @email ronaldtchuekou@gmail.com
 */
export default class DrawerContent {
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
            return item
        })
        this.items.forEach((item) => this.container.appendChild(item))
    }
}
