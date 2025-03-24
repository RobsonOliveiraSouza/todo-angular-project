import { ChangeDetectionStrategy, Component, computed, DestroyRef, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CategoryService } from '../../../../category/services/category.service';
import { Task } from '../../../model/task.model';
import { TaskService } from '../../../services/task.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { delay, finalize } from 'rxjs';
import { SnackBarService } from '../../../../../shared/services/snack-bar.service';

const MODULES = [
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  FormsModule,
  ReactiveFormsModule,
];

const COMMONS = [CommonModule];


@Component({
  selector: 'app-include-task-form',
  imports: [...MODULES, COMMONS],
  template: `
    <form 
      [ngClass]="{
        'cursor-not-allowed animate-pulse': isIncludeTaskFormDisabled(),
        'cursor-pointer': !isIncludeTaskFormDisabled(),
      }"
      autocomplete="off" class="flex flex-row gap-2 select-none" [formGroup]="newTaskForm">
      <mat-form-field class="w-full">
        <mat-label for="title" data-testid="titleLabel">Tarefa</mat-label>
        <input 
          formControlName="title" 
          matInput 
          placeholder="Adicionar tarefa" (keyup.enter)="onEnterToAddATask()" />
        <mat-hint class="text-tertiary">Aperte enter para adicionar uma nova tarefa!</mat-hint>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Data da Tarefa</mat-label>
        <input matInput [matDatepicker]="picker" formControlName="date" placeholder="Selecione uma data">
        <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker></mat-datepicker>
      </mat-form-field>

      <mat-form-field>
        <mat-label for="categoryId" data-testid="categoryIdLabel">Categoria</mat-label>
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

  public readonly newTaskForm = createTaskForm();

  private readonly destroy$ = inject(DestroyRef);

  private readonly snackBarService = inject(SnackBarService);

  @Output() taskCreated = new EventEmitter<Partial<Task>>();

  taskForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      categoryId: ['', Validators.required],
      date: [null, Validators.required]
    });
  }

  submitForm() {
    if (this.taskForm.valid) {
      const taskData = { 
        ...this.taskForm.value, 
        date: this.taskForm.value.date ? 
          new Date(this.taskForm.value.date).toISOString().split('T')[0] : null 
      };
      this.taskCreated.emit(taskData);
      this.taskForm.reset();
    }
  }

  public isIncludeTaskFormDisabled = computed(() => {
    if (this.taskService.isLoadingTask()) {
      this.newTaskForm.disable();

      return this.taskService.isLoadingTask();
    }
    this.newTaskForm.enable();

    return this.taskService.isLoadingTask();

  });

  public selectionChangeHandler(event: MatSelectChange): void {
    const categoryId = event.value;
    this.categoryService.selectedCategoryId.set(categoryId);
  }

  public onEnterToAddATask(): void {
    if (this.newTaskForm.invalid) return;
  
    this.taskService.isLoadingTask.set(true);
  
    const { title, categoryId, date } = this.newTaskForm.value;
  
    const newTask: Partial<Task> = {
      title,
      categoryId,
      isCompleted: false,
      dueDate: date ? new Date(date).toISOString().split('T')[0] : undefined,
    };
  
    this.taskService
      .createTask(newTask)
      .pipe(
        delay(1000),
        finalize(() => this.taskService.isLoadingTask.set(false)),
        takeUntilDestroyed(this.destroy$)
      )
      .subscribe({
        next: task => {
          this.newTaskForm.reset();
          this.taskService.refreshTaskList();
        },
        error: error => {
          this.snackBarConfigHandler(error.message);
        },
        complete: () => this.snackBarConfigHandler('Tarefa incluída'),
      });
  }
  

  public snackBarConfigHandler(message: string): void {
    this.snackBarService.showSnackBar(message, 4000, 'end', 'top');
  }
}
export function createTaskForm(): FormGroup {
  return new FormGroup({
    title: new FormControl('', Validators.required),
    categoryId: new FormControl('', Validators.required),
    date: new FormControl(null, Validators.required),
  });
}
