import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MultimediaService } from '../../../common/services/multimedia.service';
import {MatPaginatorModule} from '@angular/material/paginator'; 
import { IMedia } from '../../../common/interfaces/multimedia.interface';
import { environment } from '../../../../environments/environment.development';
import { Boar } from '../../../common/services/board-socket.service';

@Component({
  selector: 'app-video-config',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatPaginatorModule
  ],
  templateUrl: './video-config.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoConfigComponent implements OnInit{
  mediaService = inject(MultimediaService);
  total = signal<number>(0);
  page = signal<number>(0);
  videos = signal<IMedia[]>([]);
  baseURl = environment.baseURL;
  socket = inject(Boar);
  preview = signal<string>('');
  file: any;
  ngOnInit(): void {
    this.loadVideos(0);
  }


  handlePageEvent(evt:any){
    const skip = evt.pageIndex * evt.pageSize;
    this.loadVideos(skip);
  }

  loadVideos(skip:number){
    this.mediaService.listMultimedia("video",9, skip).subscribe({
      next: (data) => {
        const {skip,total,docs} = data;
        this.total.set(total);
        this.page.set(Math.floor(skip/9));
        this.videos.set(docs);
      }
    });
  }

  preUpload(evt:any){
    this.file = evt.files[0];
    this.preview.set(URL.createObjectURL(this.file)); 
  }

  uploadVideo(){
    this.mediaService.uploadMultimedia(this.file).subscribe({
      next: () => {
        this.loadVideos(this.page());
        this.preview.set('');
        this.file = null;
      }
    });
  }
  selectVideo(video:string){
    this.socket.emit("setVideo", video);
  }
}