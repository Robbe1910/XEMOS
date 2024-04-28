import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subportada } from './subportada';

describe('Page1Component', () => {
  let component: Subportada;
  let fixture: ComponentFixture<Subportada>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Subportada ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Subportada);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
