import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-task',
    imports: [],
    template: `<p>task works!</p>`,
    styles: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskComponent {}
