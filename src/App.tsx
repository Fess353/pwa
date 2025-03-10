import { useEffect, useState } from 'react';

const App = () => {
  const [imageSrc, setImageSrc] = useState(null);

  // Инициализация IndexedDB при старте
  useEffect(() => {
    initializeIndexedDB().then(() => {
      getImageFromIndexedDB().then((imageData) => {
        if (imageData) {
          // @ts-expect-error test
          setImageSrc(imageData);
        }
      });
    });
  }, []);

  // Функция для инициализации IndexedDB
  const initializeIndexedDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('imageDB', 1);

      request.onupgradeneeded = (event) => {
        // @ts-expect-error test
        const db = event.target.result;
        if (!db.objectStoreNames.contains('images')) {
          db.createObjectStore('images', { keyPath: 'id' });
        }
      };

      request.onsuccess = (event) => {
        // @ts-expect-error test
        const db = event.target.result;
        db.close();
        // @ts-expect-error test
        resolve();
      };

      request.onerror = (event) => {
        // @ts-expect-error test
        console.error('Ошибка открытия IndexedDB:', event.target.error);
        // @ts-expect-error test
        reject(event.target.error);
      };
    });
  };

  // Функция для скачивания случайной картинки
  const downloadRandomImage = async () => {
    try {
      const response = await fetch('https://picsum.photos/200/300');
      const blob = await response.blob();
      const imageData = await blobToBase64(blob);
      // @ts-expect-error test
      setImageSrc(imageData);
      saveImageToIndexedDB(imageData);
    } catch (error) {
      console.error('Ошибка при скачивании картинки:', error);
    }
  };

  // Преобразование Blob в base64
  // @ts-expect-error test
  const blobToBase64 = (blob) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  // Сохранение картинки в IndexedDB
  // @ts-expect-error test
  const saveImageToIndexedDB = (imageData) => {
    const request = indexedDB.open('imageDB', 1);

    request.onsuccess = (event) => {
      // @ts-expect-error test
      const db = event.target.result;
      const transaction = db.transaction(['images'], 'readwrite');
      const store = transaction.objectStore('images');
      store.put({ id: 'cachedImage', data: imageData });

      transaction.oncomplete = () => {
        db.close();
      };
      // @ts-expect-error test

      transaction.onerror = (error) => {
        console.error('Ошибка сохранения в IndexedDB:', error);
      };
    };

    request.onerror = (event) => {
      // @ts-expect-error test
      console.error('Ошибка открытия IndexedDB:', event.target.error);
    };
  };

  // Получение картинки из IndexedDB
  const getImageFromIndexedDB = () => {
    return new Promise((resolve) => {
      const request = indexedDB.open('imageDB', 1);

      request.onsuccess = (event) => {
        // @ts-expect-error test
        const db = event.target.result;
        const transaction = db.transaction(['images'], 'readonly');
        const store = transaction.objectStore('images');
        const getRequest = store.get('cachedImage');

        getRequest.onsuccess = () => {
          resolve(getRequest.result?.data || null);
          db.close();
        };

        getRequest.onerror = () => {
          console.error('Ошибка получения данных из IndexedDB');
          db.close();
          resolve(null);
        };
      };

      request.onerror = (event) => {
        // @ts-expect-error test
        console.error('Ошибка открытия IndexedDB:', event.target.error);
        resolve(null);
      };
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Скачать случайную картинку</h1>
      <button onClick={downloadRandomImage}>Скачать</button>
      {imageSrc && (
        <div style={{ marginTop: '20px' }}>
          <img
            src={imageSrc}
            alt="Random Image"
            style={{ maxWidth: '100%', border: '1px solid #ccc' }}
          />
        </div>
      )}
    </div>
  );
};

export default App;