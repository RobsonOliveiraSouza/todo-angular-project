import { HttpResponse, HttpErrorResponse, provideHttpClient } from "@angular/common/http";
import { TestBed, waitForAsync } from "@angular/core/testing";
import { TaskService } from "./task.service";

import {
    HttpTestingController,
    provideHttpClientTesting
} from "@angular/common/http/testing";

import { task, TASK_INTERNAL_SERVER_ERROR_RESPONSE, tasks } from "../../../__mocks__/task";
import { response } from "express";
import { Task } from "../model/task.model";

describe('TaskService', () => {

    let taskService: TaskService;
    let httpTestingController: HttpTestingController;

    const MOCKED_TASKS = tasks;
    const MOCKED_TASK = task;

    const apiUrl = 'http://localhost:3000';

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
        taskService = TestBed.inject(TaskService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('creates service', () => {
        expect(taskService).toBeTruthy();
    });

    it('getSortedTasks', () => {
        const sortedTasks = taskService.getSortedTasks(tasks);
        expect(sortedTasks[0].title).toEqual('Comprar pão na padaria');
    });

    describe('getTasks', () => {
        it('should return a list of tasks', waitForAsync(() => {
            taskService.getTasks().subscribe(response => {
                expect(response).toEqual(MOCKED_TASKS);
                expect(taskService.tasks()).toEqual(MOCKED_TASKS);
            });

            const req = httpTestingController.expectOne(`${apiUrl}/tasks`);

            req.flush(MOCKED_TASKS);

            expect(req.request.method).toEqual('GET');
        }));

        it('should throw and error when server return Internal server error', waitForAsync(() => {

            let httpErrorResponse: HttpErrorResponse | undefined;

            taskService.getTasks().subscribe({
                next: () => {
                    fail('failed to fetch the tasks list');
                },
                error: (error: HttpErrorResponse) => {
                    httpErrorResponse = error;
                }
            });

            const req = httpTestingController.expectOne(`${apiUrl}/tasks`);

            req.flush('Internal Server Error', TASK_INTERNAL_SERVER_ERROR_RESPONSE);

            if (!httpErrorResponse) {
                throw new Error('Error needs to be defined');
            }

            expect(httpErrorResponse.status).toEqual(500);
            expect(httpErrorResponse.statusText).toEqual('Internal Server Error');
        }));
    });

    describe('createTask', () => {
        it('should return a list of tasks', waitForAsync(() => {
            taskService.getTasks().subscribe(response => {
                expect(response).toEqual(MOCKED_TASKS);
                expect(taskService.tasks()).toEqual(MOCKED_TASKS);
            });

            const req = httpTestingController.expectOne(`${apiUrl}/tasks`);

            req.flush(MOCKED_TASKS);

            expect(req.request.method).toEqual('GET');
        }));

        it('should throw and error when server return Internal server error', waitForAsync(() => {

            let httpErrorResponse: HttpErrorResponse | undefined;

            taskService.getTasks().subscribe({
                next: () => {
                    fail('failed to fetch the tasks list');
                },
                error: (error: HttpErrorResponse) => {
                    httpErrorResponse = error;
                }
            });

            const req = httpTestingController.expectOne(`${apiUrl}/tasks`);

            req.flush('Internal Server Error', TASK_INTERNAL_SERVER_ERROR_RESPONSE);

            if (!httpErrorResponse) {
                throw new Error('Error needs to be defined');
            }

            expect(httpErrorResponse.status).toEqual(500);
            expect(httpErrorResponse.statusText).toEqual('Internal Server Error');
        }));
    });
});