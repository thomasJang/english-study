# Mask
> "mask" is used for prevent user action during running the application.

## setConfig
You previously declared the default settings of the mask UI. The declared set value in this way, are inherited by every time you start it with by `open` method.
```js
var mask = new ax5.ui.mask();
mask.setConfig({
    zIndex: 1000, 
    content: 'Loading content'
});
```
```json
{
    [target: {Element} - target of mask,]
    [theme: {String} -addClass mask,]
    [zIndex: {Number},]
    [content: 'content of mask']
}
```
---

## open
```js
var mask = new ax5.ui.mask();

$('#mask-open').click(function () {
    mask.open();
});
```
**with config**
```js
mask.open({
    target: $('#id').get(0),
    content: 'mask'
});
```
---

## close
```js
var mask = new ax5.ui.mask();

$('#mask-close').click(function () {
    mask.close();
});
```
---

## Using SASS
**src/css/_ax5mask_variables.css** file, there is a variable to be used in the `ax5mask`.
You can be compiled by overriding variables.
```css
$ax5mask-z-index: 1000 !default;
$ax5mask-bg-opacity: 0.6 !default;

$ax5mask-bg: #000 !default;
$ax5mask-text-color: #fff !default;
$ax5mask-text-shadow:0px 1px 0px #000 !default;
```

`src/ax5mask.css` file, you can declare a variable on import of syntax.
```css
$ax5mask-bg: #000;
@import "ax5mask";
```

## Make theme
In some cases, you may need to extend the mask theme.
When you add the syntax of the following CSS, you can easily extend the mask theme.
```css
<style type="text/css">
    .ax-mask.danger .ax-mask-bg {
        background: #7a0000;
    }
</style>
```
And you can use it to add the theme property of the `setConfig` and` open` methods
```js
mask.open({
    theme:'danger'
});
```
