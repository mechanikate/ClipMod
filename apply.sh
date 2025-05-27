#!/bin/bash
colored_echo() {
	local WHITE="\e[1;37m"
	local LIGHT_GRAY="\e[1;90m"
	local NO_COLOUR="\e[0m"
	printf "[${WHITE}Clip${LIGHT_GRAY}Mod${NO_COLOUR}] $1\n"
}
colored_echo 'Downloading Universal Paperclips site...'
wget -m http://www.decisionproblem.com/paperclips/
colored_echo 'Moving directory name to "original"...'
mkdir -p original
mv www.decisionproblem.com/paperclips/* original
colored_echo 'Removing old folders...'
rm -rf www.decisionproblem.com

colored_echo 'Copying game to current folder...'
cp ./original/* .
colored_echo 'Preparing patches...'
find . -name '*\?*' -type f -exec sh -c '
for fp; do
  fn=${fp##*/}
  mv "$fp" "${fp%/*}/${fn%%\?*}"
done' sh {} +
colored_echo 'Patching...'
patch -p1 < dfile.patch
colored_echo 'All done! Open index2.html to play.'

