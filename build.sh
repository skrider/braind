#!/bin/bash


file=$1
title=$(basename $file)

config='{}'
# grep start of frontmatter
rg ^\-\-\-$ $file
# read config if file has frontmatter (check exit code)
if [[ $? == 0 ]]
then
    # Read and store as json because jq is good
    config=$(sed '/^\.\.\.$/Q;1d' $file | yq -o=json)
fi
# merge with default
config=$(echo $default_config $config | jq -s '.[0] * .[1]')

_build_tags () {
    echo bbuilding tags
}
_build_tags &

_build_docs () {
    echo building docs
}
_build_docs &
# get old frontmatter from database
old_config=$(cat $frontmatter_db | jq ".[\"$config\"]")

