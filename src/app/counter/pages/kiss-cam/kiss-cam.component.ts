import { CommonModule } from '@angular/common';
import {  ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { Boar } from '../../../common/services/board-socket.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MiniCounterComponent } from '../../components/mini-counter/mini-counter.component';

@Component({
  selector: 'app-kiss-cam',
  standalone: true,
  imports: [
    CommonModule,
    MiniCounterComponent
   // WebcamModule
  ],
  templateUrl: './kiss-cam.component.html',
  styles: `
    :host {
      display: block;
    }

    .fadeIn{
      animation-name: fadeIn;
      animation-duration: 1s;
    }

    .fadeOut{
      animation-name: fadeOut;
      animation-duration: 1s;
    }


    @keyframes fadeIn {
      0% {
        scale: 0;
      }
      100% {
        scale: 1;
      }
    }

    @keyframes fadeOut {
      0% {
        scale: 1;
      }
      100% {
        scale: 0;
      }
    }

  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KissCamComponent implements OnInit{
  cam = signal("");
  socket = inject(Boar);
  destroy = inject(DestroyRef);
  //cam1 = environment.cam1;
  showHearts = signal(false);

  ngOnInit(): void {
    
    this.socket.listen('camActive')
    .pipe(takeUntilDestroyed(this.destroy))
    .subscribe({
      next: (r) => {
        this.cam.set(r)
      }
    })

    this.socket.listen('hearts')
    .pipe(takeUntilDestroyed(this.destroy))
    .subscribe({
      next: (r) => {
        this.showHearts.set(r)
      }
    })

    this.socket.emit('getActiveCam')

    this.socket.emit('isShowHearts')

  }
}
