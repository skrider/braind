#!/bin/bash

# constants
default_config='{ '\
'   "brain3-template": "note",'\
'   "brain3-preview": 1'\
'}'

# set global variables
if [[ x$1 == x ]]; then
    CWD=$(pwd)
else
    CWD=$1
fi

# cache dir
dotbraind=$CWD/.braind
frontmatter_db=$dotbraind/cache/docs.json

# init directories if not created yet
if [[ ! -d $dotbraind/cache ]]; then
    mkdir -p $dotbraind/cache
fi
if [[ ! -x $frontmatter_db ]]; then
    echo '{}' > $frontmatter_db
fi

_build() {
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
}

fd --absolute-path --base-directory $CWD/mem .md \
    | entr -cn _build /_

