import { Component, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Hands, HAND_CONNECTIONS, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { Navbar } from '../../shared/navbar/navbar';
import { DecimalPipe, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-hand-prediction',
  standalone: true,
  imports: [
    HttpClientModule, 
    Navbar,
    NgIf,
    NgForOf,
    DecimalPipe
  ],
  templateUrl: './hand-prediction.html',
  styleUrls: ['./hand-prediction.css'],
})
export class HandPrediction implements AfterViewInit {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

  private sequence: number[][] = [];
  private readonly SEQUENCE_LENGTH = 30;
  private sending: boolean = false;
  private lastSentTime = 0;
  private readonly COOLDOWN_MS = 500;
  private readonly MIN_MOVEMENT = 0.02;

  prediction: string = '';
  warning: string = '';
  gestures: string[] = ['Cambiar', 'Construir'];
  probabilities: number[] = [];
  history: string[] = [];
  score: number = 0;

  constructor(private http: HttpClient, private ngZone: NgZone) { }

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

      const canvas = this.canvasElement.nativeElement;
      canvas.width = this.videoElement.nativeElement.videoWidth || 640;
      canvas.height = this.videoElement.nativeElement.videoHeight || 480;

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

    let flatLandmarksHands: number[] = [];
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      results.multiHandLandmarks.forEach(landmarks => {
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS);
        drawLandmarks(canvasCtx, landmarks);
        flatLandmarksHands.push(...landmarks.flatMap(l => [l.x, l.y, l.z]));
      });
    }

    const expectedLength = 21 * 3 * 2;
    while (flatLandmarksHands.length < expectedLength) flatLandmarksHands.push(0);

    this.sequence.push(flatLandmarksHands);
    if (this.sequence.length > this.SEQUENCE_LENGTH) this.sequence.shift();

    let movement = 0;
    if (this.sequence.length >= 2) {
      const prev = this.sequence[this.sequence.length - 2];
      const curr = this.sequence[this.sequence.length - 1];
      movement = this.averageMovement(prev, curr);
    }

    if (
      this.sequence.length === this.SEQUENCE_LENGTH &&
      !this.sending &&
      Date.now() - this.lastSentTime > this.COOLDOWN_MS &&
      movement >= this.MIN_MOVEMENT
    ) {
      this.sendToFlask(this.sequence);
      this.lastSentTime = Date.now();
    }

    canvasCtx.restore();
  }

  private averageMovement(prev: number[], curr: number[]): number {
    let total = 0;
    for (let i = 0; i < prev.length; i++) total += Math.abs(curr[i] - prev[i]);
    return total / prev.length;
  }

  private sendToFlask(sequence: number[][]) {
    this.sending = true;
    this.http.post<{ prediction: string; probabilities?: number[][] }>(
      'http://localhost:5000/predict',
      { sequence }
    ).subscribe({
      next: (res) => {
        this.ngZone.run(() => {  // <--- Forzamos Angular a actualizar la UI
          this.probabilities = res.probabilities ? res.probabilities[0] : [];
          const maxProb = this.probabilities.length ? Math.max(...this.probabilities) : 1;

          if (maxProb >= 0.7) {
            this.prediction = res.prediction;
            this.warning = '';
            this.history.push(res.prediction);
            this.score += 1;
            console.log(`✅ Predicción: ${res.prediction} | Probabilidad: ${maxProb.toFixed(2)}`);
          } else {
            this.prediction = '';
            this.warning = 'Predicción con baja confianza';
            console.log(`⚠️ Predicción baja confianza: ${res.prediction} | Probabilidad: ${maxProb.toFixed(2)}`);
          }
          this.sending = false;
        });
      },
      error: (err) => {
        this.ngZone.run(() => {  // <--- También aquí
          if (err.status === 400) {
            this.prediction = '';
            this.warning = 'No se detectaron manos';
            console.log('⚠️ No se detectaron manos en la secuencia');
          } else {
            this.prediction = '';
            this.warning = 'Error en el servidor';
            console.log('❌ Error en el servidor:', err);
          }
          this.sending = false;
        });
      }
    });
  }
}
