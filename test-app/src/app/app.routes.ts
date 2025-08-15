import { Routes } from '@angular/router';
import { CpuComponent } from './cpu/cpu.component';

export const routes: Routes = [
  { path: '**', redirectTo: 'test', pathMatch: 'full' },
  {
    path: 'test',
    component: CpuComponent,
    title: 'Monitor de CPU y RAM',
  },
];
