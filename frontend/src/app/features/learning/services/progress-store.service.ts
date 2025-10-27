import { Injectable } from '@angular/core';

export interface GestureScore {
  gestoId: number;
  nombre: string;
  nota: number; // 0..100
}

interface LessonProgress {
  leccionId: number;
  scores: GestureScore[];
}

@Injectable({ providedIn: 'root' })
export class ProgressStoreService {
  private KEY = 'vision_progress';

  private loadAll(): LessonProgress[] {
    try {
      return JSON.parse(localStorage.getItem(this.KEY) || '[]') as LessonProgress[];
    } catch {
      return [];
    }
  }

  private saveAll(all: LessonProgress[]) {
    localStorage.setItem(this.KEY, JSON.stringify(all));
  }

  addScore(leccionId: number, score: GestureScore) {
    const all = this.loadAll();
    let lp = all.find(x => x.leccionId === leccionId);
    if (!lp) {
      lp = { leccionId, scores: [] };
      all.push(lp);
    }
    // reemplaza si ya existía ese gesto
    const idx = lp.scores.findIndex(s => s.gestoId === score.gestoId);
    if (idx >= 0) lp.scores[idx] = score; else lp.scores.push(score);
    this.saveAll(all);
  }

  getScores(leccionId: number): GestureScore[] {
    return this.loadAll().find(x => x.leccionId === leccionId)?.scores ?? [];
  }

  getAverage(leccionId: number): number {
    const scores = this.getScores(leccionId);
    if (!scores.length) return 0;
    const sum = scores.reduce((a, b) => a + b.nota, 0);
    return +(sum / scores.length).toFixed(1);
  }

  clearLesson(leccionId: number) {
    const all = this.loadAll().filter(x => x.leccionId !== leccionId);
    this.saveAll(all);
  }
}
