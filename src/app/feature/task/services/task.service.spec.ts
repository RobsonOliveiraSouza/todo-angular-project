import { provideHttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { TaskService } from "./task.service";

import { 
    HttpTestingController,
    provideHttpClientTesting
} from "@angular/common/http/testing";

import { task, tasks } from "../../../__mocks__/task";

describe('TaskService', () => {

    let taskservice: TaskService;
    let httpTestingController: HttpTestingController;

    const MOCKED_TASKS = tasks;
    const MOCKED_TASK = task;

    const baseUrl = 'http://localhost:3000';

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
        taskservice = TestBed.inject(TaskService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('creates service', () => {
        expect(taskservice).toBeTruthy();
    });

    it('getSortedTasks', () => {
        const sortedTasks = taskservice.getSortedTasks(tasks);
        expect(sortedTasks[0].title).toEqual('Comprar pão na padaria');
    });
});