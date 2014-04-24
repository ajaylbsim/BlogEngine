function globalToModule() {
    log.debug("called.", globalVar);
}

var globalVar = 33;

exports.prop = 22;

globalToModule.func = globalToModule;

module.exports = globalToModule;



