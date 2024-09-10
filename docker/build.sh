#!/bin/bash

set -x
GIT_USERNAME=`git config user.name`
GIT_USEREMAIL=`git config user.email`
GIT_SSHKEY=~/.ssh/id_rsa
BUILD_MODE=release

SUDO_STRING=`groups|grep docker`
SUDO=""
if [ -z "$SUDO_STRING" ]; then
  SUDO="sudo "
fi

while [[ $# -gt 0 ]]; do
    case $1 in
        -u|--user)
            GIT_USERNAME="$2"
            shift
            shift
            ;;
        -e|--email)
            GIT_USEREMAIL="$2"
            shift
            shift
            ;;
        --help)
            echo "build.sh [--user GIT_USERNAME][--email GIT_EMAIL]"
            exit 0
            ;;
        --)
            shift
            break
            ;;
        -*|--*)
            echo "Unknown option $1"
            exit 1
            ;;
        *)
            POSITIONAL_ARGS+=("$1") # save positional arg
            shift # past argument
            ;;
    esac
done

if [ -n "$BUILD" ]; then
    if [ "$BUILD" = "DEBUG" ]; then
        BUILD_MODE=debug
    elif [ "$BUILD" = "RELEASE" ]; then
        BUILD_MODE=release
    else
        echo "Unknown BUILD mode: $BUILD"
        exit 1
    fi
fi

#　dockerを実行
EXEC_DIR="$(pwd)"
EXEC_DIR="${EXEC_DIR%/*}"
cd $EXEC_DIR

DOCKER_BUILDKIT=1 $SUDO docker build \
    -f docker/Dockerfile \
    -t rolimoa:ubuntu22.04 .

# BUILD_MODE=releseの場合Dockerfile.releaseもbuild
if [ "$BUILD_MODE" = "release" ]; then
    DOCKER_BUILDKIT=1 $SUDO docker build \
        -f docker/Dockerfile.release \
        -t rolimoa-release:ubuntu22.04 .
fi