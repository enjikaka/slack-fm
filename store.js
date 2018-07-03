/**
 * Wrap chrome storage callback methods to be
 * Promise-based.
 *
 * @see https://developer.chrome.com/extensions/storage
 */
class ChromeStorage {
  static setItem (key, value) {
    return new Promise(resolve => {
      chrome.storage.sync.set({
        [key]: value
      }, () => resolve());
    });
  }

  static getItem (key) {
    return new Promise(resolve => {
      chrome.storage.sync.get(key, result => resolve(result.key));
    });
  }

  static removeItem (key) {
    return new Promise(resolve => {
      chrome.storage.sync.remove([key], () => resolve());
    });
  }
}

/**
 * Abstraction to Store stuff in localStorage for web browsers,
 * or in chrome.storage for Chrome Browser Extention.
 *
 * Implements a localStorage-like interface, but all
 * calls return promises.
 */
export default class Storage {

  /** @typedef {'browser'|'chrome-extension'} StorageMode */

  /**
  * @type {StorageMode} mode
  */
  constructor (mode = 'browser') {
    this._mode = mode;
  }

  /**
   * Sets an item in localStorage or chrome.storage.
   *
   * @param {string} key
   * @param {string} value
   */
  async setItem (key, value) {
    if (mode === 'chrome-extension') {
      return ChromeStorage.setItem(key);
    } else {
      return localStorage.setItem(key, value);
    }
  }

  /**
   * Gets an item from localStorage or chrome.storage.
   *
   * @param {string} key
   */
  async getItem (key) {
    if (mode === 'chrome-extension') {
      return ChromeStorage.getItem(key);
    } else {
      return localStorage.getItem(key);
    }
  }

  /**
   * Removes an item from localStorage or chrome.storage.
   *
   * @param {string} key
   */
  removeItem (key) {
    if (mode === 'chrome-extension') {
      ChromeStorage.removeItem(key);
    } else {
      localStorage.removeItem(key);
    }
  }
}
