import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSecondaryDescComponent } from './page-secondary-desc.component';

describe('PageSecondaryDescComponent', () => {
  let component: PageSecondaryDescComponent;
  let fixture: ComponentFixture<PageSecondaryDescComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageSecondaryDescComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageSecondaryDescComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
