import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tiptapDraggable]',
  standalone: true,
})
export class DraggableDirective {
  @HostBinding('attr.draggable') draggable = true;
  @HostBinding('attr.data-drag-handle') handle = '';
}
