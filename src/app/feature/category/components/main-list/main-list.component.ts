import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-main-list',
  standalone: true,
  imports: [],
  template: `
    <section class="mt-16 mx-12 pl-8">
      <span class="text-2xl font-semibold">Categorias</span>

      <ul>
        @for (category of categories(); track category.id) {
          <li class="text-xl font-medium">{{ category.name }}</li>
        }
      </ul>
    </section>
  `,
  styles: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainListComponent {
  private readonly categoryService = inject(CategoryService);

  public categories = this.categoryService.categories;

  constructor() {
    this.categoryService.getCategories().subscribe();

    effect(() => {
      console.log('Categorias carregadas:', this.categories());
    });
  }
}
