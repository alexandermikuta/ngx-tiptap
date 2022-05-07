import {
  AfterViewInit, ChangeDetectorRef, Directive,
  ElementRef, forwardRef, Input, OnInit, Renderer2,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Content, Editor, JSONContent } from '@tiptap/core';
import type { Transaction } from 'prosemirror-state';

@Directive({
  selector: 'tiptap[editor], [tiptap][editor], tiptap-editor[editor], [tiptapEditor][editor]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => EditorDirective),
    multi: true,
  }],
})

export class EditorDirective implements OnInit, AfterViewInit, ControlValueAccessor {
  @Input() editor!: Editor;
  @Input() outputFormat: 'json' | 'html' = 'html';

  constructor(
    private elRef: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  private onChange: (value: Content) => void = () => { /** */ };
  private onTouched: () => void = () => { /** */ };

  // Writes a new value to the element.
  // This methods is called when programmatic changes from model to view are requested.
  writeValue(value: Content): void {
    if (!this.outputFormat && typeof value === 'string') {
      this.outputFormat = 'html';
    }

    this.editor.chain().setContent(value, false).run();
  }

  // Registers a callback function that is called when the control's value changes in the UI.
  registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  // Registers a callback function that is called by the forms API on initialization to update the form model on blur.
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Called by the forms api to enable or disable the element
  setDisabledState(isDisabled: boolean): void {
    this.editor.setEditable(!isDisabled);
    this.renderer.setProperty(this.elRef.nativeElement, 'disabled', isDisabled);
  }

  private handleChange = ({ transaction }: { transaction: Transaction }): void => {
    if (!transaction.docChanged) {
      return;
    }

    if (this.outputFormat === 'html') {
      this.onChange(this.editor.getHTML());
      return;
    }

    this.onChange(this.editor.getJSON() as JSONContent);
  };

  ngOnInit(): void {
    if (!this.editor) {
      throw new Error('Required: Input `editor`');
    }

    // take the inner contents and clear the block
    const { innerHTML } = this.elRef.nativeElement;
    this.elRef.nativeElement.innerHTML = '';

    // insert the editor in the dom
    this.elRef.nativeElement.append(...Array.from(this.editor.options.element.childNodes));

    // update the options for the editor
    this.editor.setOptions({ element: this.elRef.nativeElement });

    // update content to the editor
    if (innerHTML) {
      this.editor.chain().setContent(innerHTML, false).run();
    }

    // register blur handler to update `touched` property
    this.editor.on('blur', () => {
      this.onTouched();
    });

    // register transaction handler to emit changes on update
    this.editor.on('transaction', this.handleChange);
  }

  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
  }
}
