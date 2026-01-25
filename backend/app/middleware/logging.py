import time
import json
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from app.core.logging import logger
from app.db.mongodb import mongodb
from datetime import datetime

class LogRequestsMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # Procesar la petición
        try:
            response = await call_next(request)
        except Exception as e:
            # Si hay un error no manejado, lo registramos y re-lanzamos
            process_time = (time.time() - start_time) * 1000
            await self._log_request(request, 500, process_time, error=str(e))
            raise e

        # Calcular tiempo de procesamiento
        process_time = (time.time() - start_time) * 1000
        
        # Registrar petición en background (fire and forget para no bloquear)
        # Nota: En FastAPI/Starlette, para tareas background reales se recomienda BackgroundTasks,
        # pero dentro de un middleware 'dispatch' tenemos que hacerlo aquí o usar una cola.
        # Dado que motor es async, podemos hacerlo await sin bloquear el event loop principal demasiado.
        try:
            await self._log_request(request, response.status_code, process_time)
        except Exception as e:
            logger.error(f"Error escribiendo log de acceso en MongoDB: {e}")

        return response

    async def _log_request(self, request: Request, status_code: int, process_time_ms: float, error: str = None):
        """Escribe el log en la colección de analytics de MongoDB"""
        
        # Ignorar health checks para no saturar logs
        if request.url.path in ["/", "/health", "/docs", "/redoc", "/openapi.json"]:
            return

        try:
            log_entry = {
                "timestamp": datetime.utcnow(),
                "method": request.method,
                "path": request.url.path,
                "query_params": str(request.query_params),
                "client_host": request.client.host if request.client else None,
                "user_agent": request.headers.get("user-agent"),
                "status_code": status_code,
                "process_time_ms": round(process_time_ms, 2),
                "error": error
            }

            # Intentar obtener el usuario si está autenticado (depende de cómo se maneje auth en middlewares previos)
            # En este punto el request state podría no tener el user si el auth middleware corre después o de otra forma.
            # Intento básico de leer header Authorization si fuera necesario, pero por ahora lo dejamos simple.
            
            analytics_collection = await mongodb.get_collection("analytics")
            await analytics_collection.insert_one(log_entry)
            
        except Exception as e:
            # Fallback a logger de archivo si falla mongo
            logger.error(f"Fallo al guardar log en Mongo: {e}")
