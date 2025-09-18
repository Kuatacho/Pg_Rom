import { Component, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Hands, HAND_CONNECTIONS, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { DecimalPipe, NgForOf, NgIf } from '@angular/common';
import { PredictionService } from '../services/hand-prediction.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-hand-prediction',
  standalone: true,
  imports: [Navbar, NgIf, NgForOf, DecimalPipe],
  templateUrl: '../components/hand-prediction.html',
  styleUrls: ['../components/hand-prediction.css'],
})
export class HandPrediction implements AfterViewInit {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

  private sequence: number[][] = [];
  private readonly SEQUENCE_LENGTH = 30;
  private sending = false;
  private lastSentTime = 0;
  private readonly COOLDOWN_MS = 500;
  private readonly MIN_MOVEMENT = 0.02;

  prediction = '';
  warning = '';
  gestures = ['Cambiar', 'Construir'];
  probabilities: number[] = [];
  history: string[] = [];
  score = 0;

  constructor(private predictionService: PredictionService, private cdr: ChangeDetectorRef) {}

  async ngAfterViewInit() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.videoElement.nativeElement.srcObject = stream;
      await this.videoElement.nativeElement.play();

      const hands = new Hands({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });
      hands.setOptions({ maxNumHands: 2, modelComplexity: 1, selfieMode: true, minDetectionConfidence: 0.7, minTrackingConfidence: 0.7 });
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

    canvasCtx.clearRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);
    if (results.image) canvasCtx.drawImage(results.image, 0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);

    let flatLandmarks: number[] = [];
    if (results.multiHandLandmarks?.length) {
      results.multiHandLandmarks.forEach(landmarks => {
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS);
        drawLandmarks(canvasCtx, landmarks);
        flatLandmarks.push(...landmarks.flatMap(l => [l.x, l.y, l.z]));
      });
    }

    while (flatLandmarks.length < 21*3*2) flatLandmarks.push(0);
    this.sequence.push(flatLandmarks);
    if (this.sequence.length > this.SEQUENCE_LENGTH) this.sequence.shift();

    this.warning = results.multiHandLandmarks?.length ? '' : 'No se detectaron manos';
    this.cdr.detectChanges();

    let movement = 0;
    if (this.sequence.length >= 2)
      movement = this.averageMovement(this.sequence[this.sequence.length-2], this.sequence[this.sequence.length-1]);

    if (!this.sending && movement >= this.MIN_MOVEMENT && Date.now() - this.lastSentTime > this.COOLDOWN_MS) {
      this.lastSentTime = Date.now();
      this.sendToBackend([...this.sequence]);
    }
  }

  private averageMovement(prev: number[], curr: number[]): number {
    return prev.reduce((acc, val, i) => acc + Math.abs(curr[i]-val), 0)/prev.length;
  }

  private sendToBackend(seq: number[][]) {
    this.sending = true;
    this.predictionService.sendSequence(seq).subscribe({
      next: res => {
        this.probabilities = res.probabilities ? [...res.probabilities[0]] : [];
        const maxProb = this.probabilities.length ? Math.max(...this.probabilities) : 0;

        if (maxProb >= 0.7) {
          this.prediction = res.prediction;
          this.history = [...this.history, res.prediction];
          this.score += 1;
        } else {
          this.prediction = '';
          this.warning = 'Predicción con baja confianza';
        }

        this.sending = false;
        this.cdr.detectChanges();
      },
      error: err => {
        this.prediction = '';
        this.warning = err.status === 400 ? 'No se detectaron manos' : 'Error en el servidor';
        this.sending = false;
        this.cdr.detectChanges();
      }
    });
  }
}
