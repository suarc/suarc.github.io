# Linux 学习——第五章 服务与 systemd

## 一、服务

### （一）什么是服务

以 Nginx 网络服务为例，下面是程序、进程、服务三个概念的分辨：

| 概念 | 含义 | 例子 |
| :---: | :---: | :---: |
| 程序 | 磁盘上的程序代码或可执行文件 | Nginx 程序文件 |
| 进程 | 程序运行时，操作系统管理的运行实例（运行中的程序） | 正在运行的 Nginx 进程 |
| 服务 | 按一定方式持续提供功能、需要被管理的系统组件或应用 | Web 服务、SSH 服务 |

程序是运行的基础，进程是运行的实例，服务强调 **持续提供 **的功能和管理方式。如果我们需要运营一个 Nginx http 服务器，需要长期、持续地运行 Nginx 程序，则可以将 Nginx 升级为一个服务，使之由系统管理、按一定方式持续提供功能。

三者不是严格的一一对应关系，一个服务可能涉及多个进程，一个进程也不一定属于系统服务。

### （二）如何管理服务

Ubuntu 24\.04 使用 systemd（System Daemon，系统进程）作为服务管理的主要工具。负责与 systemd 交互的常用命令是 systemctl（System Control，系统控制）。

先可以大概做出如下的划分：

- systemd：负责管理系统启动、服务以及其他系统单元的 **管理程序**。
- systemctl：你在命令行中使用的管理工具，可操作 systemd。
- service：你要管理的某个具体服务，例如 SSH 服务或 Web 服务。

大致流程如下：管理命令 ==\> systemctl =\> systemd。

## 二、查看和管理服务

### （一）查看服务

#### 1、基础用法

可以使用 systemctl status 命令查询现有服务。如果要查看启动失败的服务，可以输入 \-\-failed 参数。

```bash
systemctl status
systemctl --failed
```

输入该命令后，信息会独占整个终端界面。按下 q（Quit）以退出。

```bash
DESKTOP-NBI1N2K
    State: running
    Units: 360 loaded (incl. loaded aliases)
     Jobs: 0 queued
   Failed: 0 units
    Since: Thu 2026-11-05 14:36:26 CST; 5min ago
  systemd: 255.4-1ubuntu8.17
   CGroup: /
           ├─init.scope
           │ └─1 /sbin/init
           ├─non-systemd
           │ ├─319 /init
           │ ├─320 /init
           │ ├─321 -bash
           │ ├─521 systemctl status
           │ └─522 less
           ├─system.slice
           │ ├─cron.service
           │ │ └─177 /usr/sbin/cron -f -P
           │ ├─dbus.service
           │ │ └─178 @dbus-daemon --system --address=systemd: --nofork --nopidfile --systemd-activation --syslog-only
············
```

#### 2、拓展参数

直接使用 systemctl 看到的是树状的所有服务的信息。下面的命令可以以指定方案查看指定的服务：

```
systemctl list-units --type=service --state=running
```

输出如下：

```
  UNIT                        LOAD   ACTIVE SUB     DESCRIPTION
  cron.service                loaded active running Regular background program processing daemon
  dbus.service                loaded active running D-Bus System Message Bus
  getty@tty1.service          loaded active running Getty on tty1
  rsyslog.service             loaded active running System Logging Service
  systemd-journald.service    loaded active running Journal Service
  systemd-logind.service      loaded active running User Login Management
  systemd-resolved.service    loaded active running Network Name Resolution
  systemd-timesyncd.service   loaded active running Network Time Synchronization
  systemd-udevd.service       loaded active running Rule-based Manager for Device Events and Files
  unattended-upgrades.service loaded active running Unattended Upgrades Shutdown
  user@1000.service           loaded active running User Manager for UID 1000
  wsl-pro.service             loaded active running Bridge to Ubuntu Pro agent on Windows
Legend: LOAD   → Reflects whether the unit definition was properly loaded.
        ACTIVE → The high-level unit activation state, i.e. generalization of SUB.
        SUB    → The low-level unit activation state, values depend on unit type.
12 loaded units listed.
```

先看这个指令的开关：

1、list\-units：使用 systemctl 列出单元。

2、\-\-type=service：只查看服务类型。systemctl 管理的不仅是服务，还有其他类型的单元，例如挂载点、定时器和套接字，因此这里需要指定。 

3、\-\-state=running：只查看正在运行的服务。

再重点关注三个字段：

| 字段 | 含义 |
| :---: | :---: |
| UNIT | 单元名称 |
| LOAD | 单元定义是否已加载 |
| ACTIVE | 单元的总体活动状态 |

#### 3、查看具体服务

找到需要查看的服务的 UNIT 名字后（这里是 cron\.service），可以使用下面的命令，进一步查看该服务的详细信息：

```bash
systemctl status cron.service
```

结果如下：

```bash
● cron.service - Regular background program processing daemon
     Loaded: loaded (/usr/lib/systemd/system/cron.service; enabled; preset: enabled)
     Active: active (running) since Thu 2026-11-05 14:36:27 CST; 15min ago
       Docs: man:cron(8)
   Main PID: 177 (cron)
      Tasks: 1 (limit: 4639)
     Memory: 560.0K (peak: 1.5M)
        CPU: 23ms
     CGroup: /system.slice/cron.service
             └─177 /usr/sbin/cron -f -P
```

从中我们可以得到如下信息：

- 服务当前是否处于活动状态（上面是 active）；
- 服务最近的启动信息；
- 相关进程的 PID（上面是177）
- 部分近期日志。

注意：active 并不意味着服务 running。一些一次性任务执行完后可能显示 active \(exited\)，它们的工作已经完成，不一定意味着存在一个持续运行的进程。

### （二）管理服务

#### 1、启动、停止、重启

以服务 example\.service 为例：

```bash
sudo systemctl start example.service
sudo systemctl stop example.service
sudo systemctl restart example.service
```

以上三个命令，分别是启动服务、停止服务、重启服务。

服务器启动/停止涉及到系统方面的影响，因此需要使用 sudo 命令临时提权 root。

#### 2、开机自启动

可以使用 enable 和 disable 参数来设置服务的开机自启动。例如：

```bash
sudo systemctl enable nginx.service
sudo systemctl disable nginx.service
```

这两个命令分别开启/关闭了 nginx 服务的开机自启动。

注意：这两个命令只设置了是否开机自启动，并不会立即启动/关闭服务。如果需要立即生效，则可以使用 \-\-now 参数。例如：

```
sudo systemctl enable --now nginx.service
```

## 三、判断服务失败原因

如果服务无法启动，则单纯的 systemctl start 并不能解决问题，这时就要定位服务的日志。

可以先使用 systemctl status 查看服务的状态，再使用命令 journalctl（Journal Control）查询服务的日志：

```bash
journalctl -u 服务名.service
```

\-u 意味着使用服务的单元名来查询。