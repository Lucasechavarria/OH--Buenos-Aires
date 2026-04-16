// Mock Embedding Provider for Development
// Implementación de referencia (Adaptador)

import { IEmbeddingProvider } from "../application/search_brands_use_case";

export class MockEmbeddingProvider implements IEmbeddingProvider {
  async generate(text: string): Promise<number[]> {
    console.log(`[Mock] Generating embedding for: "${text}"`);
    // Retorna un vector determinista de 1536 dimensiones para pruebas
    return new Array(1536).fill(0).map((_, i) => Math.sin(i + text.length));
  }
}
