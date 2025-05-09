import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, effect, inject, signal } from '@angular/core';
import { Boar } from '../../../common/services/board-socket.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { toBase64 } from '../general-config/general-config.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';


@Component({
  selector: 'app-view-selector',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSlideToggleModule
  ],
  templateUrl: './view-selector.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewSelectorComponent implements OnInit {
  socket = inject(Boar)
  destroy = inject(DestroyRef)
  views = signal<{ name: string, isSelected: boolean, title: string }[]>(
    [
      {
        name: "main",
        isSelected: false,
        title: "Vista del marcador"
      },
      {
        name: "video",
        isSelected: false,
        title: "Vista completa de Video Publicidad"
      },
      {
        name: "kiss-cam",
        isSelected: false,
        title: "Vista de la Kiss Cam"
      },
      {
        name: "raffle",
        isSelected: false,
        title: "Vista del Sorteo Clipp"
      },
      {
        name: "live",
        isSelected: false,
        title: "Vista Completa Cámaras en Vivo"
      },
      {
        name: "alike-cam",
        isSelected: false,
        title: "Vista Cámara de Parecidos"
      }
    ]
  );

  pathCam = signal("");
  showHearts = signal(false);
  charName = signal("");
  charImg = signal("");

  ngOnInit(): void {
    this.socket.listen('boardView')
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (res) => {
          this.views.update((x) => x.map(y => ({ ...y, isSelected: y.name == res })))
        }
      })

    this.socket.listen('camActive')
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (res) => {
          this.pathCam.set(res)
        }
      })

      this.socket.listen('hearts')
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (r) => {
          this.showHearts.set(r)
        }
      })

    this.socket.emit('getBoardView')
    this.socket.emit('getActiveCam')
    this.socket.emit('isShowHearts')
  }

  changeView(view: string) {
    this.socket.emit('changeView', view)
  }

  changeCam() {
    this.socket.emit('setActiveCam', this.pathCam())
  }

  showAlikeCam(){
    this.socket.emit('showAlikeCam',true);
  }

  setAlikeCam(){
    this.socket.emit('setAlikeCam', {
      charName: this.charName(), 
      charImg: this.charImg()
    });
  }

  toggleHearts(){
    this.socket.emit('toggleHearts', true);
  }

  async uploadLogo(input: any){
    const b64: string | ArrayBuffer = await toBase64(input.files[0]);
    this.charImg.set(b64 as string)
  }

}
