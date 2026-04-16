// Semantic Repository for Vector Search
// Capa de Infraestructura (Adaptador)

import { supabase } from "./supabase-client";

export interface SearchResult {
  brandId: string;
  content: string;
  similarity: number;
}

export class SemanticRepository {
  /**
   * Realiza una búsqueda por similitud vectorial en la base de datos.
   * @param embedding Vector de la consulta (1536 dims)
   * @param threshold Umbral de similitud (0-1)
   */
  async searchBrands(
    embedding: number[], 
    threshold: number = 0.7, 
    limit: number = 5
  ): Promise<SearchResult[]> {
    const { data, error } = await supabase.rpc("match_brands", {
      query_embedding: embedding,
      match_threshold: threshold,
      match_count: limit,
    });

    if (error) throw new Error(`Search failed: ${error.message}`);

    return data.map((r: any) => ({
      brandId: r.brand_id,
      content: r.content,
      similarity: r.similarity
    }));
  }

  /**
   * Almacena o actualiza un embedding para una marca.
   */
  async upsertEmbedding(brandId: string, embedding: number[], content: string) {
    const { error } = await supabase
      .from("brand_embeddings")
      .upsert({
        brand_id: brandId,
        embedding: embedding,
        content: content,
        metadata: { updated_at: new Date().toISOString() }
      });

    if (error) throw new Error(`Upsert failed: ${error.message}`);
  }
}
