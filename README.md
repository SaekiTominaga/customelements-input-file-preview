# Show preview with `<input type=file>` by Custom Elements.

[![npm version](https://badge.fury.io/js/%40saekitominaga%2Fcustomelements-input-file-preview.svg)](https://badge.fury.io/js/%40saekitominaga%2Fcustomelements-input-file-preview)

Display image, audio, and video previews in `<input type=file>` by Custom Elements.

## Demo

- [Demo page](https://saekitominaga.github.io/customelements-input-file-preview/demo.html)

## Examples

```
<input type="file" is="x-file-preview"
  data-target-for="preview"
  data-error-message='&lt;strong class="error"&gt;&lt;b&gt;${name}&lt;/b&gt; (${size} byte) cannot be previewed.&lt;/strong&gt;'
  data-max-size="1048576"
/>
<p id="preview"></p>
```

## Attributes

<dl>
<dt>type [optional]</dt>
<dd>This function automatically sets <code>type="file"</code>.
However, it is recommended to manually add <code>type="file"</code> for JavaScript disabled environments and browsers that do not <a href="https://caniuse.com/custom-elementsv1">support Customized built-in elements</a> (Safari 14, Edge Legacy, etc.). According to <a href="https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-type">the description in the HTML specification</a>, <q cite="https://html.spec.whatwg.org/multipage/input.html#attr-input-type">The missing value default and invalid value default are the <a href="https://html.spec.whatwg.org/multipage/input.html#text-(type=text)-state-and-search-state-(type=search)">Text</a> state</q>.</dd>
<dt>data-target-for [required]</dt>
<dd>ID of the element to display the preview. If the element is &lt;ol&gt;, &lt;ul&gt;, the &lt;li&gt; element will be inserted.</dd>
<dt>data-error-message [required]</dt>
<dd>Error message when the file cannot be previewed. You can write HTML markup directly. ${name} in the string is converted to the file name, and ${size} is converted to the file size (in bytes).</dd>
<dt>data-max-size [optional]</dt>
<dd>The number of bytes of maximum file size to preview (Files larger than this will not be previewed, but will not result in an error). If not specified, the default value is 10 MiB.</dd>
</dl>
