import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { InclusionFormComponent } from "../../components/inclusion-form/inclusion-form.component";
import { TaskService } from '../../services/task.service';
import { categoryIdBackgroundColors } from '../../../category/constants/category-colors';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../category/services/category.service';
import { Task } from '../../model/task.model';

const MODULES = [CommonModule];

@Component({
    selector: 'app-task',
    imports: [InclusionFormComponent, MODULES],
    template: `
        <div class="flex flex-col mx-12 mt-10">
            
            <span class="font-bold text-4xl ">Meu quadro de tarefas!</span>
            
            <app-inclusion-form></app-inclusion-form>

            <div class="mt-6">
                <span class="text-2xl font-semibold">Tarefas:</span>

                <ul class="flex flex-col items-start w-full ">
                @for (task of tasks(); track task.id) {
                    <li class="p-2 h-10 border rounded-md shadow flex justify-between items-center text-sm w-1/2 max-w-[50%]">
                        <div class="flex items-center">
                            <span [class.line-through]="task.isCompleted" class="text-sm">
                            {{ task.title }}
                            </span>

                            <span class="ml-2 px-1 py-0.5 text-white text-xs rounded"
                                [ngClass]="getCategoryClass(task)">
                            {{ getCategoryName(task) }}
                            </span>
                        </div>

                        <div class="flex gap-2">
                            <button (click)="toggleTaskStatus(task)" class="px-2 py-0.5 bg-blue-500 text-white rounded text-xs">
                            {{ task.isCompleted ? 'Reabrir' : 'Concluir' }}
                            </button>

                            <button (click)="deleteTask(task.id)" class="px-2 py-0.5 bg-red-500 text-white rounded text-xs">
                            Excluir
                            </button>
                        </div>
                    </li>

                }
                </ul>

            </div>

        </div>
    `,
    styles: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskComponent {
    private taskService = inject(TaskService);
    private categoryService = inject(CategoryService);
  
    public tasks = this.taskService.tasks;
    public categories = this.categoryService.categories;

    constructor() {
        this.taskService.getTasks().subscribe(tasks => {
            this.taskService.tasks.set(tasks);
        });
    }

    toggleTaskStatus(task: Task): void {
        this.taskService.updateIsCompletedStatus(task.id, !task.isCompleted).subscribe(updatedTask => {
            this.taskService.updateATaskInTheTasksList(updatedTask);
        });
    }      
  
    public categoryMap = computed(() =>
      this.categories().reduce((map, category) => {
        map[category.id] = category;
        return map;
      }, {} as Record<string, { name: string; color: string }>)
    );
  
    public getCategoryClass(task: Task) {
      return categoryIdBackgroundColors[task.categoryId] || 'bg-gray-500';
    }
  
    public getCategoryName(task: Task): string {
        const categoryMapValue = this.categoryMap();
        return categoryMapValue[task.categoryId]?.name ?? 'Desconhecida';
    }

    deleteTask(taskId: string): void {
        if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
          this.taskService.deleteTask(taskId).subscribe();
        }
      }      
}
