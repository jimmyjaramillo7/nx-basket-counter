import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, signal, type OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Boar } from '../../../common/services/board-socket.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-general-config',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './general-config.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralConfigComponent {
  fb = inject(FormBuilder);

  periodForm = this.fb.group({
    period: ['', [Validators.required]]
  })

  localTeamForm = this.fb.group({
    teamName: ['', [Validators.required]]
  })

  guestTeamForm = this.fb.group({
    teamName: ['', [Validators.required]]
  })

  playTimeForm = this.fb.group({
    playtime: ['', [Validators.required]]
  })

  socketService = inject(Boar)

  playPause() {
    this.socketService.playPause()
  }

  playSound() {
    this.socketService.emit('playSound')
  }

  changePeriod() {
    const { period } = this.periodForm.getRawValue();
    this.socketService.emitPeriod(period ?? "0")
  }

  setTimeOfGame() {
    const { playtime } = this.playTimeForm.getRawValue();
    if (!playtime) {
      alert("Por favor ingrese un valor valido en el formato de reloj, 10:00")
      return;
    }
    const newValue = playtime!.split(':');
    const minutes = parseInt(newValue[0]) * 60 * 1000;
    const seconds = parseInt(newValue[1]) * 1000;
    const total = minutes + seconds;
    this.socketService.emit("configTimer", total)
  }


  changeName(team: string) {
    let newName = '';
    if (team === "Home") {
      newName = this.localTeamForm.getRawValue().teamName!
    } else {
      newName = this.guestTeamForm.getRawValue().teamName!
    }
    if (!newName) {
      alert("Por favor ingrese un nombre valido")
    }
    this.socketService.emit(`set${team}Name`, newName)
  }

  async setLogo(team: string, input: any) {
    const b64: string | ArrayBuffer = await toBase64(input.files[0]);
    this.socketService.emit(`set${team}Logo`, b64);
  }

  keyPress(evt: KeyboardEvent) {

    if ((evt.key == '1' || evt.key == '2' || evt.key == '3') && evt.ctrlKey) {
      this.socketService.emitPoint('Home',parseInt(evt.key))
    }

    if ((evt.key == '1' || evt.key == '2' || evt.key == '3') && evt.altKey) {
      this.socketService.emitPoint('Guest',parseInt(evt.key))
        }

    if (evt.key == 'h') {
      this.playSound()
    }

    if (evt.key == " ") {
      this.playPause();
    }
    console.log(evt.key);
    
    evt.preventDefault()

  }

}

export const toBase64 = (file: File) => new Promise<string | ArrayBuffer>((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result!);
  reader.onerror = reject;
});