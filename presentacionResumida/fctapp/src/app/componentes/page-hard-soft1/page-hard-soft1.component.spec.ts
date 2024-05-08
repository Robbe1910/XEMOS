import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageHardSoft1Component } from './page-hard-soft1.component';

describe('PageHardSoft1Component', () => {
  let component: PageHardSoft1Component;
  let fixture: ComponentFixture<PageHardSoft1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageHardSoft1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageHardSoft1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
