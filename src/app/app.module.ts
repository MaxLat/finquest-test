import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UsersLibModule } from 'projects/users-lib/src/public-api';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MainComponent } from './main/main.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HowtoComponent } from './howto/howto.component';
import { environment } from 'src/environments/environment';


@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    NavbarComponent,
    MainComponent,
    HowtoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UsersLibModule.forRoot(environment),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
