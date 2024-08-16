# syntax=docker/dockerfile:1 
FROM ubuntu:22.04

# https://qiita.com/haessal/items/0a83fe9fa1ac00ed5ee9
ENV DEBCONF_NOWARNINGS=yes
# https://qiita.com/yagince/items/deba267f789604643bab
ENV DEBIAN_FRONTEND=noninteractive
# https://qiita.com/jacob_327/items/e99ca1cf8167d4c1486d
ENV APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE=1

# https://stackoverflow.com/a/25423366
SHELL ["/bin/bash", "-c"]

# https://genzouw.com/entry/2019/09/04/085135/1718/
RUN sed -i 's@archive.ubuntu.com@ftp.jaist.ac.jp/pub/Linux@g' /etc/apt/sources.list

# Install basic packages
RUN apt-get update -qq && apt-get install -y sudo aptitude build-essential lsb-release wget gnupg2 curl emacs libcanberra-gtk*
RUN aptitude update -q

# Install npm
RUN apt-get update -qq && apt install -y nodejs npm
RUN npm install n -g && n stable
RUN apt purge -y nodejs npm && apt autoremove -y
