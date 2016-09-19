import rollup      from 'rollup';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs    from 'rollup-plugin-commonjs';
import uglify      from 'rollup-plugin-uglify';
import sass from 'rollup-plugin-sass';
import postcss from 'rollup-plugin-postcss';
import babel from 'rollup-plugin-babel';



export default {
  entry: 'src/main.js',
  dest: 'dist/build.js', // output a single application bundle
  sourceMap: false,
  format: 'iife',
  plugins: [
      nodeResolve({jsnext: true, module: true}),
      commonjs({
        include: 'node_modules/rxjs/**',
      }),
      uglify(),
      sass(),
      postcss({
        extensions: [ '.css' ],
      }),
      babel()
  ]
}
