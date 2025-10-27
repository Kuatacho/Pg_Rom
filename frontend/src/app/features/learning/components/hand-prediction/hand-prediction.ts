import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  HostListener,
  inject
} from '@angular/core';
import { Hands, HAND_CONNECTIONS, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { Navbar } from '../../../../shared/components/navbar/navbar';
import {DecimalPipe, NgIf, NgClass, CommonModule} from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PredictionService, PredictionResponse } from '../../services/hand-prediction.service';
import { GesturesService, Gesto } from '../../../learning/services/gestures.service';

interface GestureScore {
  gestoId: number;
  nombre: string;
  nota: number;
}

@Component({
  selector: 'app-hand-prediction',
  standalone: true,
  imports: [Navbar, NgIf, NgClass, DecimalPipe, CommonModule],
  templateUrl: './hand-prediction.html',
  styleUrls: ['./hand-prediction.css'],
})
export class HandPrediction implements OnInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private gesturesService = inject(GesturesService);
  private predictionService = inject(PredictionService);
  private cdr = inject(ChangeDetectorRef);

  // ===== Contexto de la práctica =====
  leccionId!: number;
  gestoId!: number;
  gestoEsperado: Gesto | null = null;
  totalGestos = 0;
  isLast = false;

  // ===== Estado UI =====
  modo: 'ver' | 'practicar' | 'resultado' = 'ver';
  gifError = false;
  nota = 0;

  // ===== Control IA (ventana deslizante + cooldown) =====
  private sequence: number[][] = [];
  private readonly SEQUENCE_LENGTH = 30;
  private sending = false;
  private lastSentTime = 0;
  private readonly COOLDOWN_MS = 800;
  private readonly MIN_MOVEMENT = 0.02;

  prediction = '';
  confidence = 0;
  feedback = '';
  warning = '';

  gestures: string[] = [];
  probabilities: number[] = [];

  // ===== Cámara / MediaPipe =====
  private mediaStream: MediaStream | null = null;
  private cameraInstance: Camera | null = null;
  private handsInstance: Hands | null = null;

  private isCameraRunning = false;   // evita start duplicados
  private videoReady = false;        // true cuando video tiene dimensiones

  // Pausa cámara si la pestaña se oculta (ahorra CPU y evita aborts)
  @HostListener('document:visibilitychange')
  onVisibilityChange() {
    if (document.hidden) {
      this.stopCamera();
    } else if (this.modo === 'practicar') {
      // reanudar si el usuario estaba practicando
      this.startCamera();
    }
  }

  // =====================================================
  // Ciclo de vida
  // =====================================================
  ngOnInit(): void {
    // 1) Instanciar Hands UNA sola vez y mantenerlo vivo
    this.handsInstance = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });
    this.handsInstance.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      selfieMode: false,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });
    this.handsInstance.onResults((r: Results) => this.onResults(r));

    // 2) Reaccionar a cambios de ruta (siguiente/previo gesto)
    this.route.paramMap.subscribe(pm => {
      this.leccionId = Number(pm.get('leccionId'));
      this.gestoId = Number(pm.get('gestoId'));
      this.resetView();
      this.stopCamera(); // por si venimos de otra vista/gesto

      this.gesturesService.getGestosPorLeccion(this.leccionId).subscribe({
        next: gestos => {
          this.totalGestos = gestos.length;
          this.isLast = this.gestoId >= this.totalGestos; // ids 1..N
          this.gestoEsperado = gestos.find(g => Number(g.id) === this.gestoId) || null;
          this.cdr.detectChanges();
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.stopCamera();
    if (this.handsInstance) {
      this.handsInstance.close();
      this.handsInstance = null;
    }
  }

  // =====================================================
  // Utils UI / Data
  // =====================================================
  get gifSrc(): string {
    return this.gifError ? '' : (this.gestoEsperado?.gif ?? '');
  }

  private resetView() {
    this.modo = 'ver';
    this.feedback = '';
    this.prediction = '';
    this.confidence = 0;
    this.nota = 0;
    this.sequence = [];
    this.lastSentTime = 0;
  }

  private resetGesture() {
    this.feedback = '';
    this.prediction = '';
    this.confidence = 0;
    this.sequence = [];
    this.lastSentTime = 0;
  }

  // =====================================================
  // Cámara robusta (evita aborts y ROI 0x0)
  // =====================================================
  private async waitLoadedMetadata(video: HTMLVideoElement): Promise<void> {
    if (video.readyState >= 1 && video.videoWidth > 0 && video.videoHeight > 0) return;
    await new Promise<void>((resolve) => {
      const onMeta = () => {
        video.removeEventListener('loadedmetadata', onMeta);
        resolve();
      };
      video.addEventListener('loadedmetadata', onMeta, { once: true });
    });
  }

  private sizeCanvasToVideo() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  private async startCamera() {
    if (this.isCameraRunning) return;
    if (!this.handsInstance) return;

    try {
      const video = this.videoElement.nativeElement;
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = this.mediaStream;

      // ✅ esperar dimensiones reales
      await this.waitLoadedMetadata(video);
      await video.play();
      this.videoReady = video.videoWidth > 0 && video.videoHeight > 0;
      this.sizeCanvasToVideo();

      // ✅ nueva Camera por inicio; solo enviamos si el vídeo está listo
      this.cameraInstance = new Camera(video, {
        onFrame: async () => {
          if (
            this.modo !== 'practicar' ||
            !this.handsInstance ||
            !this.videoReady ||
            video.videoWidth === 0 ||
            video.videoHeight === 0
          ) {
            return;
          }

          // si cambian dimensiones en caliente (drivers), ajusta canvas
          this.sizeCanvasToVideo();

          try {
            await this.handsInstance.send({ image: video });
          } catch {
            // ignorar frames fuera de timing; el siguiente entra bien
          }
        },
        width: video.videoWidth || 640,
        height: video.videoHeight || 480,
      });

      this.cameraInstance.start();
      this.isCameraRunning = true;
    } catch (err) {
      console.error('Error accediendo a la cámara:', err);
      this.isCameraRunning = false;
      this.videoReady = false;
    }
  }

  private stopCamera() {
    try {
      if (this.cameraInstance && (this.cameraInstance as any).stop) {
        (this.cameraInstance as any).stop();
        this.cameraInstance = null;
      }

      const video = this.videoElement?.nativeElement;
      if (this.mediaStream) {
        this.mediaStream.getTracks().forEach(t => t.stop());
        this.mediaStream = null;
      }
      if (video) {
        video.pause();
        video.srcObject = null;
      }

      const canvas = this.canvasElement?.nativeElement;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      this.isCameraRunning = false;
      this.videoReady = false;
    } catch (e) {
      console.warn('Error deteniendo cámara:', e);
      this.isCameraRunning = false;
      this.videoReady = false;
    }
  }

  // =====================================================
  // Acciones UI
  // =====================================================
  async startPractice() {
    this.modo = 'practicar';
    this.resetGesture();
    await this.startCamera();
  }

  async retryGesture() {
    // Reintento limpio (sin cerrar Hands)
    this.modo = 'practicar';
    this.resetGesture();
    this.stopCamera();
    await this.startCamera();
    this.cdr.detectChanges();
  }

  async nextGesture() {
    this.stopCamera();
    if (this.isLast) {
      this.router.navigate([`/lecciones/${this.leccionId}/resultados`]);
      return;
    }
    this.router.navigate([`/lecciones/${this.leccionId}/gestos/${this.gestoId + 1}/practica`]);
  }

  // =====================================================
  // Procesamiento de resultados de MediaPipe
  // =====================================================
  private normalizeHand(landmarks: any[]): number[] {
    const wrist = landmarks[0];
    const mcpMid = landmarks[9];
    const scale =
      Math.sqrt(
        (mcpMid.x - wrist.x) ** 2 +
        (mcpMid.y - wrist.y) ** 2 +
        (mcpMid.z - wrist.z) ** 2
      ) || 1e-6;

    return landmarks.flatMap((l: any) => [
      (l.x - wrist.x) / scale,
      (l.y - wrist.y) / scale,
      (l.z - wrist.z) / scale
    ]);
  }

  private packTwoHands(results: Results): number[] {
    let left = new Array(63).fill(0);
    let right = new Array(63).fill(0);

    if (results.multiHandLandmarks && results.multiHandedness) {
      results.multiHandLandmarks.forEach((lm, i) => {
        const handed = results.multiHandedness![i].label.toLowerCase();
        const feats = this.normalizeHand(lm);
        if (handed === 'left') left = feats; else right = feats;
      });
    }
    return [...left, ...right];
  }

  private onResults(results: Results) {
    // ✅ no procesar si no estamos practicando o el video no está listo
    if (this.modo !== 'practicar' || !this.videoReady) return;

    const canvas = this.canvasElement.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dibujo de la imagen y landmarks
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (results.image) ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

    const flat = this.packTwoHands(results);
    const hasHands = flat.some(v => v !== 0);

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

    // Magnitud de movimiento entre frames (umbral anti-spam)
    let movement = 0;
    if (this.sequence.length >= 2) {
      const prev = this.sequence[this.sequence.length - 2];
      const curr = this.sequence[this.sequence.length - 1];
      movement = prev.reduce((a, v, i) => a + Math.abs(curr[i] - v), 0) / prev.length;
    }

    // Condición de envío a backend
    const ready = hasHands &&
      this.sequence.length === this.SEQUENCE_LENGTH &&
      movement >= this.MIN_MOVEMENT &&
      Date.now() - this.lastSentTime > this.COOLDOWN_MS &&
      !this.sending;

    if (ready) {
      this.lastSentTime = Date.now();
      this.sendToBackend(this.sequence.slice(-this.SEQUENCE_LENGTH));
    }

    this.cdr.detectChanges();
  }

  // =====================================================
  // Backend Flask
  // =====================================================
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

        if (this.confidence >= 0.7 && this.gestoEsperado) {
          const normalize = (s: string) => s.toLowerCase().replace(/_/g, ' ').trim();
          if (normalize(this.prediction) === normalize(this.gestoEsperado!.nombre)) {
            this.feedback = '✅ ¡Correcto!';
            this.nota = Math.round(this.confidence * 100);

            // guarda para el resumen de la lección
            this.saveGestureScore({
              gestoId: this.gestoId,
              nombre: this.gestoEsperado!.nombre,
              nota: this.nota,
            });

            this.modo = 'resultado';
            this.stopCamera(); // pausa cámara en pantalla de resultado
          } else {
            this.feedback = `❌ Detectado "${this.prediction}". Intenta hacer "${this.gestoEsperado.nombre}"`;
          }
        } else {
          this.feedback = 'Predicción con baja confianza';
        }

        this.sending = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.feedback = err.status === 400 ? 'No se detectaron manos' : 'Error en el servidor';
        this.sending = false;
        this.cdr.detectChanges();
      },
    });
  }

  private saveGestureScore(score: GestureScore) {
    const key = `progress_leccion_${this.leccionId}`;
    const stored = JSON.parse(localStorage.getItem(key) || '[]') as GestureScore[];
    const index = stored.findIndex(s => s.gestoId === score.gestoId);
    if (index >= 0) stored[index] = score; else stored.push(score);
    localStorage.setItem(key, JSON.stringify(stored));
  }
}
