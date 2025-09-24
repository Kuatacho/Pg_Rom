import { Component, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Hands, HAND_CONNECTIONS, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { DecimalPipe, NgForOf, NgIf } from '@angular/common';
import { PredictionService, PredictionResponse } from '../services/hand-prediction.service';

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
  private readonly COOLDOWN_MS = 800; // más seguro contra spam
  private readonly MIN_MOVEMENT = 0.02;

  prediction = '';
  confidence = 0;
  warning = '';

  gestures: string[] = [];
  probabilities: number[] = [];
  history: { gesture: string; confidence: number }[] = [];
  score = 0;

  constructor(private predictionService: PredictionService, private cdr: ChangeDetectorRef) {}

  async ngAfterViewInit() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.videoElement.nativeElement.srcObject = stream;
      await this.videoElement.nativeElement.play();

      const hands = new Hands({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });

      hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        selfieMode: false, // importante para no invertir la imagen
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7
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

  /** Normaliza landmarks de una mano igual que en Python */
  private normalizeHand(landmarks: any[]): number[] {
    const wrist = landmarks[0];
    const mcpMid = landmarks[9];
    const scale = Math.sqrt(
      Math.pow(mcpMid.x - wrist.x, 2) +
      Math.pow(mcpMid.y - wrist.y, 2) +
      Math.pow(mcpMid.z - wrist.z, 2)
    ) || 1e-6;

    return landmarks.flatMap(l => [
      (l.x - wrist.x) / scale,
      (l.y - wrist.y) / scale,
      (l.z - wrist.z) / scale
    ]);
  }

  /** Empaqueta 2 manos: izquierda en [0:63], derecha en [63:126] */
  private packTwoHands(results: Results): number[] {
    let left = new Array(63).fill(0);
    let right = new Array(63).fill(0);

    if (results.multiHandLandmarks && results.multiHandedness) {
      results.multiHandLandmarks.forEach((landmarks, i) => {
        const handed = results.multiHandedness![i].label.toLowerCase();
        const feats = this.normalizeHand(landmarks);
        if (handed === 'left') left = feats;
        else right = feats;
      });
    }

    return [...left, ...right]; // (126,)
  }

  private onResults(results: Results) {
    const ctx = this.canvasElement.nativeElement.getContext('2d');
    if (!ctx) return;

    // Dibujo en canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if (results.image) ctx.drawImage(results.image, 0, 0, ctx.canvas.width, ctx.canvas.height);

    const flat: number[] = this.packTwoHands(results);
    const hasHands = flat.some(v => v !== 0);

    // Dibujar landmarks si hay manos
    if (hasHands && results.multiHandLandmarks) {
      results.multiHandLandmarks.forEach(lm => {
        drawConnectors(ctx, lm, HAND_CONNECTIONS);
        drawLandmarks(ctx, lm);
      });
    }

    // Ventana deslizante
    this.sequence.push(flat);
    if (this.sequence.length > this.SEQUENCE_LENGTH) this.sequence.shift();

    this.warning = hasHands ? '' : 'No se detectaron manos';

    // Movimiento entre frames
    let movement = 0;
    if (this.sequence.length >= 2) {
      const prev = this.sequence[this.sequence.length - 2];
      const curr = this.sequence[this.sequence.length - 1];
      movement = prev.reduce((acc, v, i) => acc + Math.abs(curr[i] - v), 0) / prev.length;
    }

    // Condiciones para enviar al backend
    const ready =
      hasHands &&
      this.sequence.length === this.SEQUENCE_LENGTH &&
      movement >= this.MIN_MOVEMENT &&
      Date.now() - this.lastSentTime > this.COOLDOWN_MS &&
      !this.sending;

    if (ready) {
      this.lastSentTime = Date.now();
      const seq30 = this.sequence.slice(-this.SEQUENCE_LENGTH);
      this.sendToBackend(seq30);
    }

    this.cdr.detectChanges();
  }

  private sendToBackend(seq: number[][]) {
    this.sending = true;
    this.predictionService.sendSequence(seq).subscribe({
      next: (res: PredictionResponse) => {
        this.probabilities = res.probabilities ?? [];
        this.gestures = res.gestures ?? [];

        const maxProb = Math.max(...this.probabilities);
        const maxIndex = this.probabilities.indexOf(maxProb);

        this.prediction = this.gestures[maxIndex] || '';
        this.confidence = maxProb;

        if (this.confidence >= 0.7) { // nuevo umbral más alto
          this.warning = '';
          this.history = [...this.history, { gesture: this.prediction, confidence: this.confidence }];
          this.score += 1;
        } else {
          this.warning = 'Predicción con baja confianza';
        }

        this.sending = false;
        this.cdr.detectChanges();
      },
      error: err => {
        this.prediction = '';
        this.confidence = 0;
        this.warning = err.status === 400 ? 'No se detectaron manos' : 'Error en el servidor';
        this.sending = false;
        this.cdr.detectChanges();
      }
    });
  }
}
