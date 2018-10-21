import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NameSelectorDialogComponent } from './name-selector-dialog.component';

describe('NameSelectorDialogComponent', () => {
  let component: NameSelectorDialogComponent;
  let fixture: ComponentFixture<NameSelectorDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NameSelectorDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NameSelectorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
