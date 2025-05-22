wget -m http://www.decisionproblem.com/paperclips/
mkdir -p original
mv www.decisionproblem.com/paperclips/* original
rm -rf www.decisionproblem.com

cp ./original/* .
find . -name '*\?*' -type f -exec sh -c '
for fp; do
  fn=${fp##*/}
  mv "$fp" "${fp%/*}/${fn%%\?*}"
done' sh {} +

patch -p1 < dfile.patch

