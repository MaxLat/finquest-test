import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { UserLibRouterModule } from './users-lib-routing.module';
import { UsersLibComponent } from './components/users/users-lib.component';
import { HttpClientModule } from '@angular/common/http';
import { UsersDetailComponent } from './components/user-detail/user-detail.component';
import { CommonModule, DatePipe } from '@angular/common';
import { NgbdSortableHeader } from './directives/sort-header-directive';
import { ToastrModule } from 'ngx-toastr';
import { HomeComponent } from './components/home/home.component';



@NgModule({
  declarations: [
    UsersLibComponent,
    UsersDetailComponent,
    NgbdSortableHeader,
    HomeComponent
  ],
  imports: [
    UserLibRouterModule,ReactiveFormsModule,FormsModule,CommonModule,HttpClientModule,ToastrModule.forRoot()
  ],
  exports: [
    UsersLibComponent
  ],
  providers : [
    DatePipe
  ]
})
export class UsersLibModule {

  public static forRoot(environment: any): ModuleWithProviders<any> {

    return {
        ngModule: UsersLibModule,
        providers: [
            {
                provide: 'env',
                useValue: environment
            }
        ]
    };
}

 }
