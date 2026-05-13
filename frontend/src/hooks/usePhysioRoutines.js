/**
 * usePhysioRoutines — Hook de Axios para operaciones del Fisioterapeuta.
 *
 * Expone:
 *   - getStats():                     GET  /physio/stats
 *   - getAllExercises(skip, limit):    GET  /physio/exercises
 *   - getUnverifiedExercises():        GET  /physio/exercises/unverified
 *   - createExercise(data):            POST  /physio/exercises
 *   - verifyExercise(id, notes):       PATCH /physio/exercises/{id}/verify
 *   - updateExercise(id, data):        PATCH /physio/exercises/{id}
 *   - toggleExerciseActive(id):        PATCH /physio/exercises/{id}/toggle-active
 *   - getPendingRoutines(skip, limit): GET  /physio/routines/pending
 *   - createRoutine(data):             POST  /physio/routines
 *   - verifyRoutine(id):               PATCH /physio/routines/{id}/verify
 *   - rejectRoutine(id, motivo):       PATCH /physio/routines/{id}/reject
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

    // ─── ESTADÍSTICAS ────────────────────────────────────────────────────────

    const getStats = useCallback(
        () =>
            handleRequest(async () => {
                const { data } = await axiosInstance.get('/v1/physio/stats');
                return data;
            }),
        [handleRequest]
    );

    // ─── EJERCICIOS ──────────────────────────────────────────────────────────

    /**
     * Lista todos los ejercicios (activos e inactivos) para gestión del fisio.
     */
    const getAllExercises = useCallback(
        (skip = 0, limit = 200) =>
            handleRequest(async () => {
                const { data } = await axiosInstance.get('/v1/physio/exercises', {
                    params: { skip, limit },
                });
                return Array.isArray(data) ? data : [];
            }),
        [handleRequest]
    );

    /**
     * Lista ejercicios activos sin verificación clínica.
     */
    const getUnverifiedExercises = useCallback(
        (skip = 0, limit = 100) =>
            handleRequest(async () => {
                const { data } = await axiosInstance.get('/v1/physio/exercises/unverified', {
                    params: { skip, limit },
                });
                return Array.isArray(data) ? data : [];
            }),
        [handleRequest]
    );

    /**
     * Crea un ejercicio clínico verificado.
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
     * Verifica clínicamente un ejercicio existente.
     * @param {number} id_ejercicio
     * @param {string|null} notes - Notas clínicas opcionales
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

    /**
     * Edita los datos de un ejercicio existente.
     * @param {number} id_ejercicio
     * @param {Object} updateData - Campos a actualizar (parcial)
     */
    const updateExercise = useCallback(
        (id_ejercicio, updateData) =>
            handleRequest(async () => {
                const { data } = await axiosInstance.patch(
                    `/v1/physio/exercises/${id_ejercicio}`,
                    updateData
                );
                return data;
            }),
        [handleRequest]
    );

    /**
     * Activa o desactiva un ejercicio.
     * @param {number} id_ejercicio
     */
    const toggleExerciseActive = useCallback(
        (id_ejercicio) =>
            handleRequest(async () => {
                const { data } = await axiosInstance.patch(
                    `/v1/physio/exercises/${id_ejercicio}/toggle-active`
                );
                return data;
            }),
        [handleRequest]
    );

    // ─── RUTINAS ─────────────────────────────────────────────────────────────

    /**
     * Lista rutinas ML pendientes de verificación.
     * 404 o respuesta vacía se tratan como estado normal → [].
     */
    const getPendingRoutines = useCallback(
        async (skip = 0, limit = 20) => {
            setLoading(true);
            setError(null);
            try {
                const { data } = await axiosInstance.get('/v1/physio/routines/pending', {
                    params: { skip, limit },
                    metadata: { silentNotFound: true },
                });
                return Array.isArray(data) ? data : [];
            } catch (err) {
                const status = err?.response?.status;
                if (status === 404 || status === undefined) return [];
                const message =
                    err?.response?.data?.detail ?? err?.message ?? 'Error desconocido';
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
     * Crea una rutina clínica manual con verificación automática.
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
     * Valida una rutina ML — badge cambia a "ml_verified".
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
     * Rechaza una rutina ML con motivo clínico.
     * La rutina sale de la cola de pendientes y queda en el log de auditoría.
     * @param {number} id_rutina
     * @param {string} motivo - Motivo clínico del rechazo
     */
    const rejectRoutine = useCallback(
        (id_rutina, motivo) =>
            handleRequest(async () => {
                const { data } = await axiosInstance.patch(
                    `/v1/physio/routines/${id_rutina}/reject`,
                    motivo,
                    { headers: { 'Content-Type': 'application/json' } }
                );
                return data;
            }),
        [handleRequest]
    );

    return {
        loading,
        error,
        // estadísticas
        getStats,
        // ejercicios
        getAllExercises,
        getUnverifiedExercises,
        createExercise,
        verifyExercise,
        updateExercise,
        toggleExerciseActive,
        // rutinas
        getPendingRoutines,
        createRoutine,
        verifyRoutine,
        rejectRoutine,
    };
}
