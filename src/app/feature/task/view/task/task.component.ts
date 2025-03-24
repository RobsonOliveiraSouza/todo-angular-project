import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, inject, ViewChild, AfterViewInit } from '@angular/core';
import { InclusionFormComponent } from "../../components/inclusion-form/inclusion-form.component";
import { TaskService } from '../../services/task.service';
import { categoryIdBackgroundColors } from '../../../category/constants/category-colors';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../category/services/category.service';
import { Task } from '../../model/task.model';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

const MODULES = [CommonModule, MatTableModule, MatPaginatorModule, MatButtonModule];

@Component({
    selector: 'app-task',
    imports: [InclusionFormComponent, ...MODULES],
    template: `
        <div class="flex flex-col mx-12 mt-10">
            <span class="font-bold text-4xl text-gray-800 dark:text-gray-200">Meu quadro de tarefas!</span>

            <app-inclusion-form></app-inclusion-form>

            <div class="mt-8 shadow-lg rounded-lg p-6 bg-gray-200 dark:bg-gray-800 max-w-[90%] max-h-[90%]">
                <span class="text-2xl font-semibold text-gray-700 dark:text-gray-300">Tarefas:</span>

                <div class="overflow-x-auto">
                    <table mat-table [dataSource]="dataSource" class="mat-elevation-z2 w-full rounded-lg">
                        <ng-container matColumnDef="title">
                            <th mat-header-cell *matHeaderCellDef class="text-left bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xl font-semibold">
                                Título
                            </th>
                            <td mat-cell *matCellDef="let task" 
                                class="py-3 px-4 text-lg text-gray-800 dark:text-gray-200"
                                [ngClass]="{ 'line-through text-gray-500 dark:text-gray-400': task.isCompleted }">
                                {{ task.title }}
                            </td>
                        </ng-container>


                        <ng-container matColumnDef="category">
                            <th mat-header-cell *matHeaderCellDef class="text-left bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xl font-semibold">
                                Categoria
                            </th>
                            <td mat-cell *matCellDef="let task" class="py-3 px-4">
                                <span class="ml-2 px-2 py-1 text-sm rounded-lg"
                                    [ngClass]="getCategoryClass(task)">
                                    {{ getCategoryName(task) }}
                                </span>
                            </td>
                        </ng-container>

                        <ng-container matColumnDef="actions">
                            <th mat-header-cell *matHeaderCellDef class="text-left bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xl font-semibold">
                                Ações
                            </th>
                            <td mat-cell *matCellDef="let task" class="py-3 px-4 space-x-2">
                                <button (click)="toggleTaskStatus(task)"
                                    class="px-3 py-1 rounded text-sm font-medium transition-all text-white"
                                    [ngClass]="task.isCompleted ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'">
                                    {{ task.isCompleted ? 'Reabrir' : 'Concluir' }}
                                </button>
                                <button (click)="deleteTask(task.id)"
                                    class="px-3 py-1 bg-red-500 text-white rounded text-sm font-medium hover:bg-red-600 transition-all">
                                    Excluir
                                </button>
                            </td>
                        </ng-container>

                        <tr mat-header-row *matHeaderRowDef="displayedColumns" class="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"></tr>
                        <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="hover:bg-gray-50 dark:hover:bg-gray-700"></tr>
                    </table>
                </div>

                <mat-paginator [pageSize]="8" [pageSizeOptions]="[5, 8, 20]" aria-label="Selecione a página"
                    class="mt-4 rounded-lg shadow-md bg-gray-200 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
                </mat-paginator>
            </div>
        </div>
    `,
    styles: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskComponent {
    private taskService = inject(TaskService);
    private categoryService = inject(CategoryService);

    public filteredTasks = this.taskService.filteredTasks;
    public categories = this.categoryService.categories;

    public displayedColumns: string[] = ['title', 'category', 'actions'];
    dataSource: MatTableDataSource<Task> = new MatTableDataSource<Task>([]);

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(private cdr: ChangeDetectorRef) {
        this.taskService.getTasks().subscribe(tasks => {
            this.taskService.tasks.set(tasks);
            this.loadTasks();
        });
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    ngOnInit() {
        this.taskService.setDataSource(this.dataSource);
        this.taskService.getTasks().subscribe();
        this.loadTasks();
    }
    
    loadTasks(): void {
        const updatedTasks = [...this.taskService.filteredTasks()];
        this.dataSource.data = updatedTasks;
        setTimeout(() => {
            this.dataSource._updateChangeSubscription();
        });
    }

    toggleTaskStatus(task: Task): void {
        this.taskService.updateIsCompletedStatus(task.id, !task.isCompleted).subscribe(updatedTask => {
            this.taskService.updateATaskInTheTasksList(updatedTask);
            this.loadTasks();
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
            this.taskService.deleteTask(taskId).subscribe(() => {
                this.taskService.tasks.set(
                    this.taskService.tasks().filter(task => task.id !== taskId)
                );
                this.loadTasks();
            });
        }
    }

    createNewTask(task: Partial<Task>): void {
        this.taskService.createTask(task).subscribe(newTask => {
            this.taskService.insertATaskInTheTaskList(newTask);
            this.loadTasks();
        });
    }    
}