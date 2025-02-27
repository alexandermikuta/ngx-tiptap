import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TiptapDraggableDirective } from './draggable.directive';

@Component({
  template: '<div tiptapDraggable>Hello Tiptap!</div>',
  imports: [TiptapDraggableDirective],
})
class TestComponent { }

describe('DraggableDirective', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [TestComponent,
        TiptapDraggableDirective],
    });

    await TestBed.compileComponents();

    fixture = TestBed.createComponent(TestComponent);

    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = new TiptapDraggableDirective();
    expect(directive).toBeTruthy();
  });

  it('should add the attributes correctly', () => {
    expect(fixture.debugElement.query(By.css('[data-drag-handle]'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('[draggable]'))).toBeTruthy();
  });
});
