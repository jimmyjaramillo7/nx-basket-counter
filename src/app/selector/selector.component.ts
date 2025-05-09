import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-selector',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './selector.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectorComponent {
  views: {
    path: string,
    label: string
  }[] = [
      {
        path: '/control',
        label: 'Panel de Control'
      },
      {
        path: '/screen',
        label: 'Pantalla Principal'
      },
      {
        path: '/transmission',
        label: 'Vista de Transmisión'
      }
    ];
}
