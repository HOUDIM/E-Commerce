import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionsAdminComponent } from './promotions-admin.component';

describe('PromotionsAdminComponent', () => {
  let component: PromotionsAdminComponent;
  let fixture: ComponentFixture<PromotionsAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PromotionsAdminComponent]
    });
    fixture = TestBed.createComponent(PromotionsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
