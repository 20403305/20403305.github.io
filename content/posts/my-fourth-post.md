+++
title = '主题和hugo兼容问题 || 手动升级 Hugo 版本'
date = 2024-12-13T18:57:39+08:00
summary = "升级 Hugo"
draft = false

+++




从错误日志

```
Module "ananke" is not compatible with this Hugo version: Min 0.128.0; run "hugo mod graph" for more information.
```

### 问题原因
`Ananke` 主题要求使用 Hugo 版本至少为 `0.128.0`，而你当前使用的 Hugo 版本是 `v0.123.7`，因此会发生兼容性问题。

此外，错误的根本原因也包括以下几点：

```
error calling partial: "/root/myblog/themes/ananke/layouts/partials/site-style.html:1:8": execute of template failed: template: partials/site-style.html:1:8: executing "partials/site-style.html" at <partialCached "func/style/GetMainCSS" "style/GetMainCSS">: error calling partialCached: "/root/myblog/themes/ananke/layouts/partials/func/style/GetMainCSS.html:71:23": execute of template failed: template: partials/func/style/GetMainCSS.html:71:23: executing "partials/func/style/GetMainCSS.html" at <css>: can't evaluate field Sass in type interface {}
```

这个错误表明，主题的模板代码在处理样式时出错，尤其是在尝试加载或应用 `Sass` 样式时。

### 解决方法

1. **升级 Hugo 到兼容版本**  
   最直接的解决方法是将 Hugo 升级到 `v0.128.0` 或更高版本。可以通过以下命令来升级 Hugo：

   ```bash
   sudo apt-get update
   sudo apt-get install hugo
   ```

   或者，如果你希望安装特定版本的 Hugo，可以使用 [Hugo 的官方发布页面](https://github.com/gohugoio/hugo/releases) 下载并安装最新版本。

2. **使用与当前 Hugo 版本兼容的主题**  
   如果你不希望升级 Hugo，另一个选择是使用与 `v0.123.7` 版本兼容的 Hugo 主题。你可以尝试更换主题，或者寻找兼容旧版 Hugo 的主题。

   一些兼容老版本 Hugo 的主题可以在 [Hugo 官方主题库](https://themes.gohugo.io/) 中找到。

3. **手动修改主题模板（不推荐）**  
   如果你有能力，可以尝试修改 `Ananke` 主题的模板，使其兼容当前 Hugo 版本。这通常涉及到修改主题的 `layouts/partials/` 目录下的样式文件，特别是与 `Sass` 相关的部分。这个方法比较复杂且容易出错，不建议初学者使用。

4. **检查 `Sass` 配置**  
   如果你希望继续使用当前的 Hugo 版本，并且想保留 `Ananke` 主题，可以尝试通过以下方式禁用或修复 `Sass` 配置：
   
   - 在 `config.toml` 文件中禁用 `Sass` 配置，或将其修改为一个兼容的配置。检查主题文档，了解如何处理或禁用 `Sass`。

   ```toml
   [params]
     disableSass = true
   ```

   或者如果你想继续使用 Sass，可以尝试安装和配置 Sass 工具链，使其能正确编译主题中的 Sass 文件。

### 总结

- **最简单的解决方案**是将 Hugo 升级到 `v0.128.0` 或更高版本，以确保 `Ananke` 主题兼容。
- 如果不想升级 Hugo，可以选择使用一个兼容旧版本 Hugo 的主题。
- 如果你对模板修改有经验，也可以尝试调整 `Ananke` 主题中的代码，但这是一个较为复杂的方案。


---

看起来你在 Ubuntu 系统上安装的 Hugo 版本仍然是 `v0.123.7`，并且通过 `apt-get` 安装的 Hugo 版本已经是最新的，但它依然不符合你所需要的版本（`0.128.0` 或更高版本）。

### 解决方法：手动升级 Hugo 版本

Ubuntu 的 `apt` 包管理器提供的 Hugo 版本可能会比较老，因此你需要手动升级到 Hugo 的最新版本。你可以按照以下步骤来安装 Hugo 的最新版本。

### 步骤 1：卸载当前版本的 Hugo

首先，卸载系统中当前安装的 Hugo 版本：

```bash
sudo apt-get remove hugo
```

### 步骤 2：下载最新的 Hugo 版本

接下来，从 Hugo 的 [GitHub 发布页面](https://github.com/gohugoio/hugo/releases) 下载最新的 Hugo 版本。你可以通过以下命令来下载：

1. 访问 [Hugo Releases](https://github.com/gohugoio/hugo/releases) 页面，找到最新的版本（`v0.128.0` 或更高版本）。
2. 下载对应你系统的 Hugo 二进制文件（例如，`hugo_extended_0.128.0_linux-amd64.tar.gz`）。

或者，你可以使用以下命令下载最新版本的 Hugo：

```bash
# 下载 Hugo v0.128.0 的 Linux 版本
wget https://github.com/gohugoio/hugo/releases/download/v0.128.0/hugo_extended_0.128.0_linux-amd64.tar.gz
```

### 步骤 3：解压并安装 Hugo

解压下载的压缩包，并将 `hugo` 二进制文件移到 `/usr/local/bin` 目录下，使其全局可用：

```bash
tar -xvzf hugo_extended_0.128.0_linux-amd64.tar.gz
sudo mv hugo /usr/local/bin/
```

### 步骤 4：验证安装

安装完成后，验证是否成功安装了最新版本的 Hugo：

```bash
hugo version
```

你应该看到类似如下的输出，表明你已经安装了 Hugo `v0.128.0` 或更高版本：

```bash
hugo v0.128.0+extended linux/amd64 BuildDate=2024-12-14T01:07:23Z VendorInfo=ubuntu:0.128.0-1ubuntu0.2
```

### 步骤 5：重启 Hugo 服务

完成升级后，你可以重新启动 Hugo 开发服务器：

```bash
hugo server
```

现在，`Ananke` 主题应该可以正常运行，并且与你的 Hugo 版本兼容。

### 总结

1. **卸载旧版本的 Hugo**，并通过手动下载和安装的方式安装最新版本。
2. **下载和解压最新的 Hugo 二进制文件**。
3. **验证安装**，确保使用的是兼容 `Ananke` 主题的 Hugo 版本。

通过这种方式，你应该能够解决兼容性问题，并成功运行 Hugo 网站。