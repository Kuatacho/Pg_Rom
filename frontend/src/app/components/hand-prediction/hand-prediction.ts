import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Hands, HAND_CONNECTIONS, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-hand-prediction',
  standalone: true,
  imports: [HttpClientModule],
  template: `
    <div class="container">
      <video #videoElement autoplay playsinline width="640" height="480"></video>
      <canvas #canvasElement width="640" height="480"></canvas>
      <p>Predicción: {{ prediction }}</p>
    </div>
  `,
  styleUrls: ['./hand-prediction.css'],
})
export class HandPrediction implements AfterViewInit {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

  private sequence: number[][] = [];
  private readonly SEQUENCE_LENGTH = 30;
  private sending: boolean = false; 
  prediction: string = '';

  constructor(private http: HttpClient) {}

  async ngAfterViewInit(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.videoElement.nativeElement.srcObject = stream;
      await this.videoElement.nativeElement.play();

      const hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });

      hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        selfieMode: true,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7,
      });

      hands.onResults((results: Results) => this.onResults(results));

      const camera = new Camera(this.videoElement.nativeElement, {
        onFrame: async () => await hands.send({ image: this.videoElement.nativeElement }),
        width: 640,
        height: 480,
      });
      camera.start();
    } catch (err) {
      console.error('Error accediendo a la cámara:', err);
    }
  }

  private onResults(results: Results) {
  const canvasCtx = this.canvasElement.nativeElement.getContext('2d');
  if (!canvasCtx) return;

  // Limpiar canvas
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, this.canvasElement.nativeElement.width, this.canvasElement.nativeElement.height);

  // Dibujar video
  if (results.image) {
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      this.canvasElement.nativeElement.width,
      this.canvasElement.nativeElement.height
    );
  }

  // Preparar landmarks
  let flatLandmarksHands: number[] = [];
  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    results.multiHandLandmarks.forEach(landmarks => {
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS);
      drawLandmarks(canvasCtx, landmarks);
      flatLandmarksHands.push(...landmarks.flatMap(l => [l.x, l.y, l.z]));
    });
  }

  // Rellenar con ceros si hay menos de 2 manos
  const expectedLength = 21 * 3 * 2; // 2 manos
  while (flatLandmarksHands.length < expectedLength) {
    flatLandmarksHands.push(0);
  }

  // Mantener la secuencia
  this.sequence.push(flatLandmarksHands);
  if (this.sequence.length > this.SEQUENCE_LENGTH) {
    this.sequence.shift();
  }

  // Console log para depuración
  console.log('Secuencia actual:', this.sequence);

  // Enviar al backend solo si tenemos secuencia completa y no hay envío pendiente
  if (this.sequence.length === this.SEQUENCE_LENGTH && !this.sending) {
    console.log('Enviando secuencia al backend:', this.sequence);
    this.sendToFlask(this.sequence);
  }

  canvasCtx.restore();
}

private sendToFlask(sequence: number[][]) {
  this.sending = true;
  this.http.post<{ prediction: string; probabilities?: number[][] }>(
    'http://localhost:5000/predict',
    { sequence }
  ).subscribe({
    next: (res) => {
      console.log('Predicción recibida del backend:', res);
      this.prediction = res.prediction;
      this.sending = false;
    },
    error: (err) => {
      console.error('Error en Flask API:', err);
      this.sending = false;
    }
  });
}


  
}
