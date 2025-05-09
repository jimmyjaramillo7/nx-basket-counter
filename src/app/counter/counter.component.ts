import { NgClass } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, effect, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Boar } from '../common/services/board-socket.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [
    RouterOutlet,
    NgClass
  ],
  templateUrl: './counter.component.html',
  styles: `
    :host {
      display: block;
    }
    .slideInOut{
      animation-name: slideInOut;
      animation-duration: 1s;
    }

    .slideOutIn{
      animation-name: slideOutIn;
      animation-duration: 1s;
    }

    .slideLeft{
      animation-name: slideLeft;
      animation-duration: 1s;
    }

    .slideRight{
      animation-name: slideRight;
      animation-duration: 1s;
    }


    @keyframes slideLeft {
      0% {
        transform: translateX(0%);
      }
      50% {
        transform: translateX(0%);
      }
      100% {
        transform: translateX(-100%);
      }
    }


    @keyframes slideRight {
      0% {
        transform: translateX(0%);
      }
      50% {
        transform: translateX(0%);
      }
      100% {
        transform: translateX(100%);
      }
    }


    @keyframes slideInOut {
      0% {
        transform: translateX(-100%);
      }
      20% {
        transform: translateX(0%);
      }
      70% {
        transform: translateX(0%);
      }
      100% {
        transform: translateX(-100%);
      }
    }


    @keyframes slideOutIn {
      0% {
        transform: translateX(100%);
      }
      20% {
        transform: translateX(0%);
      }
      70% {
        transform: translateX(0%);
      }
      100% {
        transform: translateX(100%);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterComponent implements AfterViewInit {
  firstLoad = signal(true);
  navigating = signal(false);
  socket = inject(Boar);
  destroy = inject(DestroyRef);
  name = '';
  /*
  [ngClass]="{'slideInOut -translate-x-full': !firstLoad()}"

  slideOutIn translate-x-full
  */
  router = inject(Router)
  ngAfterViewInit(): void {
    this.socket.listen('boardView')
    .pipe(takeUntilDestroyed(this.destroy))
    .subscribe({
      next: (x) => {
        if (this.name!=x) {
          this.navigate(x);
          this.name = x;
        }
      }
    })

    setTimeout(() => {
      this.firstLoad.set(false);
    }, 3000);
/*
    setTimeout(() => {
      this.navigating.set(true);
      setTimeout(() => {
        this.router.navigateByUrl('../main')
      }, 500);
    }, 5000); */
  }

  navigate(view: string) {
    this.navigating.set(true);
    setTimeout(() => {
      this.router.navigateByUrl('screen/' + view)
      setTimeout(() => {
        this.navigating.set(false);
      }, 1000);
    }, 500);
  }
}
