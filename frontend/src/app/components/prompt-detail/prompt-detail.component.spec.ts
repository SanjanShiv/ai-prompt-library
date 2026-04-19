import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptDetailComponent } from './prompt-detail.component';

describe('PromptDetailComponent', () => {
  let component: PromptDetailComponent;
  let fixture: ComponentFixture<PromptDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromptDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromptDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
