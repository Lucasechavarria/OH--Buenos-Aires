// Search Brands Use Case
// Capa de Aplicación (Orquestación)

import { SemanticRepository, SearchResult } from "../infrastructure/semantic-repository";

export interface IEmbeddingProvider {
  generate(text: string): Promise<number[]>;
}

export class SearchBrandsUseCase {
  constructor(
    private semanticRepo: SemanticRepository,
    private embeddingProvider: IEmbeddingProvider
  ) {}

  /**
   * Ejecuta una búsqueda semántica basada en una consulta de texto.
   * @param query Texto en lenguaje natural
   */
  async execute(query: string): Promise<SearchResult[]> {
    // 1. Generar embedding para la consulta
    const embedding = await this.embeddingProvider.generate(query);

    // 2. Buscar en la base de datos vectorial
    return this.semanticRepo.searchBrands(embedding);
  }
}
