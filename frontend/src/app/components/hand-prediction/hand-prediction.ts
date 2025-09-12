import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Hands, HAND_CONNECTIONS, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { HttpClient,HttpClientModule  } from '@angular/common/http';

@Component({
  selector: 'app-hand-prediction',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './hand-prediction.html',
  styleUrls: ['./hand-prediction.css'],
})
export class HandPrediction implements AfterViewInit {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

  private sequence: number[][] = []; // Para almacenar los frames de landmarks
  private readonly SEQUENCE_LENGTH = 30; // Mismo que en Flask

  constructor(private http: HttpClient) {}

  async ngAfterViewInit(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.videoElement.nativeElement.srcObject = stream;
      await this.videoElement.nativeElement.play();

      const hands = new Hands({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,       // Precisión media
        selfieMode: true,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7,
      });

      hands.onResults((results: Results) => this.onResults(results));

      const camera = new Camera(this.videoElement.nativeElement, {
        onFrame: async () => {
          await hands.send({ image: this.videoElement.nativeElement });
        },
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
      const landmarks = results.multiHandLandmarks[0];
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS);
      drawLandmarks(canvasCtx, landmarks);

      // Convertir landmarks a un array plano de 63 valores (21 puntos * 3)
      const flatLandmarks = landmarks.flatMap(l => [l.x, l.y, l.z]);

      // Guardar en la secuencia
      this.sequence.push(flatLandmarks);
      if (this.sequence.length > this.SEQUENCE_LENGTH) {
        this.sequence.shift(); // mantener solo los últimos SEQUENCE_LENGTH frames
      }

      // Enviar a Flask si hay suficientes frames
      if (this.sequence.length === this.SEQUENCE_LENGTH) {
        this.sendToFlask(this.sequence);
      }
    }

    canvasCtx.restore();
  }

  private sendToFlask(sequence: number[][]) {
    this.http.post('http://localhost:5000/predict', { sequence })
      .subscribe({
        next: (res) => console.log('Predicción:', res),
        error: (err) => console.error('Error en Flask API:', err)
      });
  }
}
