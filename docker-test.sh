#!/bin/bash -xe

export DOCKER_IMAGE=${DOCKER_IMAGE-orbs}
export DOCKER_TAG=${DOCKER_TAG-$(git rev-parse --abbrev-ref HEAD | sed -e 's/\//-/g')}

cd e2e
./build.sh
./test.sh
# if [ -z "$STAY_UP" ]; then
#     start_test_environment
# else
#     if ! restart ; then
#         start_stop_environment
#     fi
# fi

# sleep ${STARTUP_WAITING_TIME-30}
# run_e2e_test 172.2.2.9 172.2.2.4
# export EXIT_CODE=$?
# docker ps -a --no-trunc > logs/docker-ps

# if [ -z "$STAY_UP" ] ; then
#     stop_test_environment
# fi
exit $EXIT_CODE
