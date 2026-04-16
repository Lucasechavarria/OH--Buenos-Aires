import { supabase } from "./supabase-client";

/**
 * SecurityGuard: Protección de Acciones Destructivas (HITL Concept)
 * Implementa la postura de privilegio mínimo y validación de impacto.
 */
export const ActionGuard = {
  /**
   * Registra una acción administrativa en el log de auditoría inmutable
   */
  async logAction(params: {
    userId: string;
    action: string;
    entityType: string;
    entityId: string;
    oldData?: any;
    newData?: any;
    requestId?: string;
  }) {
    const { error } = await supabase.from("audit_logs").insert({
      user_id: params.userId,
      action: params.action,
      entity_type: params.entityType,
      entity_id: params.entityId,
      old_data: params.oldData,
      new_data: params.newData,
      request_id: params.requestId,
    });

    if (error) {
      console.error("[CRITICAL] Audit logging failed:", error);
      // En un entorno de cumplimiento estricto, aquí se podría lanzar un error para bloquear la acción
    }
  },

  /**
   * Verifica si una acción cumple con el umbral de seguridad para ejecutarse
   * Implementación conceptual de Human-In-The-Loop (HITL)
   */
  async validateHighImpactAction(actionType: string): Promise<boolean> {
    const highImpactActions = ["DELETE_ALL", "MASS_UPDATE", "DROP_TABLE"];
    
    if (highImpactActions.includes(actionType)) {
      console.warn(`[HITL] Acción de alto impacto detectada: ${actionType}. Se requiere aprobación manual.`);
      return false; // Bloqueado por defecto hasta confirmación HITL
    }
    
    return true;
  }
};
