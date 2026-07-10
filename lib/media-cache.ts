export const getMediaDB = () => {
    return new Promise<IDBDatabase>((resolve, reject) => {
        if (typeof window === 'undefined') return reject("No window");
        const request = window.indexedDB.open('IntilaqaMediaDB', 1);
        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains('media')) {
                db.createObjectStore('media');
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const saveMediaToIDB = async (key: string, data: any) => {
    try {
        const db = await getMediaDB();
        const tx = db.transaction('media', 'readwrite');
        tx.objectStore('media').put(data, key);
    } catch (e) {
        console.error('IDB Save Error:', e);
    }
};

export const getMediaFromIDB = async (key: string): Promise<any> => {
    try {
        const db = await getMediaDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('media', 'readonly');
            const req = tx.objectStore('media').get(key);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    } catch (e) {
        return null;
    }
};
