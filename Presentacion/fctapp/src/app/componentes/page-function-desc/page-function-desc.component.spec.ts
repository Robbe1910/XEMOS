import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageFunctionDescComponent } from './page-function-desc.component';

describe('PageFunctionDescComponent', () => {
  let component: PageFunctionDescComponent;
  let fixture: ComponentFixture<PageFunctionDescComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageFunctionDescComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageFunctionDescComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
