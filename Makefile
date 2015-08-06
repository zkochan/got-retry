test:
	@./node_modules/.bin/tap test/test-*.js

include node_modules/make-lint/index.mk

.PHONY: test
