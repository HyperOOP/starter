const typescript = require('rollup-plugin-typescript2');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

const { seq, cmd, all } = require("faqtor");

const { roll } = require("faqtor-of-rollup");
const { minify } = require("faqtor-of-uglify");
const bsync = require("faqtor-of-browser-sync");
const { watch } = require("faqtor-of-watch");

const
    bs = bsync.create("HyperOOP Starter"),
    builtPath = "site/dist",
    lessSource = "src/style.less",
    lessDest = `${builtPath}/css/style.css`,
    indexSrc = "src/index.tsx",
    indexDst = `${builtPath}/js/index.js`,
    indexMinDst = `${builtPath}/js/index.min.js`,
    toClean = [builtPath],
    toWipe = toClean.concat(["./node_modules", "./.rpt2_cache"]),
    watchDebounce = 2000;

const
    rollupPlugins = [
        typescript({
            typescript: require('typescript'),
            tsconfig: "./tsconfig.json",
        }),
        resolve(),
        commonjs({
            namedExports: {}
        })
    ],
    rollupIndexCfg = {
        input: indexSrc,
        output: {
            file: indexDst,
            format: "umd",
            sourcemap: true,
        },
        plugins: rollupPlugins,    
    },
    bsConfig = {
        server: {
            injectChanges: true,
            baseDir: "site",
            reloadDebounce: 10000,
        }
    };

const less = (src, dst, rewriteURLs = "all", cleanCSS = "'--s1 --advanced --compatibility=ie8'") =>
    cmd(`lessc --rewrite-urls=${rewriteURLs} ${src} ${dst} --clean-css ${cleanCSS}`)
        .task(`building CSS file ${dst}`)
        .factor(src, dst);

const
    buildCSS = less(lessSource, lessDest),
    buildIndex = roll(rollupIndexCfg)
        .task("building index.js")
        .factor(["src/**/*.ts", "src/**/*.tsx"], indexDst),
    uglify = minify(indexDst, indexMinDst)
        .factor()
        .task("minifying 'index.js'"),
    buildAllList = [buildCSS, buildIndex, uglify],
    build = seq(...buildAllList)
        .task("build all"),
    clean = cmd(`rimraf ${toClean.join(" ")}`),
    wipe = cmd(`rimraf ${toWipe.join(" ")}`);
    reload = bs.reload("site/**/*").factor(),
    serve = bs.init(bsConfig),
    start = seq(build, all(serve, watch(buildAllList.concat([reload]), watchDebounce)));

module.exports = { build, start, clean, wipe };