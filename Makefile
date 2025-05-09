WORKINGDIR = original
PAPERCLIPSDOMAIN = www.decisionproblem.com
PAPERCLIPSPATH = /paperclips
PAPERCLIPSURL = $(PAPERCLIPSDOMAIN)$(PAPERCLIPSPATH)

.ONESHELL:
setup:
	echo $(PAPERCLIPSURL) | xargs wget -m
	mkdir -p $(WORKINGDIR) || echo "mkdir-ing the working directory failed. Try running make clean first?"
	mv $(PAPERCLIPSURL)/* $(WORKINGDIR) 
	cp ./$(WORKINGDIR)/* .
	find $(WORKINGDIR) -name '*\?*' -type f -exec sh -c 'for fp; do fn=$${fp##*/}; mv "$$fp" "$${fp%/*}/$${fn%%\?*}"; done' sh {} +
	rm -r $(PAPERCLIPSDOMAIN) || echo "rm -r-ing the Paperclips source directory failed, make sure PAPERCLIPSDOMAIN didnt mess up"
	patch -p1 -t < dfile.patch

.ONESHELL:
update:
	wget -m $(PAPERCLIPSURL) 2>/dev/null
	mkdir -p $(WORKINGDIR) 
	mv $(PAPERCLIPSURL)/* $(WORKINGDIR) 
	find $(WORKINGDIR) -name '*\?*' -type f -exec sh -c 'for fp; do fn=$${fp##*/}; mv "$$fp" "$${fp%/*}/$${fn%%\?*}"; done' sh {} +
	diff -crB $(WORKINGDIR)/ ./ > dfile.patch 2>/dev/null

clean:
	rm -r $(WORKINGDIR) $(PAPERCLIPSDOMAIN)


