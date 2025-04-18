// dashboard/src/utils/dateUtils.ts
export function getTimeAgo(timestamp: number): string {
    const now = new Date().getTime();
    const diff = now - timestamp;

    // Convertir a segundos
    const seconds = Math.floor(diff / 1000);

    if (seconds < 60) {
        return `hace ${seconds} segundos`;
    }

    // Convertir a minutos
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
        return `hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    }

    // Convertir a horas
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        return `hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    }

    // Convertir a días
    const days = Math.floor(hours / 24);
    return `hace ${days} ${days === 1 ? 'día' : 'días'}`;
}