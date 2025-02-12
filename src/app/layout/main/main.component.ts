import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CategoryComponent } from '../../feature/category/view/category/category.component';
import { MatDividerModule } from '@angular/material/divider';
import { TaskComponent } from '../../feature/task/view/task/task.component';

const COMPONENTS = [CategoryComponent, TaskComponent];

const MODULES = [MatDividerModule];

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [...COMPONENTS, ...MODULES],
  template: `
    <div class="h-screen flex w-full border-4 border-blue-700">
      <!--- Categorias --->
      <app-category class="w-1/4" />
      <!--- Divisor --->
      <mat-divider class="h-full opacity-50" vertical />
      <!--- Tarefas --->
      <app-task class="w-3/4" />
    </div>
  `,
  styles: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent {

  /* -- Alterar para standalone: false, pois será atualizado para versão 19. */
}
