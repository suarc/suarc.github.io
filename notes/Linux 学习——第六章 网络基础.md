# Linux 学习——第六章 网络基础

## 一、基础信息及其查看

### （一）网络接口

#### 1、概念

研究网络，先要认识一下负责网络功能的结构 —— 网络接口。

Linux 将系统用来发送和接收网络数据的逻辑接口称为**网络接口**（类似 Windows 的网络适配器）。网络接口不一定对应着一张物理网卡，也有负责虚拟网络服务的虚拟网络接口（例如 VMware 的虚拟网络适配器）。

### 2、查看方法

可以使用下面的命令查看网络接口：

```bash
ip addr
```

输出如下：

```bash
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1460 qdisc mq state UP group default qlen 1000
    link/ether 00:15:5d:9f:6b:99 brd ff:ff:ff:ff:ff:ff
    inet 172.27.60.64/20 brd 172.27.63.255 scope global eth0
       valid_lft forever preferred_lft forever
    inet6 fe80::215:5dff:fe9f:6b99/64 scope link
       valid_lft forever preferred_lft forever
```

我们观察到这里有两个接口，分别是 lo、eth0。

- lo：localhost（回环地址），即 127\.0\.0\.1。
- eth0：以太网（Ethernet）地址。这里可以看见以太网 IP 地址是 172\.27\.60\.64。

上面的显示结果比较复杂，如果想查看简单的网络信息，可以输入下面的命令：

```bash
ip -br addr
```

结果是：

```
lo               UNKNOWN        127.0.0.1/8 ::1/128
eth0             UP             172.27.60.64/20 fe80::215:5dff:fe9f:6d96/64
```

\-br 开关表示简洁显示。

### （二）IP地址：CIDR

上面查询出来的 IP 地址是 172\.27\.60\.64/20。这是 CIDR 表示法，意味着 32 位 IP 地址（二进制）的前 20 位是网络地址，而剩下的 12 位则是主机地址，用于标识该网络中的主机。

### （三）默认网关与路由

假设我们的计算机现在要访问 1\.1\.1\.1。显然这个 IP 地址并不属于本地局域网，因此需要对外转发（**查询路由表**，找到下一跳）。

可以使用下面的命令查询默认路由：

```bash
ip route
```

出现的结果是：

```bash
default via 172.27.48.1 dev eth0 proto kernel onlink
172.27.48.0/20 dev eth0 proto kernel scope link src 172.27.60.64
```

这几行可以理解为：

- default via 172\.27\.48\.1：默认情况下，把需要转发到其他网络的数据交给 172\.27\.48\.1 这个下一跳。
- dev eth0：使用 eth0 网络接口。
- 172\.27\.48\.0/20 dev eth0：这个本地网段可以通过该接口直接到达。

### （四）套接字、端口

IP 地址负责确认主机，而端口负责确认 TCP/UDP 进程。在操作系统中，可提供网络功能的进程往往会**监听**一定的端口，从而当数据发送到该端口时，可以被提供给进程做一定的操作。

可以使用下面的命令查看系统中被监听的端口：

```bash
ss -lnt
```

各个部分的意义如下：

- ss —— 查看套接字。套接字 = 协议 \+ 地址 \+ 端口，例如 TCP/UDP/IP \+ 127\.0\.0\.1 \+ 3000 就是一个套接字。
- \-l开关 —— Listening，只显示监听中的套接字。
- \-n开关 —— Number，以数字形式展示地址和端口。
- \-t开关 —— TCP，查看 TCP 套接字（忽略 UDP 协议等）。

上面命令的结果如下：

```bash
State         Recv-Q        Send-Q               Local Address:Port               Peer Address:Port       Process
LISTEN        0             4096                 127.0.0.53%lo:53                      0.0.0.0:*
LISTEN        0             4096                    127.0.0.54:53                      0.0.0.0:*
```

这里展示了被监听的地址、端口及监听端口的进程。

注意：监听 127\.0\.0\.1 意味着只有本机可达，而 0\.0\.0\.0 意味着监听本机的所有 IPv4 地址（127\.0\.0\.1、192\.168\.0\.1 等）。不过数据报仍然可能被防火墙等挡下，因此 0\.0\.0\.0 不是接受一切数据报。

### （五）PING

ping 命令可利用和 IP 协议同级的 ICMP 协议，查询网络的连通性。基本语法如下：

```bash
ping -c ping次数 目标地址
```

输出结果一般是：

```bash
PING www.a.shifen.com (110.242.69.21) 56(84) bytes of data.
64 bytes from 110.242.69.21: icmp_seq=1 ttl=51 time=20.1 ms
64 bytes from 110.242.69.21: icmp_seq=2 ttl=51 time=19.6 ms
64 bytes from 110.242.69.21: icmp_seq=3 ttl=51 time=19.7 ms
64 bytes from 110.242.69.21: icmp_seq=4 ttl=51 time=20.0 ms
64 bytes from 110.242.69.21: icmp_seq=5 ttl=51 time=19.7 ms

--- www.a.shifen.com ping statistics ---
5 packets transmitted, 5 received, 0% packet loss, time 4004ms
rtt min/avg/max/mdev = 19.563/19.781/20.065/0.191 ms
```

几个重要信息如下：



- icmp\_seq	—— ICMP 报文的序号。
- ttl —— IP 数据包的生存时间限制。
- time —— 报文往返时间（RTT，Round\-Trip Time）。
- 丢包率 —— 数据包传输失败的比例。



TTL 是为了防止报文在网络中陷入死循环而设置的 “跳数限制”。一般报文经过路由器 TTL 都会减1，等 TTL 减为 0 后报文会被路由器丢弃。

ping 命令后的地址可以使用域名，但不能输入协议、端口（ping 和 http 协议等没有关系），这样可以用于测试域名 DNS 是否解析成功。

### （六）DNS

#### 1、全局 DNS 配置查看

Linux 中查看 DNS 的命令是：

```bash
resolvectl status
```

一种结果是：

```bash
Global
         Protocols: -LLMNR -mDNS -DNSOverTLS DNSSEC=no/unsupported
  resolv.conf mode: stub
Link 19 (eth0)
    Current Scopes: DNS
         Protocols: +DefaultRoute -LLMNR -mDNS -DNSOverTLS DNSSEC=no/unsupported
Current DNS Server: 192.168.1.1
       DNS Servers: 192.168.1.1 223.6.6.6
     Default Route: yes
```

这里显示出了网络接口 eth0 的首选 DNS 服务器 192\.168\.1\.1、备选 DNS 服务器 223\.6\.6\.6。

#### 2、查询具体网站的 DNS

查询某个网站的 DNS 解析信息的命令是：

```bash
resolvectl query example.com
```

这类似 Windows 的 nslookup 命令。结果是：

```bash
example.com: 172.66.147.243                    -- link: eth0
             104.20.23.154                     -- link: eth0
             2606:4700:10::ac42:93f3           -- link: eth0
             2606:4700:10::6814:179a           -- link: eth0
-- Information acquired via protocol DNS in 5.5ms.
-- Data is authenticated: no; Data was acquired via local or encrypted transport: no
-- Data from: network
```

可以看出，通过 eth0 网络接口，能够查询到 example\.com 的四个 IP 地址。

此外，也可以用下面的 getent 命令查询：

```bash
getent ahosts example.com
```

getent 通过 Linux 的 NSS（Name Service Switch）机制获取主机地址信息，接近普通应用程序通过系统接口进行 DNS 解析时所使用的路径。

还可以用如下命令查看 DNS 配置信息：

```
cat /etc/resolv.conf
```

部分结果如下：

```bash
nameserver 127.0.0.53
```

这里的 127\.0\.0\.53 并不是公网上的一个 DNS 服务器的地址，而是 Linux 操作系统中 DNS 解析服务的监听地址。不能擅自更改这个 DNS 地址，因为 Ubuntu 的解析配置可能由 NetworkManager、systemd\-resolved 或其他网络管理组件维护。