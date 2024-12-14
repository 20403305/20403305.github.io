+++
title = '如何在github action中配置hugo'
date = 2024-12-13T19:04:36+08:00
draft = false
+++

<!--more-->

这是文章的详细内容，会在点击“阅读全文”后显示。

在 GitHub Actions 中配置 **Hugo** 的步骤如下：

1. **设置 GitHub Actions 工作流文件**：你需要创建一个 GitHub Actions 工作流文件，通常位于 `.github/workflows/` 目录下，名为 `deploy.yml` 或类似的名称。
2. **安装和配置 Hugo**：你可以使用 `peaceiris/actions-hugo` GitHub Action 来自动安装和配置 Hugo。

下面是一个完整的工作流配置示例，演示了如何在 GitHub Actions 中设置和配置 Hugo，并自动将 Hugo 网站部署到 GitHub Pages。

### 步骤 1：创建工作流文件

1. 在你的 Hugo 项目中，创建 `.github/workflows` 目录（如果还没有的话）。
2. 在 `.github/workflows` 目录下创建一个名为 `deploy.yml` 的工作流文件。

```bash
mkdir -p .github/workflows
touch .github/workflows/deploy.yml
```

### 步骤 2：编辑工作流文件

在 `deploy.yml` 中，配置如下内容：

```yaml
name: Deploy Hugo site to GitHub Pages

on:
  push:
    branches:
      - main  # 当推送到 main（或你使用的默认分支）时触发构建
  workflow_dispatch:  # 允许手动触发工作流

permissions:
  contents: read  # 读取仓库内容
  pages: write    # 写入 GitHub Pages
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false  # 允许同时运行多个工作流实例，但不取消进行中的任务

jobs:
  build:
    runs-on: ubuntu-latest  # 使用 Ubuntu 最新版本的环境

    steps:
      # 检出仓库代码
      - name: Checkout code
        uses: actions/checkout@v4

      # 设置 Hugo
      - name: Set up Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: '0.128.0'  # 指定 Hugo 的版本，可以根据需要调整

      # 构建 Hugo 网站
      - name: Build the Hugo site
        run: hugo --minify  # 生成静态文件并进行压缩

      # 上传构建的静态文件到 GitHub Pages
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./public  # Hugo 构建结果会在 public 目录下

  deploy:
    runs-on: ubuntu-latest
    needs: build  # 依赖于 build 作业，确保先构建后部署
    steps:
      # 部署到 GitHub Pages
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
        with:
          branch: gh-pages  # 将构建的文件推送到 `gh-pages` 分支
          folder: ./public  # Hugo 输出的静态文件目录
```

### 解释工作流文件

1. **触发条件 (`on`)**：
   - `push`: 当推送到 `main`（或你选择的默认分支）时，触发构建和部署流程。
   - `workflow_dispatch`: 允许手动触发此工作流。

2. **权限配置 (`permissions`)**：
   - `contents: read`: 允许读取仓库内容。
   - `pages: write`: 允许将构建内容推送到 GitHub Pages。
   - `id-token: write`: 用于获取 GitHub Pages 的访问权限。

3. **并发配置 (`concurrency`)**：
   - 这个配置确保不会有多个构建并行执行，而是等当前部署完成后再执行下一个部署。

4. **作业 `build`**：
   - `actions/checkout@v4`: 检出 GitHub 仓库代码。
   - `peaceiris/actions-hugo@v2`: 设置 Hugo，安装指定版本的 Hugo（如 `0.128.0`）。
   - `hugo --minify`: 执行 Hugo 命令生成静态网站，并将文件输出到 `public/` 目录。
   - `actions/upload-pages-artifact@v3`: 上传 `public/` 目录中的构建文件，以便后续部署。

5. **作业 `deploy`**：
   - 使用 `actions/deploy-pages@v4` 将 `public/` 目录中的文件部署到 `gh-pages` 分支，供 GitHub Pages 提供服务。

### 步骤 3：配置 GitHub Pages

确保你已经配置了 GitHub Pages：

1. 进入你的 GitHub 仓库。
2. 在仓库的 **Settings** > **Pages** 部分，选择 `gh-pages` 分支作为源。

### 步骤 4：推送工作流文件并验证

1. 提交并推送 `.github/workflows/deploy.yml` 文件到你的仓库。

```bash
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions workflow for Hugo site"
git push origin main
```

2. 每当你向 `main` 分支推送更新时，GitHub Actions 会自动构建 Hugo 网站并将其部署到 `gh-pages` 分支。
3. 你可以通过访问 `https://<your-username>.github.io/<your-repository>` 来查看部署的 Hugo 网站。

### 步骤 5：查看构建日志和部署状态

1. 在 GitHub 仓库中，点击 **Actions** 标签页查看工作流的执行情况。
2. 如果一切顺利，网站将自动部署到 GitHub Pages。

### 总结

通过 GitHub Actions 自动化 Hugo 网站的部署步骤：

1. 创建 `.github/workflows/deploy.yml` 工作流文件。
2. 配置 Hugo 安装、构建并上传静态文件。
3. 配置部署到 `gh-pages` 分支。
4. 提交并推送到 GitHub 仓库，GitHub Actions 会自动构建并部署 Hugo 网站。

通过这种方式，你就能轻松地自动化 Hugo 网站的构建和发布过程，无需手动干预。


### 其他问题
在哪个分支下创建deploy.yml。我的主分支是master，还有一个gh-pages

在 GitHub Actions 中创建工作流文件 (`deploy.yml`) 的位置应当是 **主分支**，也就是你的 `master` 分支（或你项目中的默认分支）。通常，GitHub Actions 文件放在主分支下，因为它是管理仓库和启动自动化任务的核心分支。

### 具体步骤：

1. **工作流文件的位置**：
   - 工作流文件应该放在仓库的 `master` 分支下，路径是 `.github/workflows/deploy.yml`。这个文件将会在 `master` 分支发生更改时被触发。
   
2. **工作流触发的分支**：
   - 在 `deploy.yml` 文件中，你会配置触发器 `on.push.branches` 来指定工作流在哪个分支上触发。例如，下面的配置会在 `master` 分支发生 push 时触发工作流：
   
   ```yaml
   on:
     push:
       branches:
         - master  # 触发条件：当推送到 master 分支时触发
   ```

3. **部署到 `gh-pages` 分支**：
   - 即使工作流文件在 `master` 分支下，部署时可以将静态站点部署到 `gh-pages` 分支。你不需要把 `deploy.yml` 放在 `gh-pages` 分支，因为 GitHub Actions 会根据你在 `deploy.yml` 中的配置将文件推送到 `gh-pages` 分支。

### 最终文件结构

假设你的仓库有以下文件结构：

```
.
├── .github
│   └── workflows
│       └── deploy.yml   # 这个文件应该放在 master 分支下
├── content
├── themes
├── static
├── config.toml
├── public/   # 这是 Hugo 构建的输出文件目录，GitHub Pages 会从这里部署网站
```

### 完整的 `deploy.yml` 示例

```yaml
name: Deploy Hugo site to GitHub Pages

on:
  push:
    branches:
      - master  # 触发工作流的分支是 master
  workflow_dispatch:  # 允许手动触发工作流

permissions:
  contents: read  # 读取仓库内容
  pages: write    # 写入 GitHub Pages
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false  # 允许多个任务并行运行，但不取消当前进行中的任务

jobs:
  build:
    runs-on: ubuntu-latest  # 使用 Ubuntu 最新版本的环境

    steps:
      # 检出仓库代码
      - name: Checkout code
        uses: actions/checkout@v4

      # 设置 Hugo 环境
      - name: Set up Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: '0.128.0'  # 你可以根据需要更改 Hugo 版本

      # 构建 Hugo 网站
      - name: Build the Hugo site
        run: hugo --minify  # 生成静态文件并进行最小化处理

      # 上传构建的静态文件到 GitHub Pages
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./public  # Hugo 构建的文件会被输出到 `public` 目录

  deploy:
    runs-on: ubuntu-latest
    needs: build  # 依赖于 build 作业，确保先构建后部署
    steps:
      # 将构建的静态文件部署到 GitHub Pages
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
        with:
          branch: gh-pages  # 将构建的文件推送到 `gh-pages` 分支
          folder: ./public  # Hugo 输出的静态文件目录
```

### 部署流程

- **提交 `deploy.yml` 到 `master` 分支**：
  将 `deploy.yml` 文件提交并推送到你的 `master` 分支。
  
  ```bash
  git add .github/workflows/deploy.yml
  git commit -m "Add GitHub Actions workflow for Hugo"
  git push origin master
  ```

- **GitHub Actions 执行**：
  - 当你向 `master` 分支推送更改时，GitHub Actions 将会自动触发构建和部署流程。
  - 构建完成后，静态文件将被推送到 `gh-pages` 分支，并通过 GitHub Pages 提供服务。

### 访问 GitHub Pages

- 部署完成后，访问你的 GitHub Pages 网站：
  ```
  https://<你的 GitHub 用户名>.github.io/<仓库名>/
  ```
  比如，如果用户名是 `johnDoe`，仓库名是 `myHugoBlog`，你可以访问：
  ```
  https://johnDoe.github.io/myHugoBlog/
  ```

### 总结

- 将 `deploy.yml` 文件放在 **`master` 分支** 下的 `.github/workflows/` 目录中。
- 配置 GitHub Actions 触发条件为 `push` 到 `master` 分支。
- 使用 Hugo 进行网站构建，将构建结果推送到 `gh-pages` 分支作为 GitHub Pages 的源。
