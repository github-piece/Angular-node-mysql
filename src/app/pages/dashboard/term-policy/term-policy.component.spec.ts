import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermPolicyComponent } from './term-policy.component';

describe('TermPolicyComponent', () => {
  let component: TermPolicyComponent;
  let fixture: ComponentFixture<TermPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
