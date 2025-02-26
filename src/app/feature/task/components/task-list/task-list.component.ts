import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { NoTasksComponent } from '../no-tasks/no-tasks.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-task-list',
  imports: [AsyncPipe, NoTasksComponent],
  template: `
    <div class="mt-8">
      @if (tasks$ | async) {
        @if (numberOfTasks() > 0) {
          @for (task of tasks(); track task.id) {
            <div class="flex flex-row justify-start mb-b items-center gap-4">
              <span>{{ task.title }}</span>
              <!-- <app-updade-task /> -->
              <!-- <app-delete-task /> -->
            </div>
          }
        } @else {
          <app-no-tasks 
            alt="Nenhuma tarefa adicionada!" 
            imageUrl="no_data.svg" 
            message="Nenhuma tarefa adicionada!"/>
        }
      }
    </div>
  `,
  styles: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListComponent { 

  private taskService = inject(TaskService);

  public tasks$ = this.taskService.getTasks();

  public tasks = this.taskService.tasks;

  public numberOfTasks = this.taskService.numberOfTasks;
}
