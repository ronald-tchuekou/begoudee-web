import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AteliersComponent } from './ateliers.component';

describe('AteliersComponent', () => {
  let component: AteliersComponent;
  let fixture: ComponentFixture<AteliersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AteliersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AteliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
