import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component'
import { BannerComponent } from './components/banner/banner.component'
import { HomeComponent } from './pages/home/home.component'
import { ProgrammesComponent } from './pages/programmes/programmes.component'
import { AteliersComponent } from './pages/ateliers/ateliers.component'
import { Route, RouterModule } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component'

const ROUTES: Route[] = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'programmes', component: ProgrammesComponent },
    { path: 'ateliers', component: AteliersComponent },
]

@NgModule({
    declarations: [
        AppComponent,
        NavBarComponent,
        BannerComponent,
        HomeComponent,
        ProgrammesComponent,
        AteliersComponent,
        FooterComponent,
    ],
    imports: [BrowserModule, AppRoutingModule, RouterModule.forRoot(ROUTES)],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
