export async function GET() {
    const durationMs = 1000; 
    const start = performance.now();
  
    let count = 0;
  
    while (performance.now() - start < durationMs) {
      const m = new Map<number, number>();
      m.set(1, 1);
      count++;
    }
  
    const elapsed = performance.now() - start;
  
    return Response.json({
      mapsCreated: count,
      timeMs: elapsed,
      mapsPerSecond: Math.round((count / elapsed) * 1000),
    });
  }