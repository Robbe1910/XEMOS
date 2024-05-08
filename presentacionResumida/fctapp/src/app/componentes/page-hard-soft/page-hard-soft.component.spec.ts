import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageHardSoftComponent } from './page-hard-soft.component';

describe('PageHardSoftComponent', () => {
  let component: PageHardSoftComponent;
  let fixture: ComponentFixture<PageHardSoftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageHardSoftComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageHardSoftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
