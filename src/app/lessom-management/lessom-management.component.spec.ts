import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessomManagementComponent } from './lessom-management.component';

describe('LessomManagementComponent', () => {
  let component: LessomManagementComponent;
  let fixture: ComponentFixture<LessomManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessomManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessomManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
