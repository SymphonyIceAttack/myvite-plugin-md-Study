import type { PluginOption } from 'vite';
import path from "path"
import file from "fs"
import { transformMarkdown } from './transformMarkdown';
import { style } from "./assets/juejin.style";
const mdRelationMap = new Map<string, string>();

export default function vitePluginTemplate (): PluginOption {

    return {
        // 插件名称
        name: 'vite:markdown',

        // pre 会较于 post 先执行
        enforce: 'pre', // post

        // 指明它们仅在 'build' 或 'serve' 模式时调用
        transform (code, id, opt) {
            let transformCode = code;
            const vueRE = /\.vue$/;
            const markdownRE = /\<g-markdown.*\/\>/g;
            if (!vueRE.test(id) || !markdownRE.test(code)) return code;
            const mdList: any = code.match(markdownRE);
            const filePathRE: any = /(?<=file=("|')).*(?=('|"))/;
            mdList?.forEach(md => {
                // 匹配 markdown 文件目录
                const fileRelativePaths = md.match(filePathRE);
                if (!fileRelativePaths?.length) return;

                // markdown 文件的相对路径
                const fileRelativePath = fileRelativePaths![0];
                // 找到当前 vue 的目录
                const fileDir = path.dirname(id);
                // 根据当前 vue 文件的目录和引入的 markdown 文件相对路径，拼接出 md 文件的绝对路径
                const filePath = path.resolve(fileDir, fileRelativePath);
                mdRelationMap.set(filePath, id);
                // 读取 markdown 文件的内容
                const mdText = file.readFileSync(filePath, 'utf-8');
                transformCode = transformCode.replace(md, transformMarkdown(mdText));
                //...
            })
         transformCode = `
            ${transformCode}
            <style scoped>
             ${style}
            </style>
         `
            return transformCode;
        },
        handleHotUpdate (ctx) {
            const { file, server, modules } = ctx;

            // 过滤非 md 文件
            if (path.extname(file) !== '.md') return;

            // 找到引入该 md 文件的 vue 文件
            const relationId = mdRelationMap.get(file) as string;
            // 找到该 vue 文件的 moduleNode
            const relationModule = [...server.moduleGraph.getModulesByFile(relationId)!][0];
            // 发送 websocket 消息，进行单文件热重载
            server.ws.send({
                type: 'update',
                updates: [
                    {
                        type: 'js-update',
                        path: relationModule.file!,
                        acceptedPath: relationModule.file!,
                        timestamp: new Date().getTime()
                    }
                ]
            });

            // 指定需要重新编译的模块
            return [...modules, relationModule]
        }


    }
}