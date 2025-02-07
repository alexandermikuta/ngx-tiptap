import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Content, Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import CharacterCount from '@tiptap/extension-character-count'
import Placeholder from '@tiptap/extension-placeholder';
import TextStyle from '@tiptap/extension-text-style';
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import AutoJoiner from 'tiptap-extension-auto-joiner'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { Color }from '@tiptap/extension-color';
import { TiptapEditorDirective } from 'ngx-tiptap';

@Component({
  selector: 'app-simple-editor',
  imports: [CommonModule, FormsModule, TiptapEditorDirective],
  templateUrl: './simple-editor.component.html',
  styleUrls: ['./simple-editor.component.css'],
})
export class SimpleEditorComponent implements OnDestroy {
  value: Content = `<h2>Heading</h2>
        <p style="text-align: center">first paragraph</p>
        <p style="text-align: right">second paragraph</p>`;

  characterLimit = 4000

  editor = new Editor({
    extensions: [
      StarterKit,
      AutoJoiner,
      Placeholder,
      TextStyle,
      Color,
      Image,
      Subscript,
      Superscript,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      CharacterCount.configure({
        limit: this.characterLimit,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
        protocols: ['http', 'https'],
        isAllowedUri: (url, ctx) => {
          try {
            // construct URL
            const parsedUrl = url.includes(':') ? new URL(url) : new URL(`${ctx.defaultProtocol}://${url}`)

            // use default validation
            if (!ctx.defaultValidate(parsedUrl.href)) {
              return false
            }

            // disallowed protocols
            const disallowedProtocols = ['ftp', 'file', 'mailto']
            const protocol = parsedUrl.protocol.replace(':', '')

            if (disallowedProtocols.includes(protocol)) {
              return false
            }

            // only allow protocols specified in ctx.protocols
            const allowedProtocols = ctx.protocols.map(p => (typeof p === 'string' ? p : p.scheme))

            if (!allowedProtocols.includes(protocol)) {
              return false
            }

            // disallowed domains
            const disallowedDomains = ['example-phishing.com', 'malicious-site.net']
            const domain = parsedUrl.hostname

            if (disallowedDomains.includes(domain)) {
              return false
            }

            // all checks have passed
            return true
          } catch {
            return false
          }
        },
        shouldAutoLink: url => {
          try {
            // construct URL
            const parsedUrl = url.includes(':') ? new URL(url) : new URL(`https://${url}`)

            // only auto-link if the domain is not in the disallowed list
            const disallowedDomains = ['example-no-autolink.com', 'another-no-autolink.com']
            const domain = parsedUrl.hostname

            return !disallowedDomains.includes(domain)
          } catch {
            return false
          }
        },

      }),
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

  public setLink = () => {
    const previousUrl = this.editor.getAttributes('link')["href"]
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      this.editor.chain().focus().extendMarkRange('link').unsetLink()
        .run()

      return
    }

    // update link
    try {
      this.editor.chain().focus().extendMarkRange('link').setLink({ href: url })
        .run()
    } catch (e: any) {
      alert(e.message)
    }
  }

  handleValueChange(value: Content): void {
    this.value = value;
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
