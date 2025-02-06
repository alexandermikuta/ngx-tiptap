import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Content, Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TextStyle from '@tiptap/extension-text-style';
import Image from '@tiptap/extension-image'
import { Color }from '@tiptap/extension-color';
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
      TextStyle,
      Color,
      Image

    ],
    editorProps: {
      attributes: {
        class: 'p-2 border-black border-2 outline-none h-96 overflow-auto resize-y',
        spellCheck: 'false',
      },
    },
  });

  public addImage = () => {
    const url = window.prompt('URL')

    if (url) {
      this.editor.chain().focus().setImage({ src: url }).run()
    }
  };

  handleValueChange(value: Content): void {
    this.value = value;
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
