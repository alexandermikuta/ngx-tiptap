import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { AngularNodeViewComponent, DraggableDirective } from 'ngx-tiptap';

@Component({
  selector: 'app-nodeview-counter',
  standalone: true,
  imports: [CommonModule, DraggableDirective],
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.css'],
})

export class NodeviewCounterComponent extends AngularNodeViewComponent {
  increment(): void {
    this.updateAttributes({
      count: this.node.attrs['count'] + 1,
    });
  }
}
