import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullSchemaComponent } from './full-schema.component';

describe('FullSchemaComponent', () => {
  let component: FullSchemaComponent;
  let fixture: ComponentFixture<FullSchemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullSchemaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullSchemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
