import { ChangeDetectionStrategy, Component } from '@angular/core';
import { InclusionFormComponent } from "../../components/inclusion-form/inclusion-form.component";

@Component({
    selector: 'app-task',
    imports: [InclusionFormComponent],
    template: `
        <div class="flex flex-col mx-12 mt-10">
            
            <span class="font-bold text-4xl ">Meu quadro de tarefas!</span>
            
            <app-inclusion-form></app-inclusion-form>
        </div>
    `,
    styles: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskComponent {}
