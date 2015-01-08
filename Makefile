PYTHON = $(shell which python 2.7)
ENV = $(CURDIR)/env

virtual-env:
	virtualenv --python=$(PYTHON) $(ENV)

env: virtual-env
	$(ENV)/bin/pip install -r requirements.txt

run: env
	$(ENV)/bin/python *.py

clean:
	rm -rf $(ENV)
