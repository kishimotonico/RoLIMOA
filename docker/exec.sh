#!/bin/bash

VERBOSE=""
CONTAINER_NAME="rolimoa"
EXEC_OPTION=

while [[ $# -gt 0 ]]; do
    case $1 in
        -N|--name)
            CONTAINER_NAME="$2"
            shift
            shift
            ;;
        -w|--workspace)
            EXEC_OPTION="$EXEC_OPTION -w $2"
            shift
            shift
            ;;
        -U|--user)
            EXEC_OPTION="$EXEC_OPTION --user $(id -u):$(id -g)"
            shift
            ;;
        -it)
            EXEC_OPTION="$EXEC_OPTION -it"
            shift
            ;;
        -v|--verbose)
            VERBOSE="--verbose"
            shift
            ;;
        --help)
            #echo "run.sh [ -D | --devel ] [ -C | --console ] [ -J | --jupyter ] [ choreonoid(default) | assembler | jypyter | python ]"
            echo "exec.sh "
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

## read arguments after '--'
while [[ $# -gt 0 ]]; do
    POSITIONAL_ARGS+=("$1") # save positional arg
    shift # past argument
done

set -- "${POSITIONAL_ARGS[@]}" # restore positional parameters


### program
if [ "$1" == "bash" -a "$2" == "-c" ]; then
    shift
    shift
    docker exec $EXEC_OPTION -- $CONTAINER_NAME $PROG bash -c "$*"
elif [ $# -gt 0 ]; then
    docker exec $EXEC_OPTION -- $CONTAINER_NAME $PROG "$@"
else
    docker exec -it $EXEC_OPTION $CONTAINER_NAME $PROG bash
fi