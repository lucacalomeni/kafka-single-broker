#!/bin/bash

docker exec broker kafka-topics --bootstrap-server broker:29092 --create --if-not-exists --topic my-topic-3 --replication-factor 1 --partitions 1
docker exec broker kafka-topics --bootstrap-server broker:9092 --list 
