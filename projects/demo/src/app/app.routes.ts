import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./simple-editor/simple-editor.component').then((m) => m.SimpleEditorComponent),
    title: 'Simple Editor',
  },
];
