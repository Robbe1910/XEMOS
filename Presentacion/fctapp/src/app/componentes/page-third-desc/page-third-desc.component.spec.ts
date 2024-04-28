import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageThirdDescComponent } from './page-third-desc.component';

describe('PageThirdDescComponent', () => {
  let component: PageThirdDescComponent;
  let fixture: ComponentFixture<PageThirdDescComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageThirdDescComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageThirdDescComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
