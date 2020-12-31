/**
 * Show preview with file upload
 *
 * @version 1.0.0
 */
export default class InputFilePreview extends HTMLInputElement {
    #private;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    /**
     * ファイル選択時の処理
     */
    private _changeEvent;
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
    private _convertMessage;
    /**
     * 文字列を HTML エスケープする
     *
     * @param {string} str - 文字列
     *
     * @returns {string} エスケープした文字列
     */
    private _escapeHtml;
}
//# sourceMappingURL=InputFilePreview.esm.d.ts.map