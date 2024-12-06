import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditTagPageRoutingModule } from './edit-tag-routing.module';

import { EditTagPage } from './edit-tag.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditTagPageRoutingModule,
    SharedModule
  ],
  declarations: [EditTagPage]
})
export class EditTagPageModule {}
