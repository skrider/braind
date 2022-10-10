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

fd --absolute-path --base-directory $CWD/mem .md \
    | entr -cn _build /_

