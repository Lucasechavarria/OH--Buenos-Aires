# Requerimientos de Información: OH! Assistant

Para elevar la precisión del asistente inteligente, necesitamos definir las respuestas oficiales para las siguientes áreas de negocio e infraestructura.

## 1. Intenciones de Negocio (CTAs)
*   **Comercial / Locales:** ¿Cuál es el link o correo oficial para interesados en alquilar locales? (Ej: `comercial@ohbuenosaires.com` o una página de `/contacto-comercial`).
*   **RRHH / Empleo:** ¿Cómo deben postularse los candidatos? (Ej: Link a LinkedIn, formulario web o correo `talento@...`).
*   **Prensa:** ¿Hay un contacto específico para medios?
*   **Concierge / Consultas Generales:** He configurado `concierge@ohbuenosaires.com` como el destino predeterminado cuando el bot no entiende una consulta. ¿Es este el correo correcto o debemos usar otro?

## 2. Infraestructura y Servicios
*   **Cajeros Automáticos (ATM):** ¿Contamos con cajeros dentro del complejo? Si sí, ¿de qué bancos o en qué nivel?
*   **Cambio de Moneda:** ¿Existe alguna casa de cambio o servicio de cambio de moneda para turistas?
*   **Carga Eléctrica:** ¿Tenemos puestos de carga para vehículos eléctricos (EV Charging)?
*   **Cine / Entretenimiento:** Además de Sacoa, ¿está prevista la apertura de salas de cine?

## 3. Datos de Gastronomía y Agenda
*   **Reservas:** ¿Los locales gastronómicos usan alguna plataforma centralizada (como Meitre o Restorando) o cada uno tiene su propio link?
*   **Agenda:** Para la API de eventos, ¿tienen un calendario de Google o una planilla con los próximos eventos (fechas, nombres, descripciones)?

---
*Nota: Una vez proporcionada esta información, procederemos a codificar las respuestas lógicas y conectar las APIs correspondientes.*
