import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core'

declare const initDrawer: any

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
    @ViewChild('testimonies') testimonies: any
    @ViewChild('conseillers') conseillers: any
    @ViewChild('places') places: any

    constructor() {}

    ngAfterViewInit(): void {
        initDrawer(this.testimonies.nativeElement)
        initDrawer(this.conseillers.nativeElement, 5, 5)
        initDrawer(this.places.nativeElement, 4, 4)
    }

    ngOnInit(): void {}
}
