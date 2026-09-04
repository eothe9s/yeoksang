(function (root) {
  'use strict';

  const DB_NAME = 'yeoksang-v1';
  const STORE = 'documents';
  const STATE_KEY = 'current-state';
  const FALLBACK_KEY = 'yeoksang_v1_state';

  function openDatabase() {
    return new Promise((resolve, reject) => {
      if (!root.indexedDB) return reject(new Error('IndexedDB unavailable'));
      const request = root.indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(STORE)) database.createObjectStore(STORE);
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('IndexedDB open failed'));
    });
  }

  async function idbGet() {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE, 'readonly');
      const request = transaction.objectStore(STORE).get(STATE_KEY);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error || new Error('IndexedDB read failed'));
      transaction.oncomplete = () => database.close();
    });
  }

  async function idbSet(state) {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE, 'readwrite');
      transaction.objectStore(STORE).put(state, STATE_KEY);
      transaction.oncomplete = () => {
        database.close();
        resolve();
      };
      transaction.onerror = () => reject(transaction.error || new Error('IndexedDB write failed'));
    });
  }

  async function idbDelete() {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE, 'readwrite');
      transaction.objectStore(STORE).delete(STATE_KEY);
      transaction.oncomplete = () => {
        database.close();
        resolve();
      };
      transaction.onerror = () => reject(transaction.error || new Error('IndexedDB delete failed'));
    });
  }

  function validateState(candidate) {
    if (!candidate || typeof candidate !== 'object') throw new Error('JSON 최상위가 객체가 아닙니다.');
    if (candidate.schema !== 1) throw new Error(`지원하지 않는 曆象 schema입니다: ${candidate.schema ?? '없음'}`);
    for (const key of ['settings', 'curriculum', 'tasks', 'exams', 'questionAnalyses']) {
      if (candidate[key] == null) throw new Error(`필수 데이터가 없습니다: ${key}`);
    }
    if (!Array.isArray(candidate.tasks) || !Array.isArray(candidate.curriculum) || !Array.isArray(candidate.exams)) {
      throw new Error('배열 데이터 구조가 올바르지 않습니다.');
    }
    return candidate;
  }

  async function load() {
    try {
      const state = await idbGet();
      if (state) return { state: validateState(state), engine: 'IndexedDB' };
    } catch (error) {
      try {
        const raw = root.localStorage?.getItem(FALLBACK_KEY);
        if (raw) return { state: validateState(JSON.parse(raw)), engine: 'localStorage', warning: error.message };
      } catch (fallbackError) {
        return { state: null, engine: 'memory', warning: `${error.message}; ${fallbackError.message}` };
      }
    }
    return { state: null, engine: root.indexedDB ? 'IndexedDB' : 'memory' };
  }

  async function save(state) {
    const next = root.YeoksangCore.clone(state);
    next.meta ||= {};
    next.meta.lastSavedAt = new Date().toISOString();
    try {
      await idbSet(next);
      return { state: next, engine: 'IndexedDB' };
    } catch (error) {
      try {
        root.localStorage?.setItem(FALLBACK_KEY, JSON.stringify(next));
        return { state: next, engine: 'localStorage', warning: error.message };
      } catch (fallbackError) {
        throw new Error(`저장 실패: ${error.message}; ${fallbackError.message}`);
      }
    }
  }

  async function clear() {
    try { await idbDelete(); } catch { /* fallback below */ }
    try { root.localStorage?.removeItem(FALLBACK_KEY); } catch { /* no-op */ }
  }

  function download(name, contents, type = 'application/json') {
    const blob = contents instanceof Blob ? contents : new Blob([contents], { type });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = name;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function readJsonFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try { resolve(validateState(JSON.parse(reader.result))); }
        catch (error) { reject(error); }
      };
      reader.onerror = () => reject(reader.error || new Error('파일을 읽지 못했습니다.'));
      reader.readAsText(file);
    });
  }

  root.YeoksangStorage = { clear, download, load, readJsonFile, save, validateState };
})(typeof window !== 'undefined' ? window : globalThis);
