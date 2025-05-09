import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { Boar } from '../../../common/services/board-socket.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MiniCounterComponent } from '../../components/mini-counter/mini-counter.component';

@Component({
  selector: 'app-live-cam',
  standalone: true,
  imports: [
    CommonModule,
    MiniCounterComponent
   // WebcamModule
  ],
  templateUrl: './live-cam.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiveCamComponent implements OnInit{
  cam = signal("");
  socket = inject(Boar);
  destroy = inject(DestroyRef)


  ngOnInit(): void {

    this.socket.listen('camActive')
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (r) => {
          this.cam.set(r)
        }
      })
    this.socket.emit('getActiveCam')
  }
}

