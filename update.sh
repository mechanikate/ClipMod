#!/bin/sh
rm -r paperclips

wget -m http://www.decisionproblem.com/paperclips/

mkdir -p original 
mv www.decisionproblem.com/paperclips/* original
rm -rf www.decisionproblem.com
find . -name '*\?*' | while read -r path ; do
    mv "$path" "${path%\?*}"
done

cp original/index2.html original/index2-all.html
diff -crB original/ ./ > dfile.patch
