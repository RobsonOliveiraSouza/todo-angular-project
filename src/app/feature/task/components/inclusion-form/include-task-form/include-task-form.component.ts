import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { CategoryService } from '../../../../category/services/category.service';
import { createTaskForm } from '../../../constants/create-task-form';
import { Task } from '../../../model/task.model';
import { TaskService } from '../../../services/task.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const MODULES = [
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  FormsModule,
  ReactiveFormsModule,
];


@Component({
  selector: 'app-include-task-form',
  imports: [...MODULES],
  template: `
    <form autocomplete="off" class="flex flex-row gap-2 select-none" [formGroup]="newTaskForm">
      <mat-form-field class="w-full">
        <mat-label>Tarefa</mat-label>
        <input 
          formControlName="title" 
          matInput 
          placeholder="Adicionar tarefa" (keyup.enter)="onEnterToAddATask()" />
        <mat-hint class="text-tertiary">Aperte enter para adicionar</mat-hint>
      </mat-form-field>

      <mat-form-field>
        <mat-label>Categoria</mat-label>
        <mat-select 
          formControlName="categoryId" 
          (selectionChange)="selectionChangeHandler($event)" (keyup.enter)="onEnterToAddATask()">
          @for(category of categories(); track category.id){
            <mat-option value="{{ category.id }}">{{ category.name }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
    </form>
  `,
  styles: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncludeTaskFormComponent {

  private readonly categoryService = inject(CategoryService);

  private readonly taskService = inject(TaskService);

  public readonly categories = this.categoryService.categories;

  public newTaskForm = createTaskForm();

  public destroy$ = inject(DestroyRef);

  public selectionChangeHandler(event: MatSelectChange): void {
    const categoryId = event.value;
    this.categoryService.selectedCategoryId.set(categoryId);
  }

  public onEnterToAddATask(): void {
    if (this.newTaskForm.invalid) return;

    const { title, categoryId } = this.newTaskForm.value;

    const newTask: Partial<Task> = {
      title,
      categoryId,
      isCompleted: false,
    }

    this.taskService.createTask(newTask)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
      next: task => this.taskService.insertATaskInTheTaskList(task),
      error: error => {
        throw new Error(error.message);
      },
      complete: () => alert('Tarefa incluida'),
    });    
  }
}
