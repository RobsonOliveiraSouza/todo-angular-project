import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Task } from '../model/task.model';
import { environment } from '../../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private readonly _httpClient = inject(HttpClient);
  public readonly _apiUrl = environment.apiUrl;

  private _selectedCategoryId = signal<string | null>(null);
  public selectedCategoryId = this._selectedCategoryId;

  private _selectedDay = signal<number | null>(null);
  public selectedDay = this._selectedDay;
  public isLoadingTask = signal(false);

  public tasks = signal<Task[]>([]);
  public numberOfTasks = computed(() => this.tasks().length);

  dataSource: MatTableDataSource<Task> = new MatTableDataSource<Task>();

  public setDataSource(dataSource: MatTableDataSource<Task>): void {
    this.dataSource = dataSource;
    this.dataSource.data = this.tasks();
  }

  constructor() {
    effect(() => {
      this.dataSource.data = this.tasks();
    });
  }

  public getTasks(): Observable<Task[]> {
    return this._httpClient.get<Task[]>(`${this._apiUrl}/tasks`).pipe(
      tap(tasks => {
        const sortedTasks = this.getSortedTasks(tasks);
        this.tasks.set(tasks);
      })
    );
  }

  public getSortedTasks(tasks: Task[]): Task[] {
    return tasks.sort((a, b) => a.title?.localeCompare(b.title));
  }

  public createTask(task: Partial<Task>): Observable<Task> {
    const dueDate = task.dueDate ? this.formatToISO(task.dueDate) : new Date().toISOString().split('T')[0];

    const newTask = {
      ...task,
      dueDate
    };

    return this._httpClient.post<Task>(`${this._apiUrl}/tasks`, newTask).pipe(
      tap(createdTask => {
        this.insertATaskInTheTaskList(createdTask);
        this.refreshTaskList();
      })
    );
  }

  public updateTask(updatedTask: Task): Observable<Task> {
    return this._httpClient
      .put<Task>(`${this._apiUrl}/tasks/${updatedTask.id}`, updatedTask)
      .pipe(tap(task => this.updateATaskInTheTasksList(task)));
  }

  public updateIsCompletedStatus(taskId: string, isCompleted: boolean): Observable<Task> {
    return this._httpClient.patch<Task>(`${this._apiUrl}/tasks/${taskId}`, { isCompleted }).pipe(
      tap(task => this.updateATaskInTheTasksList(task))
    );
  }

  public deleteTask(taskId: string): Observable<Task> {
    return this._httpClient
      .delete<Task>(`${this._apiUrl}/tasks/${taskId}`)
      .pipe(tap(task => this.deleteATaskInTheTasksList(taskId)));
  }


  public insertATaskInTheTaskList(newTask: Task): void {
    this.tasks.set([...this.tasks(), newTask]);
  }

  public updateATaskInTheTasksList(updatedTask: Task): void {
    this.tasks.update(tasks => tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
  }

  public deleteATaskInTheTasksList(taskId: string): void {
    this.tasks.update(tasks => tasks.filter(task => task.id !== taskId));
  }

  public refreshTaskList(): void {
    this.getTasks().subscribe(tasks => this.tasks.set(tasks));
  }

  public filteredTasks = computed(() => {
    const selectedCategory = this._selectedCategoryId();
    const selectedDay = this._selectedDay();
  
    return this.tasks().filter(task => {
      const matchesCategory = selectedCategory ? task.categoryId === selectedCategory : true;
      const matchesDay = selectedDay !== null ? new Date(task.dueDate).getDay() === selectedDay : true;
      return matchesCategory && matchesDay;
    });
  });
  
  public filterTasksByCategory(categoryId: string): void {
    this._selectedCategoryId.update(prevId => (prevId === categoryId ? null : categoryId));
    this.dataSource.data = this.filteredTasks();
  }  

  public filteredTasksByDay = computed(() => {
    const today = new Date().getDay();
    return this.tasks().filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate.getDay() === today;
    });
  });

  public getTasksByDayOfWeek(dayOfWeek: number): Task[] {
    return this.tasks().filter(task => {
      const taskDate = new Date(task.dueDate + 'T00:00:00');
      return taskDate.getDay() === dayOfWeek;
    });
  }

  public filterTasksByDay(day: number): void {
    this._selectedDay.set(day);
    this.dataSource.data = this.getTasksByDayOfWeek(day);
  }

  public clearDayFilter(): void {
    this._selectedDay.set(null);
    this.dataSource.data = this.tasks();
  }

  private formatToISO(dateString: string): string {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day).toISOString().split('T')[0];
  }
}
