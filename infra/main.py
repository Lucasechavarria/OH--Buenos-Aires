import pulumi
import pulumi_vercel as vercel # type: ignore

# Configuración de variables de entorno con cifrado Pulumi ESC
# Garantiza que los secretos no se expongan en los registros de auditoría
config = pulumi.Config()
database_url = config.require_secret("database_url")
supabase_service_key = config.require_secret("supabase_service_role_key")

# Definición del proyecto en Vercel con reglas de Zero-Trust
vercel_project = vercel.Project("oh-buenos-aires-prod",
    name="oh-buenos-aires-prod",
    framework="nextjs",
    # Las variables de entorno solo están disponibles en el entorno de producción
    # y nunca se exponen al cliente (Target: ["production"])
    environment_variables=[
        vercel.ProjectEnvironmentVariableArgs(
            key="DATABASE_URL",
            value=database_url,
            targets=["production"],
        ),
        vercel.ProjectEnvironmentVariableArgs(
            key="SUPABASE_SERVICE_ROLE_KEY",
            value=supabase_service_key,
            targets=["production"],
        ),
        vercel.ProjectEnvironmentVariableArgs(
            key="NEXT_PUBLIC_MAPS_STUB", # Solo IDs públicos al cliente
            value="sb_maps_prod_2026",
            targets=["production", "preview"],
        ),
    ]
)

# Exportar el ID del proyecto para integración con GitHub Actions
pulumi.export("vercel_project_id", vercel_project.id)
