```
<!-- PixiJS must be imported before @pixi/sound -->
<script src="https://unpkg.com/pixi.js/dist/browser/pixi.min.js"></script>

<!-- found here, if not using CDN "./node_modules/@pixi/sound/dist/pixi-sound.js" -->
<script src="https://unpkg.com/@pixi/sound/dist/pixi-sound.js"></script>

<script>
    PIXI.sound.add('my-sound', 'path/to/file.mp3');
    PIXI.sound.play('my-sound');
</script>

```