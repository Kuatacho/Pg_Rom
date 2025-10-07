import { Component,ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Navbar } from "../../../shared/components/navbar/navbar";
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-learning',
  imports: [Navbar,CommonModule],
  templateUrl: './learning.html',
  styleUrl: './learning.css'
})
export class Learning implements AfterViewInit {
  @ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;
  cameraError: string | null = null;

  ngAfterViewInit() {
    this.initCamera();
  }

  initCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        this.videoElement.nativeElement.srcObject = stream;
      })
      .catch((err) => {
        this.cameraError = 'No se pudo acceder a la cámara: ' + err.message;
        console.error(err);
      });
  }
}
