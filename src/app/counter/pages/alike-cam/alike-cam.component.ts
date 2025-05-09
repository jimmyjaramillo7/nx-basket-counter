import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Boar } from '../../../common/services/board-socket.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-alike-cam',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './alike-cam.component.html',
  styles: `
:host {
  display: block;
}

.slideToLeft {
  animation-name: slideToLeft;
  animation-duration: 1s;
  transform: translateX(-100%);
}

.returnToRight {
  animation-name: returnToRight;
  animation-duration: 1s;
}

.frame {
  border: 25px solid #222;
  -webkit-box-shadow: px 2px 3px 1px rgba(0, 0, 0, 0.5);
  box-shadow: 0px 3px 10px 4px rgba(0, 0, 0, 0.3);
}

.shadow-frame {
  background: white;
  -webkit-box-shadow: inset 10px 10px 10px 4px rgba(0, 0, 0, 0.4);
  box-shadow: inset 3px 7px 2px 5px rgba(0, 0, 0, 0.4);
}

.image {
  position: absolute;
  height: 350px;
  width: 250px;
  -webkit-box-shadow: inset 10px 10px 10px 4px rgba(0, 0, 0, 0.6);
  box-shadow: inset 3px 7px 2px 5px rgba(0, 0, 0, 0.1);
  border: 2px inset #c9c9c9;
}
.rotated{
  transform: rotate3d(0, 1, 0, 180deg);
}

@keyframes slideToLeft {
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

@keyframes returnToRight {
  0% {
    transform: rotate3d(0);
  }
  100% {
    transform: rotate3d(0, 1, 0, 180deg);
  }
}

.caption {
  @apply after:w-[90%] after:bg-white after:absolute after:bottom-0 after:left-5 after:text-center after:text-2xl after:font-gothamb;
}

.gradient-blue{
  background: rgb(0,212,255);
  background: radial-gradient(circle, rgba(0,212,255,1) 0%, rgba(6,53,201,1) 78%); 
}

.plate-border{
  border-style:ridge;
        border-color:#fff;
        border-width:3px;
}
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlikeCamComponent implements OnInit {

  socket = inject(Boar)
  destroy = inject(DestroyRef)

  interactiveClass = signal('')
  cam = signal("");

  name = signal("")
  img = signal('')
  auxClass = signal('')


  ngOnInit(): void {
    this.socket.listen('alikeCam-show')
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (res) => {
          if (res) {
            this.slideToLeft();
          }
        }
      })


    this.socket.listen('alikeCam-set')
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (res) => {
          const {charName,charImg}= res;
          this.rotateToRight(charName,charImg);
        }
      })

      this.socket.listen('camActive')
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (r) => {
          this.cam.set(r)
        }
      })
  
      this.socket.emit('getActiveCam')
  }

  slideToLeft() {
    this.interactiveClass.set("slideToLeft")
  }

  rotateToRight(
    name:string,
    img:string
  ) {
    this.interactiveClass.set("slideToLeft returnToRight")
    setTimeout(() => {
      this.name.set(name);
      this.auxClass.set("rotated")
      this.img.set(img);
    }, 300);
    setTimeout(() => {
      this.interactiveClass.set("")
      this.auxClass.set("")
    }, 900);
  }

}
