module.exports = function (api) {
    return {
        presets: [
            ['@babel/preset-env', {targets: {node: 'current'}}],
            '@babel/preset-typescript',
          ],
        plugins: ['macros'],
    }
}
