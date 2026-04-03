export function hotScore(score: number, createdAt: number): number {
    const s = score;
    const order = Math.log10(Math.max(Math.abs(s), 1));
    const sign = s > 0 ? 1 : s < 0 ? -1 : 0;
    const seconds = createdAt / 1000 - 1134028003; 
    const cal = sign + order * seconds / 45000;
    return Math.round(cal*100000)/100000;
  }