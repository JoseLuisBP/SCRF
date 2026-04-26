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
     * @param {number} [skip=0]
     * @param {number} [limit=20]
     * @returns {Promise<Array>} Lista de rutinas con badge="ml_generated"
     */
    const getPendingRoutines = useCallback(
        (skip = 0, limit = 20) =>
            handleRequest(async () => {
                const { data } = await axiosInstance.get('/physio/routines/pending', {
                    params: { skip, limit },
                });
                return data;
            }),
        [handleRequest]
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
                    `/physio/routines/${id_rutina}/verify`
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
                const { data } = await axiosInstance.post('/physio/routines', routinePayload);
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
                const { data } = await axiosInstance.post('/physio/exercises', exercisePayload);
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
                    `/physio/exercises/${id_ejercicio}/verify`,
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
