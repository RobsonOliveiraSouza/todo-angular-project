import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Task } from '../model/task.model';
import { environment } from '../../../../environments/environment';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private readonly _httpClient = inject(HttpClient);

  public tasks = signal<Task[]>([]);

  public numberOfTasks = computed(() => this.tasks().length);

  public readonly _apiUrl = environment.apiUrl;

  public isLoadingTask = signal(false);

  public getTasks(): Observable<Task[]> {
    return this._httpClient.get<Task[]>(`${this._apiUrl}/tasks`).pipe(
      tap(tasks => {
        const sortedTasks = this.getSortedTasks(tasks);
        this.tasks.set(tasks);
      })
    );
  }

  public createTask(task: Partial<Task>): Observable<Task> {
    return this._httpClient.post<Task>(`${this._apiUrl}/tasks`, task);
  }

  public insertATaskInTheTaskList(newTask: Task): void {
    this.tasks.update(tasks => {
      const newTaskList = [...tasks, newTask];

      return this.getSortedTasks(newTaskList);
    });
  }


  public updateTask(updatedTask: Task): Observable<Task> {
    return this._httpClient
      .put<Task>(`${this._apiUrl}/tasks/${updatedTask.id}`, updatedTask)
      .pipe(tap(task => this.updateATaskInTheTasksList(task)));
  }

  public updateATaskInTheTasksList(updatedTask: Task): void {
    this.tasks.update(tasks => {
      const allTaskWithUpdatedTaskRemoved = tasks.filter(
        task => task.id !== updatedTask.id
      );

      const updatedTaskList = [...allTaskWithUpdatedTaskRemoved, updatedTask];
      return this.getSortedTasks(updatedTaskList);
    });
  }

  public updateIsCompletedStatus(
    taskId: string,
    isCompleted: boolean
  ): Observable<Task> {
    return this._httpClient.patch<Task>(
      `${this._apiUrl}/tasks/${taskId}`,
      { isCompleted }
    ).pipe(tap(task => this.updateATaskInTheTasksList(task)));
  }

  public deleteTask(taskId: string): Observable<Task> {
    return this._httpClient
      .delete<Task>(`${this._apiUrl}/tasks/${taskId}`)
      .pipe(tap(task => this.deleteATaskInTheTasksList(taskId)));
  }

  public deleteATaskInTheTasksList(taskId: string): void {
    this.tasks.update(tasks => tasks.filter(task => task.id !== taskId));
  }

  public getSortedTasks(tasks: Task[]): Task[] {
    return tasks.sort((a, b) => a.title?.localeCompare(b.title));
  }
}
