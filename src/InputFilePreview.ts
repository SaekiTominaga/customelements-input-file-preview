/**
 * Show preview with file upload
 */
export default class InputFilePreview extends HTMLInputElement {
	#targetElement: HTMLElement | null = null; // プレビューを表示する要素
	#maxSize = 10485760; // これ以上のサイズのファイルはプレビューを行わない
	#errorMessageHTML!: string; // エラーメッセージの HTML 断片

	constructor() {
		super();

		this.type = 'file';
	}

	connectedCallback(): void {
		const targetElementId = this.dataset.targetFor;
		if (targetElementId === undefined) {
			throw new Error('Attribute: `data-target-for` is not set.');
		}

		const targetElement = document.getElementById(targetElementId);
		if (targetElement === null) {
			throw new Error(`Element: #${targetElementId} can not found.`);
		}
		this.#targetElement = targetElement;

		const maxSize = this.dataset.maxSize;
		if (maxSize !== undefined) {
			this.#maxSize = Number(maxSize);
		}

		const errorMessageHTML = this.dataset.errorMessage;
		if (errorMessageHTML === undefined) {
			throw new Error('Attribute: `data-error-message` is not set.');
		}
		this.#errorMessageHTML = errorMessageHTML;

		this.addEventListener('change', this._changeEvent, { passive: true });
	}

	disconnectedCallback(): void {
		this.removeEventListener('change', this._changeEvent);
	}

	/**
	 * ファイル選択時の処理
	 */
	private _changeEvent() {
		const targetElement = <HTMLElement>this.#targetElement;
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

			let insertPreviewElement: HTMLElement;
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
			if (size > this.#maxSize || !['image', 'audio', 'video'].includes(type)) {
				insertPreviewElement.insertAdjacentHTML('beforeend', this._convertMessage(this.#errorMessageHTML, file));
				continue;
			}

			const fileReader = new FileReader();
			fileReader.readAsDataURL(file);
			fileReader.addEventListener('load', (): void => {
				const fileReaderResult = <string | null>fileReader.result;

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
	private _convertMessage(message: string, file: File): string {
		return message.replace(/\$\{name\}/g, this._escapeHtml(file.name)).replace(/\$\{size\}/g, String(file.size));
	}

	/**
	 * 文字列を HTML エスケープする
	 *
	 * @param {string} str - 文字列
	 *
	 * @returns {string} エスケープした文字列
	 */
	private _escapeHtml(str: string): string {
		return str.replace(/[&<>"']/g, (match: string): string => {
			const convertStr = new Map<string, string>([
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
