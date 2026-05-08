export const globalCalculationTracking = {
    inProgress: false,
    instanceCount: 0,
    dataCache: new Map()
};

export const resetGlobalCalculationTracking = () => {
    console.log('[MoonMap] Resetting global calculation tracking');
    globalCalculationTracking.inProgress = false;
    globalCalculationTracking.dataCache.clear();
};
