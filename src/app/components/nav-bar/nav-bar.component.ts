import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
    show: boolean = false
    show_phone_menu: boolean = false
    sub_menu: number = -1

    constructor() {}

    ngOnInit(): void {}

    toggleMenu(): void {
        this.show = !this.show
    }

    setSubMenu(position: number): void {
        this.sub_menu = position
    }

    showPhoneMenu(): void {
        this.show_phone_menu = true
    }

    hidPhoneMenu(): void {
        this.show_phone_menu = false
        this.sub_menu = -1
    }

    hideMenu(): void {
        this.show = false
    }
}
