import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Content, Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { TiptapEditorDirective } from 'ngx-tiptap';

@Component({
  selector: 'app-simple-editor',
  imports: [CommonModule, FormsModule, TiptapEditorDirective],
  templateUrl: './simple-editor.component.html',
  styleUrls: ['./simple-editor.component.css'],
})
export class SimpleEditorComponent implements OnDestroy {
  value: Content = `Beispiel Rich-Text...`;

  editor = new Editor({
    extensions: [
      StarterKit,
      Placeholder,
    ],
    editorProps: {
      attributes: {
        class: 'p-2 border-black border-2 outline-none h-96',
        spellCheck: 'false',
      },
    },
  });

  handleValueChange(value: Content): void {
    this.value = value;
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
