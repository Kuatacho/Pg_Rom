import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Hands, HAND_CONNECTIONS } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

@Component({
  selector: 'app-hand-prediction',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './hand-prediction.html',
  styleUrls: ['./hand-prediction.css']
})
export class HandPrediction implements AfterViewInit {

  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

  sequence: number[][] = [];
  SEQUENCE_LENGTH = 30;
  prediction = '';

  constructor(private http: HttpClient) { }

  async ngAfterViewInit(): Promise<void> {
    try {
      // 1️⃣ Pedir acceso a la cámara
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      this.videoElement.nativeElement.srcObject = stream;
      await this.videoElement.nativeElement.play();

      // 2️⃣ Inicializar MediaPipe Hands
      const hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });

      hands.setOptions({
        maxNumHands: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7
      });

      hands.onResults((results: any) => this.onResults(results));

      // 3️⃣ Iniciar cámara MediaPipe solo cuando el video tenga datos
      this.videoElement.nativeElement.onloadeddata = () => {
        const camera = new Camera(this.videoElement.nativeElement, {
          onFrame: async () => {
            if (this.videoElement.nativeElement.videoWidth > 0 &&
              this.videoElement.nativeElement.videoHeight > 0) {
              await hands.send({ image: this.videoElement.nativeElement });
            }
          },
          width: 640,
          height: 480
        });
        camera.start();
      };

    } catch (err) {
      console.error('No se pudo acceder a la cámara:', err);
    }
  }

  private onResults(results: any) {
  const canvasCtx = this.canvasElement.nativeElement.getContext('2d');
  if (!canvasCtx) return;

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, this.canvasElement.nativeElement.width, this.canvasElement.nativeElement.height);

  if (results.image) {
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      this.canvasElement.nativeElement.width,
      this.canvasElement.nativeElement.height
    );
  }

  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    const landmarks = results.multiHandLandmarks[0].flatMap((lm: any) => [lm.x, lm.y, lm.z]);

    drawConnectors(canvasCtx, results.multiHandLandmarks[0], HAND_CONNECTIONS);
    drawLandmarks(canvasCtx, results.multiHandLandmarks[0]);

    // 🔹 Debug: ver landmarks en consola
    console.log('Landmarks capturados:', landmarks);

    // Guardar frame en la secuencia
    if (landmarks.length === 63) {
      this.sequence.push(landmarks);

      // Mantener la secuencia con máximo 30 frames
      if (this.sequence.length > this.SEQUENCE_LENGTH) {
        this.sequence.shift();
      }

      // Solo mandar al backend cuando tengamos 30 frames
      if (this.sequence.length === this.SEQUENCE_LENGTH) {
        this.http.post('http://localhost:5000/predict', { input: this.sequence })
          .subscribe({
            next: (res: any) => {
              this.prediction = res.prediction;
              console.log('Predicción recibida:', res);
            },
            error: (err) => console.error('Error API:', err)
          });
      }
    }
  }

  canvasCtx.restore();
}


}