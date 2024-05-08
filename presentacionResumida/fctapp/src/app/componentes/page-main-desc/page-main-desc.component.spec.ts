import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageMainDescComponent } from './page-main-desc.component';

describe('PageMainDescComponent', () => {
  let component: PageMainDescComponent;
  let fixture: ComponentFixture<PageMainDescComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageMainDescComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageMainDescComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
