import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TaskService } from '../../../task/services/task.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 mx-auto">
      <span class="block text-xl sm:text-2xl md:text-3xl mt-10 font-semibold text-center">
        Dias da Semana
      </span>

      <ul class="mt-16 flex justify-center gap-4 flex-wrap">
        @for (day of daysOfWeek; track $index) {
          <li>
            <button 
              (click)="toggleFilterByDay($index)" 
              class="w-52 h-12 px-6 py-2 rounded-lg bg-blue-500 text-white text-lg font-medium
                    hover:bg-blue-700 transition-all duration-200
                    [class.bg-gray-500]='selectedDay() === $index'">
              {{ day }}
            </button>
          </li>
        }
      </ul>
    </section>
  `,
  styles: '',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainListComponent {
  private readonly taskService = inject(TaskService);

  public daysOfWeek = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

  public selectedDay = signal<number | null>(null);

  toggleFilterByDay(day: number) {
    if (this.selectedDay() === day) {
      this.selectedDay.set(null);
      this.taskService.clearDayFilter();
    } else {
      this.selectedDay.set(day);
      this.taskService.filterTasksByDay(day);
    }
  }
}
