import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditTagPage } from './edit-tag.page';

const routes: Routes = [
  {
    path: '',
    component: EditTagPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditTagPageRoutingModule {}
