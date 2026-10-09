---
title: Docker常用命令
date: 2026-04-02
minutes: 8
tags: [DevOps, Docker]
excerpt: Docker的常用命令
---

| **命令**              | **功能**                                                     | **示例**                                                     |
| --------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `docker run`          | 启动一个新的容器并运行命令                                   | `docker run -d ubuntu`                                       |
| `docker ps`           | 列出当前正在运行的容器                                       | `docker ps`                                                  |
| `docker port`         | 查看指定 （ID 或者名字）容器的某个确定端口映射到宿主机的端口号 | `docker port bf08b7f2cd89`                                   |
| `docker  top`         | 查看容器内部运行的进程                                       | `docker top c6ce2bc8ae5d `                                   |
| `docker ps -a`        | 列出所有容器（包括已停止的容器）                             | `docker ps -a`                                               |
| `docker build`        | 使用 Dockerfile 构建镜像                                     | `docker build -t my-image .`                                 |
| `docker images`       | 列出本地存储的所有镜像                                       | `docker images`                                              |
| `docker pull`         | 从 Docker 仓库拉取镜像                                       | `docker pull ubuntu`                                         |
| `docker push`         | 将镜像推送到 Docker 仓库                                     | `docker push my-image`                                       |
| `docker exec`         | 在运行的容器中执行命令                                       | `docker exec -it container_name bash`                        |
| `docker stop`         | 停止一个或多个容器                                           | `docker stop container_name`                                 |
| `docker start`        | 启动已停止的容器                                             | `docker start container_name`                                |
| `docker restart`      | 重启一个容器                                                 | `docker restart container_name`                              |
| `docker rm`           | 删除一个或多个容器                                           | `docker rm container_name`                                   |
| `docker rmi`          | 删除一个或多个镜像                                           | `docker rmi my-image`                                        |
| `docker logs`         | 查看容器的日志                                               | `docker logs container_name`                                 |
| `docker inspect`      | 获取容器或镜像的详细信息                                     | `docker inspect container_name`                              |
| `docker exec -it`     | 进入容器的交互式终端通过此命令进入容器，若在此容器退出(`exit`)，则容器不会停止 | `docker exec -it container_name /bin/bash`                   |
| `docker attach `      | 进入容器的交互式终端通过此命令进入容器，若在此容器退出(`exit`)，则容器会停止 | `docker attach  container_name /bin/bash`                    |
| `docker network ls`   | 列出所有 Docker 网络                                         | `docker network ls`                                          |
| `docker volume ls`    | 列出所有 Docker 卷                                           | `docker volume ls`                                           |
| `docker-compose up`   | 启动多容器应用（从 `docker-compose.yml` 文件）               | `docker-compose up`                                          |
| `docker-compose down` | 停止并删除由 `docker-compose` 启动的容器、网络等             | `docker-compose down`                                        |
| `docker info`         | 显示 Docker 系统的详细信息                                   | `docker info`                                                |
| `docker version`      | 显示 Docker 客户端和守护进程的版本信息                       | `docker version`                                             |
| `docker stats`        | 显示容器的实时资源使用情况                                   | `docker stats`                                               |
| `docker login`        | 登录 Docker 仓库                                             | `docker login`                                               |
| `docker logout`       | 登出 Docker 仓库                                             | `docker logout`                                              |
| `docker export`       | 导出某个容器快照到本地文件                                   | `docker export 1e560fca3906 > ubuntu.tar`                    |
| `docker import`       | 导入容器快照                                                 | `cat docker/ubuntu.tar | docker import - test/ubuntu:v1`将快照文件 ubuntu.tar 导入到镜test/ubuntu:v1`#也可以通过指定 URL 或者某个目录来导入 docker import http://example.com/exampleimage.tgz example/imagerepo` |
|                       |                                                              |                                                              |

