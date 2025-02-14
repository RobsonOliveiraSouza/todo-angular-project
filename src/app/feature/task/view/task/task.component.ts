import { ChangeDetectionStrategy, Component } from '@angular/core';
import { InclusionFormComponent } from "../../components/inclusion-form/inclusion-form.component";

@Component({
    selector: 'app-task',
    imports: [InclusionFormComponent],
    template: `
        <div class="flex flex-col mx-10">
            <!-- Título -->
            <span class="font-bold text-4xl">Meu quadro de tarefas!</span>

            <!-- Formulário -->
            <app-inclusion-form></app-inclusion-form>
            <!-- Lista de tarefas -->
        </div>
    `,
    styles: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskComponent {}
