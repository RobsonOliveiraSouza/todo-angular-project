import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-main-list',
  imports: [],
  template: `
    <section class="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 mx-auto">
      <span class="block text-xl sm:text-2xl md:text-3xl font-semibold text-center">
        Categorias
      </span>

      <ul class="mt-6 space-y-4 text-center">
        @for (category of categories(); track category.id) {
          <li class="text-lg sm:text-xl md:text-2xl font-medium">
            {{ category.name }}
          </li>
        }
      </ul>
    </section>
  `,
  styles: '',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainListComponent {
  private readonly categoryService = inject(CategoryService);

  public categories = this.categoryService.categories
}
