import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MainListComponent } from '../../components/main-list/main-list.component';
import { ColorsListComponent } from '../../components/colors-list/colors-list.component';
import { CategoryService } from '../../services/category.service';

const COMPONENTS = [MainListComponent, ColorsListComponent];

@Component({
  selector: 'app-category',
  imports: [...COMPONENTS],
  template: `
      <div class="flex flex-col h-full w-full p-4 md:p-6 lg:p-8 xl:p-10 max-w-7xl mx-auto">
        <!-- Lista de Categorias -->
        <app-main-list class="flex-grow" />

        <!-- Lista de Cores -->
        <app-colors-list class="mt-auto" />
      </div>
  `,
  styles: '',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryComponent {
  private readonly categoryService = inject(CategoryService);
}
