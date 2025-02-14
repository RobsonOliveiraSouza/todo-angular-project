import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-inclusion-form',
  imports: [],
  template: `<p>inclusion-form works!</p>`,
  styleUrl: './inclusion-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InclusionFormComponent { }
