import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditTagPageRoutingModule } from './edit-tag-routing.module';

import { EditTagPage } from './edit-tag.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditTagPageRoutingModule
  ],
  declarations: [EditTagPage]
})
export class EditTagPageModule {}
