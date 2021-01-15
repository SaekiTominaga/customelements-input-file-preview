var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _targetElement, _maxSize, _errorMessageHTML;
/**
 * Show preview with file upload
 *
 * @version 1.0.0
 */
export default class InputFilePreview extends HTMLInputElement {
    constructor() {
        super();
        _targetElement.set(this, null); // プレビューを表示する要素
        _maxSize.set(this, 10485760); // これ以上のサイズのファイルはプレビューを行わない
        _errorMessageHTML.set(this, void 0); // エラーメッセージの HTML 断片
        this.type = 'file';
    }
    connectedCallback() {
        const targetElementId = this.dataset.targetFor;
        if (targetElementId === undefined) {
            throw new Error('Attribute: `data-target-for` is not set.');
        }
        const targetElement = document.getElementById(targetElementId);
        if (targetElement === null) {
            throw new Error(`Element: #${targetElementId} can not found.`);
        }
        __classPrivateFieldSet(this, _targetElement, targetElement);
        const maxSize = this.dataset.maxSize;
        if (maxSize !== undefined) {
            __classPrivateFieldSet(this, _maxSize, Number(maxSize));
        }
        const errorMessageHTML = this.dataset.errorMessage;
        if (errorMessageHTML === undefined) {
            throw new Error('Attribute: `data-error-message` is not set.');
        }
        __classPrivateFieldSet(this, _errorMessageHTML, errorMessageHTML);
        this.addEventListener('change', this._changeEvent, { passive: true });
    }
    disconnectedCallback() {
        this.removeEventListener('change', this._changeEvent);
    }
    /**
     * ファイル選択時の処理
     */
    _changeEvent() {
        const targetElement = __classPrivateFieldGet(this, _targetElement);
        if (targetElement.hasChildNodes()) {
            /* いったん空にする */
            while (targetElement.firstChild !== null) {
                targetElement.firstChild.remove();
            }
        }
        const files = this.files;
        if (files === null) {
            return;
        }
        for (const file of files) {
            const name = file.name;
            const size = file.size;
            const [type] = file.type.split('/', 2);
            let insertPreviewElement;
            switch (targetElement.tagName.toLowerCase()) {
                case 'ol':
                case 'ul': {
                    const liElement = document.createElement('li');
                    targetElement.appendChild(liElement);
                    insertPreviewElement = liElement;
                    break;
                }
                default: {
                    insertPreviewElement = targetElement;
                }
            }
            /* ファイルサイズ、 MIME タイプのチェック */
            if (size > __classPrivateFieldGet(this, _maxSize) || !['image', 'audio', 'video'].includes(type)) {
                insertPreviewElement.insertAdjacentHTML('beforeend', this._convertMessage(__classPrivateFieldGet(this, _errorMessageHTML), file));
                continue;
            }
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.addEventListener('load', () => {
                const fileReaderResult = fileReader.result;
                if (fileReaderResult === null) {
                    throw new Error('File load failed.');
                }
                switch (type) {
                    case 'image': {
                        const imageElement = document.createElement('img');
                        imageElement.src = fileReaderResult;
                        imageElement.alt = name;
                        insertPreviewElement.appendChild(imageElement);
                        break;
                    }
                    case 'audio': {
                        const audioElement = document.createElement('audio');
                        audioElement.src = fileReaderResult;
                        audioElement.controls = true;
                        audioElement.textContent = name;
                        insertPreviewElement.appendChild(audioElement);
                        break;
                    }
                    case 'video': {
                        const videoElement = document.createElement('video');
                        videoElement.src = fileReaderResult;
                        videoElement.controls = true;
                        videoElement.textContent = name;
                        insertPreviewElement.appendChild(videoElement);
                        break;
                    }
                }
            });
        }
    }
    /**
     * 画面に表示するメッセージを変換する
     *   ${name} → ファイル名
     *   ${size} → ファイルサイズ
     *
     * @param {string} message - 変換前のメッセージ
     * @param {File} file - <input type="file"/> で選択されたファイル情報
     *
     * @returns {string} 変換後のメッセージ
     */
    _convertMessage(message, file) {
        return message.replace(/\$\{name\}/g, this._escapeHtml(file.name)).replace(/\$\{size\}/g, String(file.size));
    }
    /**
     * 文字列を HTML エスケープする
     *
     * @param {string} str - 文字列
     *
     * @returns {string} エスケープした文字列
     */
    _escapeHtml(str) {
        return str.replace(/[&<>"']/g, (match) => {
            const convertStr = new Map([
                ['&', '&amp;'],
                ['<', '&lt;'],
                ['>', '&gt;'],
                ['"', '&quot;'],
                ["'", '&#39;'],
            ]).get(match);
            return convertStr === undefined ? match : convertStr;
        });
    }
}
_targetElement = new WeakMap(), _maxSize = new WeakMap(), _errorMessageHTML = new WeakMap();
//# sourceMappingURL=InputFilePreview.js.map