import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicApp } from './dynamic-app';

describe('DynamicComponent', () => {
  let component: DynamicApp;
  let fixture: ComponentFixture<DynamicApp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicApp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicApp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
