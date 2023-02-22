#!/usr/bin/env bash
# Bash completion for invoke

strindex() {
  x="${1%%$2*}"
  [[ "$x" = "$1" ]] && echo -1 || echo "${#x}"
}

trim()
{
  local trimmed="$1"

  # Strip leading space.
  trimmed="${trimmed## }"
  # Strip trailing space.
  trimmed="${trimmed%% }"

  echo "$trimmed"
}


_invoke() {
  query=${COMP_WORDS[1]}
  COMPREPLY=()
  lines=$(invoke ls "$query*")
  for line in $lines; do
    if [[ "$line" != "$query" ]]; then
      COMPREPLY+=("$line")
    fi
  done
}

complete -F _invoke invoke
echo "Done"
