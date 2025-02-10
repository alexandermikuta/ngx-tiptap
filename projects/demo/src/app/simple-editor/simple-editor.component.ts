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
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import Highlight from '@tiptap/extension-highlight'
import { Color }from '@tiptap/extension-color';
import OfficePaste from '@intevation/tiptap-extension-office-paste';
import { TiptapEditorDirective } from 'ngx-tiptap';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {  remixListUnordered, remixLink, remixParagraph, remixFileImageLine, remixBold, remixItalic, remixUnderline, remixMarkPenLine, remixH1, remixSubscript, remixSuperscript, remixAlignCenter, remixAlignLeft, remixAlignRight, remixQuoteText, remixReplyFill, remixRepeatFill, remixCodeLine, remixCodeBlock, remixStrikethrough } from '@ng-icons/remixicon';
@Component({
  selector: 'app-simple-editor',
  imports: [CommonModule, FormsModule, TiptapEditorDirective, NgIcon],
  providers: [provideIcons({remixListUnordered, remixParagraph, remixFileImageLine, remixMarkPenLine, remixH1, remixSubscript, remixSuperscript, remixAlignCenter, remixAlignLeft, remixAlignRight, remixQuoteText, remixReplyFill, remixRepeatFill, remixCodeLine, remixCodeBlock, remixBold, remixItalic,  remixStrikethrough, remixUnderline, remixLink })],
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
      OfficePaste,
      Highlight,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
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
