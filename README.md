# 思维框架使用图谱

8 维诊断工具:8 个决策场景 → 八维雷达图谱。

## 本地运行
```bash
npm install
npm run dev
```
打开终端显示的本地地址(通常 http://localhost:5173)。

## 部署到 Vercel(给朋友测试)

**方式一:连 GitHub(推荐,可持续更新)**
1. 把这个文件夹 push 到一个 GitHub 仓库
2. 登录 vercel.com → New Project → 选这个仓库
3. Framework 选 Vite(通常自动识别),直接 Deploy
4. 部署完成后 Vercel 给你一个公开链接,发给朋友即可

**方式二:Vercel CLI(最快)**
```bash
npm i -g vercel
vercel
```
按提示走,几十秒出公开链接。

## 说明
- 这是纯前端项目,无后端、无数据库,朋友打开即用,数据不上传任何服务器。
- 之前在 Claude artifact 预览里出现的"取消勾选框不回退"的问题,是预览沙箱的渲染怪癖,在这个标准 React 构建里不会出现。
- 八维雷达图:金色实心=第一反应(本能),虚线外圈=含其余会想(广度)。轴名与下方明细一一对应。
