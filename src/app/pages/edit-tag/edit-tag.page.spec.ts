import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditTagPage } from './edit-tag.page';

describe('EditTagPage', () => {
  let component: EditTagPage;
  let fixture: ComponentFixture<EditTagPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTagPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
