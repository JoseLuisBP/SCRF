/**
 * VerificationBadge — Componente de sello de verificación clínica.
 *
 * Badge States (vienen del campo `verification_badge` del backend):
 *  - "physio_verified" → Verde esmeralda: creado y validado por Fisioterapeuta
 *  - "ml_verified"     → Índigo: generado por IA y revisado por Fisioterapeuta
 *  - "ml_generated"    → Ámbar: generado por IA, pendiente de revisión
 */
import { Chip, Tooltip } from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PsychologyIcon from '@mui/icons-material/Psychology';

const BADGE_CONFIG = {
    physio_verified: {
        label: 'Verificado por Profesional',
        color: '#10B981',      // emerald-500
        bgColor: '#D1FAE5',    // emerald-100
        borderColor: '#34D399',
        icon: <VerifiedUserIcon sx={{ fontSize: 14 }} />,
        tooltip:
            'Esta rutina fue creada y validada clínicamente por un Fisioterapeuta certificado',
    },
    ml_verified: {
        label: 'IA + Verificado',
        color: '#6366F1',      // indigo-500
        bgColor: '#E0E7FF',    // indigo-100
        borderColor: '#818CF8',
        icon: <AutoAwesomeIcon sx={{ fontSize: 14 }} />,
        tooltip:
            'Generada por el algoritmo CART y revisada clínicamente por un Fisioterapeuta',
    },
    ml_generated: {
        label: 'Generada por IA',
        color: '#D97706',      // amber-600
        bgColor: '#FEF3C7',    // amber-100
        borderColor: '#FCD34D',
        icon: <PsychologyIcon sx={{ fontSize: 14 }} />,
        tooltip:
            'Rutina generada automáticamente por el algoritmo CART. Pendiente de revisión profesional.',
    },
};

/**
 * @param {Object}  props
 * @param {string}  props.badge  - "physio_verified" | "ml_verified" | "ml_generated"
 * @param {"small"|"medium"} [props.size="small"]
 * @param {Object}  [props.sx]   - Estilos MUI adicionales
 */
export default function VerificationBadge({ badge, size = 'small', sx = {} }) {
    const config = BADGE_CONFIG[badge] ?? BADGE_CONFIG.ml_generated;

    return (
        <Tooltip title={config.tooltip} arrow placement="top">
            <Chip
                icon={config.icon}
                label={config.label}
                size={size}
                sx={{
                    backgroundColor: config.bgColor,
                    color: config.color,
                    border: `1px solid ${config.borderColor}`,
                    fontWeight: 600,
                    fontSize: size === 'small' ? '0.7rem' : '0.8rem',
                    letterSpacing: '0.02em',
                    cursor: 'default',
                    '& .MuiChip-icon': {
                        color: config.color,
                    },
                    transition: 'box-shadow 0.2s ease',
                    '&:hover': {
                        boxShadow: `0 0 0 3px ${config.borderColor}40`,
                    },
                    ...sx,
                }}
            />
        </Tooltip>
    );
}
