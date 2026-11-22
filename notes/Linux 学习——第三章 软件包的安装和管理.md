# Linux 学习——第三章 软件包的安装和管理

## 一、软件包管理器

Linux 操作系统中，软件包管理器可以查找、安装、更新和卸载软件，还能处理软件之间的依赖关系。

不同 Linux 发行版有不同的包管理器，Ubuntu 常用的软件包管理工具是 apt。

由于安装软件涉及到系统权限的操作，因此需要使用 sudo 命令临时提权为 root。

### （一）索引 —— apt update

联网从已配置的软件源获取最新的软件包信息（索引）。软件包索引可以帮助系统了解软件包的列表、版本、下载地址。

```bash
asd@asd-VMware-Virtual-Platform:~$ sudo apt update
[sudo] asd 的密码：
获取:1 http://security.ubuntu.com/ubuntu noble-security InRelease [126 kB]
······
获取:33 http://security.ubuntu.com/ubuntu noble-security/multiverse Translation-en [12.1 kB]
已下载 12.3 MB，耗时 21秒 (584 kB/s)
正在读取软件包列表... 完成
正在分析软件包的依赖关系树... 完成
正在读取状态信息... 完成
有 345 个软件包可以升级。请执行 ‘apt list --upgradable’ 来查看它们。
```

在安装软件前，一般需要先更新索引信息。

### （二）查询 —— apt search/show

使用 apt search 软件包名 可以在软件包中搜索软件。找到目标软件后，可以用 apt show 来查看软件的详细信息。

```
sudo apt search gcc
sudo apt show gcc
```

### （三）安装 —— apt install

确定需要的软件包后，可以输入 apt install 软件包名 来自动安装软件包。

```
sudo apt install gcc
```

### （四）升级 —— apt upgrade

可以使用 apt upgrade 来升级系统中可以升级的软件包。注意 apt upgrade 会一次性升级系统中多个可以升级的软件。

```
sudo apt upgrade
```

### （五）卸载 —— apt remove

如果不再需要一个软件，可以执行 apt remove 软件包 命令，将软件卸载。

```
sudo apt remove 包名
```