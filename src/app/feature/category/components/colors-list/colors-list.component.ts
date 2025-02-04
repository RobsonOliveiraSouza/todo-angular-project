import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';

const MODULES = [MatDividerModule];

@Component({
  selector: 'app-colors-list',
  standalone: true,
  imports: [...MODULES],
  template: `
    <section class="flex flex-col gap-4 w-full"></section>
      <!-- Divisor -->
      <mat-divider class="h-full opacity-50" />
      <!-- Lista de cores -->
       
       <span>colors list... </span>
  `,
  styles: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorsListComponent { }
