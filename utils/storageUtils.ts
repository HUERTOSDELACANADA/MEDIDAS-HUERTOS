
const DB_NAME = 'HuertosAppDB';
const STORE_NAME = 'images';
const DB_VERSION = 1;

export const STORAGE_KEYS = {
  SOTANO: 'blueprint_sotano',
  BAJA: 'blueprint_baja',
  PRIMERA: 'blueprint_primera',
  CUBIERTA: 'blueprint_cubierta',
  CALIBRATION: 'room_calibration_data' // New key for coordinate data
};

// Helper to open the database
const getDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
};

export const saveImageToStorage = async (key: string, base64Data: string): Promise<void> => {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(base64Data, key);
        
        request.onsuccess = () => {
            // Dispatch event for live updates
            window.dispatchEvent(new Event('storage-update'));
            resolve();
        };
        
        request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Error saving to IndexedDB", error);
    alert("Error al guardar la imagen en la base de datos.");
    throw error;
  }
};

export const getImageFromStorage = async (key: string): Promise<string | null> => {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(key);
        
        request.onsuccess = () => resolve(request.result as string || null);
        request.onerror = () => resolve(null); // Fail gracefully
    });
  } catch (e) {
    console.warn("Could not read from IndexedDB", e);
    return null;
  }
};

export const clearImageFromStorage = async (key: string): Promise<void> => {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(key);
        
        request.onsuccess = () => {
            window.dispatchEvent(new Event('storage-update'));
            resolve();
        };
        request.onerror = () => reject(request.error);
    });
  } catch (e) {
      console.error("Error clearing image", e);
  }
};

// --- Calibration Logic ---
// We store calibration as a JSON string in the same object store for simplicity, 
// or we could create a new store. Using the same store with a specific key is easier here.

export const saveCalibration = async (data: any): Promise<void> => {
    // Serialize to string
    const jsonString = JSON.stringify(data);
    await saveImageToStorage(STORAGE_KEYS.CALIBRATION, jsonString);
};

export const getCalibration = async (): Promise<any> => {
    const data = await getImageFromStorage(STORAGE_KEYS.CALIBRATION);
    if (!data) return null;
    try {
        return JSON.parse(data);
    } catch (e) {
        console.error("Error parsing calibration data", e);
        return null;
    }
};
