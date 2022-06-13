import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { UsersDetailComponent } from './components/user-detail/user-detail.component';
import { UsersLibComponent } from './components/users/users-lib.component';

const routes: Routes = [
    { path: '', pathMatch :'full' ,component: HomeComponent },
    { path: 'users', component: UsersLibComponent },
    { path: 'user/details/:id', component : UsersDetailComponent}
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserLibRouterModule { }