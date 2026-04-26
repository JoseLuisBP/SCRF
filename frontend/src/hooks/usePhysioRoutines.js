/**
 * usePhysioRoutines — Hook de Axios para operaciones del Fisioterapeuta.
 *
 * Expone:
 *   - getPendingRoutines(): GET  /physio/routines/pending
 *   - verifyRoutine(id):    PATCH /physio/routines/{id}/verify
 *   - createRoutine(data):  POST  /physio/routines
 *   - createExercise(data): POST  /physio/exercises
 *   - verifyExercise(id, notes): PATCH /physio/exercises/{id}/verify
 */
import { useState, useCallback } from 'react';
import axiosInstance from '../api/axios';

export function usePhysioRoutines() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleRequest = useCallback(async (requestFn) => {
        setLoading(true);
        setError(null);
        try {
            const result = await requestFn();
            return result;
        } catch (err) {
            const message =
                err?.response?.data?.detail ??
                err?.message ??
                'Error desconocido';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Obtiene las rutinas ML pendientes de verificación.
     * Un estado vacío (0 rutinas) se trata como 200 [] — nunca propaga error.
     * Un 404 real (endpoint no encontrado) se captura silenciosamente → [].
     * Otros errores (401, 403, 500) sí propagan a handleRequest.
     *
     * @param {number} [skip=0]
     * @param {number} [limit=20]
     * @returns {Promise<Array>} Lista de rutinas con badge="ml_generated" o []
     */
    const getPendingRoutines = useCallback(
        async (skip = 0, limit = 20) => {
            setLoading(true);
            setError(null);
            try {
                const { data } = await axiosInstance.get('/v1/physio/routines/pending', {
                    params: { skip, limit },
                    // Le indicamos al interceptor que NO dispare alert() para este request.
                    // El interceptor lee este flag antes de mostrar dialogs natívos.
                    metadata: { silentNotFound: true },
                });
                return Array.isArray(data) ? data : [];
            } catch (err) {
                const status = err?.response?.status;
                // 404 o respuesta vacía = estado normal, no un error del usuario
                if (status === 404 || status === undefined) {
                    return [];
                }
                // Cualquier otro error sí se propaga al estado de error del hook
                const message =
                    err?.response?.data?.detail ??
                    err?.message ??
                    'Error desconocido';
                setError(message);
                return [];
            } finally {
                setLoading(false);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    /**
     * El Fisio valida una rutina ML.
     * El badge cambia de "ml_generated" → "ml_verified".
     * @param {number} id_rutina
     * @returns {Promise<Object>} Rutina actualizada
     */
    const verifyRoutine = useCallback(
        (id_rutina) =>
            handleRequest(async () => {
                const { data } = await axiosInstance.patch(
                    `/v1/physio/routines/${id_rutina}/verify`
                );
                return data;
            }),
        [handleRequest]
    );

    /**
     * El Fisio crea una rutina manual (badge="physio_verified" automático).
     * @param {Object} routinePayload - { nombre_rutina, descripcion, nivel, duracion_estimada, categoria, ejercicio_ids }
     * @returns {Promise<Object>} Rutina creada
     */
    const createRoutine = useCallback(
        (routinePayload) =>
            handleRequest(async () => {
                const { data } = await axiosInstance.post('/v1/physio/routines', routinePayload);
                return data;
            }),
        [handleRequest]
    );

    /**
     * El Fisio crea un ejercicio clínico verificado.
     * @param {Object} exercisePayload
     * @returns {Promise<Object>} Ejercicio creado
     */
    const createExercise = useCallback(
        (exercisePayload) =>
            handleRequest(async () => {
                const { data } = await axiosInstance.post('/v1/physio/exercises', exercisePayload);
                return data;
            }),
        [handleRequest]
    );

    /**
     * El Fisio verifica clínicamente un ejercicio existente.
     * @param {number} id_ejercicio
     * @param {string|null} [notes] - Notas clínicas opcionales
     * @returns {Promise<Object>} Ejercicio actualizado
     */
    const verifyExercise = useCallback(
        (id_ejercicio, notes = null) =>
            handleRequest(async () => {
                const { data } = await axiosInstance.patch(
                    `/v1/physio/exercises/${id_ejercicio}/verify`,
                    notes ? { notes } : undefined
                );
                return data;
            }),
        [handleRequest]
    );

    return {
        loading,
        error,
        getPendingRoutines,
        verifyRoutine,
        createRoutine,
        createExercise,
        verifyExercise,
    };
}
