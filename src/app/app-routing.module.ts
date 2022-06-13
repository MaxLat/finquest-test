import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HowtoComponent } from './howto/howto.component';

const routes: Routes = [
  {
    path : '',
    pathMatch : 'full',
    loadChildren : () => import('../../projects/users-lib/src/lib/users-lib.module').then(m => m.UsersLibModule)
  },
  {
    path :'howto',
    pathMatch : 'full',
    component : HowtoComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
